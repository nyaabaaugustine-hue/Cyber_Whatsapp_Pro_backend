// src/app/api/verify-license/route.js
// POST /api/verify-license
// Called by Chrome extension to verify an activation key

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isValidKeyFormat } from "@/lib/keyGenerator";

// CORS headers
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  // FIX Bug 1: Added Authorization and X-Extension-ID to match all callers
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Extension-ID",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);

    // FIX Bug 2 & 3: Only require licenseKey; deviceId is optional (empty string is allowed)
    if (!body || !body.licenseKey) {
      return NextResponse.json(
        { valid: false, error: "License key is required." },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const { licenseKey, deviceId } = body;
    // Normalise deviceId — treat missing/empty as null so device binding works correctly
    const normalizedDeviceId = deviceId && deviceId.trim() ? deviceId.trim() : null;

    // 1. Basic format check (fast, no DB hit)
    if (!isValidKeyFormat(licenseKey.trim().toUpperCase())) {
      return NextResponse.json(
        { valid: false, error: "Invalid key format." },
        { status: 200, headers: CORS_HEADERS }
      );
    }

    // 2. Look up in Neon PostgreSQL via Prisma
    const license = await prisma.license.findUnique({
      where: { license_key: licenseKey.trim().toUpperCase() },
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

    // 2.5 Device Binding Check — only enforce if BOTH sides have a device ID
    if (license.device_id && normalizedDeviceId && license.device_id !== normalizedDeviceId) {
      return NextResponse.json(
        { valid: false, error: "License is already bound to another device." },
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

    // 4. Mark activation timestamp on first use (only when we have a real deviceId)
    if ((!license.activated_at || !license.device_id) && normalizedDeviceId) {
      await prisma.license.update({
        where: { id: license.id },
        data: {
          activated_at: license.activated_at || new Date(),
          device_id: license.device_id || normalizedDeviceId,
        },
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
