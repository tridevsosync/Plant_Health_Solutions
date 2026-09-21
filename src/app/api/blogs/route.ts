import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { BlogModel } from "@/models/Blog";
import { blogs as seedBlogs, type Blog } from "@/lib/data";

let memoryBlogs: Blog[] = [...seedBlogs];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  try {
    await connectDB();
    const count = await BlogModel.countDocuments();
    if (count === 0 && seedBlogs.length > 0) {
      await BlogModel.insertMany(seedBlogs).catch(() => {});
    }

    const query: Record<string, unknown> = {};
    if (category && category !== "All") query.category = category;

    const blogs = await BlogModel.find(query).sort({ date: -1 }).lean();
    return NextResponse.json({ success: true, blogs });
  } catch (error: unknown) {
    console.warn("Blogs GET fallback:", (error as Error).message);
    let list = [...memoryBlogs];
    if (category && category !== "All") {
      list = list.filter((b) => b.category.toLowerCase() === category.toLowerCase());
    }
    return NextResponse.json({ success: true, blogs: list });
  }
}

export async function POST(req: NextRequest) {
  let body: Partial<Blog>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.title) {
    return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
  }

  const id = body.id || `b_${Date.now()}`;
  const date = body.date || new Date().toISOString().split("T")[0];

  const newBlog: Blog = {
    id,
    title: body.title,
    excerpt: body.excerpt || "",
    category: body.category || "Crop Science",
    readTime: Number(body.readTime || 4),
    featured: Boolean(body.featured),
    date,
    image:
      body.image ||
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    author: body.author || "Dr. Rajesh Kulkarni",
    body: Array.isArray(body.body) ? body.body : [body.excerpt || body.title],
  };

  try {
    await connectDB();
    const blog = await BlogModel.create(newBlog);
    const resultObj = blog.toObject ? blog.toObject() : newBlog;
    memoryBlogs = [resultObj, ...memoryBlogs.filter((b) => b.id !== id)];
    return NextResponse.json({ success: true, blog: resultObj });
  } catch (error: unknown) {
    console.warn("Blog POST fallback:", (error as Error).message);
    memoryBlogs = [newBlog, ...memoryBlogs.filter((b) => b.id !== id)];
    return NextResponse.json({ success: true, blog: newBlog });
  }
}

export async function DELETE() {
  try {
    await connectDB();
    const result = await BlogModel.deleteMany({});
    memoryBlogs = [];
    return NextResponse.json({
      success: true,
      message: "All blogs deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error: unknown) {
    console.warn("Blogs DELETE fallback:", (error as Error).message);
    memoryBlogs = [];
    return NextResponse.json({
      success: true,
      message: "All blogs cleared",
      deletedCount: 0,
    });
  }
}
