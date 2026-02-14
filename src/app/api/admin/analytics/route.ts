import { NextResponse } from "next/server";
import { getAnalytics } from "@/lib/store";

export async function GET() {
  return NextResponse.json(getAnalytics());
}
