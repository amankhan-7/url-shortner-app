import UrlModel from "../../../../backend/models/url";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getUserFromToken } from "../../../../backend/lib/auth";
import { connectDB } from "@/backend/lib/db";

export async function GET() {
  await connectDB();
  const auth = await getUserFromToken();
  if (auth.error) return auth.error;
   console.log("url fetch", auth);
  
  const urls = await UrlModel.find({ createdBy: auth.userId });

  return NextResponse.json({ urls }, { status: 200 });
}

export async function DELETE(req) {
  await connectDB();
  const auth = await getUserFromToken();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const shortId = searchParams.get("shortId");

  if (!shortId) {
    return NextResponse.json({ error: "shortId is required" }, { status: 400 });
  }

  const deletedUrl = await UrlModel.findOneAndDelete({
    shortId,
    createdBy: auth.userId,
  });

  if (!deletedUrl) {
    return NextResponse.json(
      { error: "URL not found or not authorized" },
      { status: 404 },
    );
  }

  return NextResponse.json(
    { message: "Deleted successfully", deletedUrl },
    { status: 200 },
  );
}
