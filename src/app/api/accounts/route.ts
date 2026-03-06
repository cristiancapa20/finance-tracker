import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accounts = await prisma.account.findMany({
    select: { id: true, name: true, type: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ data: accounts });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, type } = body;

  if (!name || !type) {
    return NextResponse.json({ error: "Name and type are required" }, { status: 400 });
  }

  const validTypes = ["CASH", "BANK", "CREDIT_CARD", "OTHER"];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: "Invalid account type" }, { status: 400 });
  }

  const account = await prisma.account.create({
    data: { name, type },
    select: { id: true, name: true, type: true },
  });

  return NextResponse.json({ data: account }, { status: 201 });
}
