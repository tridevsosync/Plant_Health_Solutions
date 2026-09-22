import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { TeamMemberModel } from "@/models/TeamMember";
import { teamMembers as seedTeamMembers, type TeamMember } from "@/lib/data";

// In-memory fallback cache for serverless environments
let memoryTeam: TeamMember[] = [...seedTeamMembers];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";

  try {
    await connectDB();

    const query: Record<string, unknown> = {};
    if (!all) {
      // Default public query: show Active members
      query.$or = [{ status: "Active" }, { status: { $exists: false } }, { status: null }];
    }

    const rawMembers = await TeamMemberModel.find(query).sort({ order: 1, createdAt: 1 }).lean();

    // If database is empty, return seed team
    if (rawMembers.length === 0 && seedTeamMembers.length > 0) {
      return NextResponse.json({ success: true, team: seedTeamMembers });
    }

    const team = rawMembers.map((m) => ({
      ...m,
      id: m.id ? String(m.id) : String(m._id),
      _id: String(m._id || m.id),
    }));

    return NextResponse.json({ success: true, team });
  } catch (error: unknown) {
    console.warn("Team GET fallback:", (error as Error).message);
    let list = [...memoryTeam];
    if (!all) {
      list = list.filter((m) => m.status === "Active" || !m.status);
    }
    return NextResponse.json({ success: true, team: list });
  }
}

export async function POST(req: NextRequest) {
  let body: Partial<TeamMember>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  if (!body.name || !body.role) {
    return NextResponse.json(
      { success: false, error: "Team member name and role/designation are required" },
      { status: 400 }
    );
  }

  const id = body.id || `team_${Date.now()}`;
  const newMember: TeamMember = {
    id,
    name: body.name.trim(),
    role: body.role.trim(),
    department: body.department?.trim() || "Agronomy",
    bio: body.bio?.trim() || "",
    image: body.image?.trim() || "",
    email: body.email?.trim() || "",
    phone: body.phone?.trim() || "",
    order: typeof body.order === "number" ? body.order : memoryTeam.length + 1,
    status: (body.status as "Active" | "Hidden") || "Active",
  };

  try {
    await connectDB();
    const created = await TeamMemberModel.create(newMember);
    const resultObj = created.toObject ? created.toObject() : newMember;
    const finalObj: TeamMember = {
      ...newMember,
      ...resultObj,
      id: resultObj.id || id,
    };
    memoryTeam = [finalObj, ...memoryTeam.filter((m) => m.id !== id)];

    return NextResponse.json({
      success: true,
      message: "Team member added successfully",
      member: finalObj,
    });
  } catch (error: unknown) {
    console.warn("Team POST fallback:", (error as Error).message);
    memoryTeam = [newMember, ...memoryTeam.filter((m) => m.id !== id)];

    return NextResponse.json({
      success: true,
      message: "Team member added successfully (offline mode)",
      member: newMember,
    });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const result = await TeamMemberModel.deleteMany({});
    memoryTeam = [];
    return NextResponse.json({
      success: true,
      message: "All team members deleted successfully from MongoDB",
      deletedCount: result.deletedCount,
    });
  } catch (error: unknown) {
    console.warn("Team DELETE fallback:", (error as Error).message);
    memoryTeam = [];
    return NextResponse.json({
      success: true,
      message: "All team members cleared",
      deletedCount: 0,
    });
  }
}
