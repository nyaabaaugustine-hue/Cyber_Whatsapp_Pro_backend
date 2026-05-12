// src/app/api/admin/generate-key/route.js
// POST /api/admin/generate-key
// Admin-only: generate new license keys and save to Neon DB

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateLicenseKey } from "@/lib/keyGenerator";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function isAuthorized(request) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "").trim();
  return token && token === process.env.ADMIN_SECRET_TOKEN;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers: CORS });
  }

  try {
    const body = await request.json().catch(() => ({}));

    const {
      email = null,
      plan = "premium",   // "premium" | "pro" | "lifetime"
      durationDays = 365, // null = lifetime
      quantity = 1,       // generate multiple keys at once
    } = body;

    if (quantity < 1 || quantity > 50) {
      return NextResponse.json(
        { error: "Quantity must be between 1 and 50." },
        { status: 400, headers: CORS }
      );
    }

    const isLifetime = plan === "lifetime" || durationDays === null;

    const keys = [];
    for (let i = 0; i < quantity; i++) {
      let key;
      let attempts = 0;

      // Ensure uniqueness (retry on collision — extremely rare)
      do {
        key = generateLicenseKey(plan);
        attempts++;
        if (attempts > 10) {
          return NextResponse.json(
            { error: "Could not generate a unique key. Try again." },
            { status: 500, headers: CORS }
          );
        }
      } while (
        await prisma.license.findUnique({ where: { license_key: key } })
      );

      const expiryDate = isLifetime
        ? null
        : new Date(Date.now() + durationDays * 86_400_000);

      const created = await prisma.license.create({
        data: {
          email,
          license_key: key,
          plan,
          active: true,
          expiry_date: expiryDate,
        },
      });

      keys.push({
        license_key: created.license_key,
        plan: created.plan,
        expiry: expiryDate ? expiryDate.toISOString().split("T")[0] : "Lifetime",
        created_at: created.created_at,
      });
    }

    return NextResponse.json(
      { success: true, generated: keys.length, keys },
      { headers: CORS }
    );
  } catch (err) {
    console.error("[admin/generate-key] Error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500, headers: CORS });
  }
}
