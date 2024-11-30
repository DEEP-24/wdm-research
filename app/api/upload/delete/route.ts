import { unlink } from "node:fs/promises";
import { type NextRequest, NextResponse } from "next/server";
import path from "node:path";

export async function POST(request: NextRequest) {
  try {
    const { filename } = await request.json();

    if (!filename) {
      return NextResponse.json({ error: "No filename provided" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public", "attachments", filename);

    try {
      await unlink(filePath);
    } catch (error) {
      console.error("Error deleting file:", error);
    }

    return NextResponse.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error in delete route:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
