// src/app/api/admin/keys/route.js
// GET  /api/admin/keys         — list all licenses
// PATCH /api/admin/keys        — activate / deactivate a key

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isAuthorized(request) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  return token === process.env.ADMIN_SECRET_TOKEN;
}

// GET — List all keys (with optional filters)
export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const plan   = searchParams.get("plan");
  const active = searchParams.get("active");

  const where = {};
  if (plan)   where.plan   = plan;
  if (active !== null && active !== undefined)
    where.active = active === "true";

  const licenses = await prisma.license.findMany({
    where,
    orderBy: { created_at: "desc" },
    select: {
      id:           true,
      email:        true,
      license_key:  true,
      plan:         true,
      active:       true,
      expiry_date:  true,
      created_at:   true,
      activated_at: true,
    },
  });

  return NextResponse.json({ total: licenses.length, licenses });
}

// PATCH — Toggle active status or update expiry
export async function PATCH(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { licenseKey, active, expiryDate } = await request.json();

    if (!licenseKey) {
      return NextResponse.json({ error: "licenseKey required." }, { status: 400 });
    }

    const data = {};
    if (typeof active === "boolean") data.active = active;
    if (expiryDate !== undefined)
      data.expiry_date = expiryDate ? new Date(expiryDate) : null;

    const updated = await prisma.license.update({
      where: { license_key: licenseKey },
      data,
    });

    return NextResponse.json({ success: true, license: updated });
  } catch (err) {
    if (err.code === "P2025") {
      return NextResponse.json({ error: "License key not found." }, { status: 404 });
    }
    console.error("[admin/keys PATCH] Error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
