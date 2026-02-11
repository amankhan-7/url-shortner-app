import { NextResponse } from "next/server";
import UrlModel from "@/backend/models/url";
import { connectDB } from "@/backend/lib/db";

export async function GET(req, context) {
  await connectDB();
  const { shortId } = await context.params;

  const result = await UrlModel.findOne({ shortId });

  if (!result) {
    return NextResponse.json(
      { error: "URL not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}
