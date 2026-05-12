// src/app/api/admin/keys/route.js
// GET  /api/admin/keys         — list all licenses
// PATCH /api/admin/keys        — activate / deactivate a key

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function isAuthorized(request) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  return token === process.env.ADMIN_SECRET_TOKEN;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

// GET — List all keys (with optional filters)
export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers: CORS });
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

  return NextResponse.json({ total: licenses.length, licenses }, { headers: CORS });
}

// PATCH — Toggle active status or update expiry
export async function PATCH(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers: CORS });
  }

  try {
    const body = await request.json().catch(() => ({}));

    const { licenseKey, active, expiryDate, resetDevice } = body;

    if (!licenseKey) {
      return NextResponse.json({ error: "licenseKey required." }, { status: 400, headers: CORS });
    }

    const data = {};
    if (typeof active === "boolean") data.active = active;
    if (expiryDate !== undefined) {
      if (expiryDate) {
        const parsedDate = new Date(expiryDate);
        if (isNaN(parsedDate.getTime())) {
          return NextResponse.json({ error: "Invalid date format for expiryDate." }, { status: 400, headers: CORS });
        }
        data.expiry_date = parsedDate;
      } else {
        data.expiry_date = null;
      }
    }

    // Allow clearing device binding
    if (resetDevice === true) {
      data.device_id = null;
    }

    const updated = await prisma.license.update({
      where: { license_key: licenseKey },
      data,
    });

    return NextResponse.json({ success: true, license: updated }, { headers: CORS });
  } catch (err) {
    if (err.code === "P2025") {
      return NextResponse.json({ error: "License key not found." }, { status: 404, headers: CORS });
    }
    console.error("[admin/keys PATCH] Error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500, headers: CORS });
  }
}

// DELETE — Remove a license key entirely
export async function DELETE(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers: CORS });
  }

  try {
    const { searchParams } = new URL(request.url);
    const licenseKey = searchParams.get("licenseKey");

    if (!licenseKey) {
      return NextResponse.json({ error: "licenseKey parameter is required." }, { status: 400, headers: CORS });
    }

    await prisma.license.delete({
      where: { license_key: licenseKey },
    });

    return NextResponse.json({ success: true, message: "License deleted successfully." }, { headers: CORS });
  } catch (err) {
    if (err.code === "P2025") {
      return NextResponse.json({ error: "License key not found." }, { status: 404, headers: CORS });
    }
    console.error("[admin/keys DELETE] Error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500, headers: CORS });
  }
}
