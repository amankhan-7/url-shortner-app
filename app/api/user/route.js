import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/backend/models/user";
import { connectDB } from "@/backend/lib/db";

export async function POST(req) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email, password });

  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  // Create JWT
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const response = NextResponse.json({ success: true });

  //  Store JWT in cookie
  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
  });

  return response;
}
