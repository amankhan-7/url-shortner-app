import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import UrlModel from "@/backend/models/url";
import { connectDB } from "@/backend/lib/db";
import { getUserFromToken } from "../../../backend/lib/auth";

export async function POST(req) {

  await connectDB();
  const { url } = await req.json();

  const auth  = await getUserFromToken();
  if(auth.error) return auth.error;

  if (!url) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  // //  cookies() is async in route handlers
  // const cookieStore = await cookies();
  // const token = cookieStore.get("token")?.value;

  // if (!token) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  // let payload;
  // try {
  //   payload = jwt.verify(token, process.env.JWT_SECRET);
  // } catch {
  //   return NextResponse.json(
  //     { error: "Invalid or expired token" },
  //     { status: 401 },
  //   );
  // }

  const shortId = nanoid(8);

  await UrlModel.create({
    shortId,
    redirectURL: url,
    visitHistory: [],
    createdBy: auth.userId,
  });

  return NextResponse.json({ success: true, shortId }, { status: 201 });
}
