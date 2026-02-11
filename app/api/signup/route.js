import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/backend/models/user";
import { connectDB } from "@/backend/lib/db";

export async function POST(req) {
  await connectDB();

  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 409 }
    );
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
  });

  // 🔐 Auto-login with JWT
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const response = NextResponse.json({ success: true }, { status: 201 });

  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    sameSite: "strict",
  });

  return response;
}
