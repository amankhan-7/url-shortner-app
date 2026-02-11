import { NextResponse } from "next/server";
import UrlModel from "@/backend/models/url";

export async function GET(req, context) {
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
