// src/app/api/verify-license/route.js
// POST /api/verify-license
// Called by Chrome extension to verify an activation key

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidKeyFormat } from "@/lib/keyGenerator";

// CORS headers — allow all origins so Chrome extension can reach the API
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Extension-ID",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request) {
  try {
    let body = null;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { valid: false, error: "Invalid JSON body." },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (!body || !body.licenseKey) {
      return NextResponse.json(
        { valid: false, error: "License key is required." },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const licenseKey = body.licenseKey.trim().toUpperCase();

    // 1. Basic format check (fast, no DB hit)
    if (!isValidKeyFormat(licenseKey)) {
      return NextResponse.json(
        { valid: false, error: "Invalid key format." },
        { status: 200, headers: CORS_HEADERS }
      );
    }

    // 2. Look up in Neon PostgreSQL via Prisma
    const license = await prisma.license.findUnique({
      where: { license_key: licenseKey },
    });

    if (!license) {
      return NextResponse.json(
        { valid: false, error: "License key not found." },
        { status: 200, headers: CORS_HEADERS }
      );
    }

    if (!license.active) {
      return NextResponse.json(
        { valid: false, error: "This license has been deactivated." },
        { status: 200, headers: CORS_HEADERS }
      );
    }

    // 3. Check expiry (null = lifetime)
    if (license.expiry_date && new Date(license.expiry_date) < new Date()) {
      // Auto-deactivate expired keys
      await prisma.license.update({
        where: { id: license.id },
        data: { active: false },
      });
      return NextResponse.json(
        { valid: false, error: "This license has expired." },
        { status: 200, headers: CORS_HEADERS }
      );
    }

    // 4. Mark activation timestamp on first use
    if (!license.activated_at) {
      await prisma.license.update({
        where: { id: license.id },
        data: { activated_at: new Date() },
      });
    }

    // 5. Return success — never expose internal IDs or emails
    return NextResponse.json(
      {
        valid: true,
        plan: license.plan,
        expiry: license.expiry_date
          ? license.expiry_date.toISOString().split("T")[0]
          : null,
        lifetime: license.expiry_date === null,
      },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err) {
    console.error("[verify-license] Error:", err);
    return NextResponse.json(
      { valid: false, error: "Server error. Please try again." },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
