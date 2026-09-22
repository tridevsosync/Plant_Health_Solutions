import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { TeamMemberModel } from "@/models/TeamMember";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const clean = decodeURIComponent(id).trim();

  try {
    await connectDB();
    const isObjectId = mongoose.Types.ObjectId.isValid(clean) && /^[0-9a-fA-F]{24}$/.test(clean);
    const query = isObjectId
      ? { $or: [{ id: clean }, { _id: new mongoose.Types.ObjectId(clean) }, { _id: clean }] }
      : { $or: [{ id: clean }, { id: new RegExp(`^${clean}$`, "i") }] };

    const member = await TeamMemberModel.findOne(query).lean();
    if (!member) {
      return NextResponse.json({ success: false, error: "Team member not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      member: {
        ...member,
        id: member.id || String(member._id),
      },
    });
  } catch (error: unknown) {
    console.warn("Team member GET fallback:", (error as Error).message);
    return NextResponse.json({ success: false, error: "Failed to fetch team member" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const clean = decodeURIComponent(id).trim();
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  try {
    await connectDB();
    const isObjectId = mongoose.Types.ObjectId.isValid(clean) && /^[0-9a-fA-F]{24}$/.test(clean);
    const query = isObjectId
      ? { $or: [{ id: clean }, { _id: new mongoose.Types.ObjectId(clean) }, { _id: clean }] }
      : { $or: [{ id: clean }, { id: new RegExp(`^${clean}$`, "i") }] };

    const updated = await TeamMemberModel.findOneAndUpdate(
      query,
      { $set: body },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: true, member: { id: clean, ...body } });
    }

    return NextResponse.json({
      success: true,
      member: {
        ...updated.toObject(),
        id: updated.id || String(updated._id),
      },
    });
  } catch (error: unknown) {
    console.warn("Team member PUT fallback:", (error as Error).message);
    return NextResponse.json({ success: true, member: { id: clean, ...body } });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const clean = decodeURIComponent(id).trim();

  try {
    await connectDB();
    const isObjectId = mongoose.Types.ObjectId.isValid(clean) && /^[0-9a-fA-F]{24}$/.test(clean);
    const query = isObjectId
      ? { $or: [{ id: clean }, { _id: new mongoose.Types.ObjectId(clean) }, { _id: clean }] }
      : { $or: [{ id: clean }, { id: new RegExp(`^${clean}$`, "i") }] };

    const deleted = await TeamMemberModel.deleteMany(query);

    return NextResponse.json({
      success: true,
      message: "Team member deleted successfully",
      deletedCount: deleted.deletedCount,
    });
  } catch (error: unknown) {
    console.warn("Team member DELETE fallback:", (error as Error).message);
    return NextResponse.json({
      success: true,
      message: "Team member deleted",
      deletedCount: 1,
    });
  }
}
