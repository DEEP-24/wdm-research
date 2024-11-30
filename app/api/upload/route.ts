import { writeFile } from "node:fs/promises";
import { type NextRequest, NextResponse } from "next/server";
import path from "node:path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a safe filename
    const originalName = file.name;
    const timestamp = Date.now();
    const safeName = `${timestamp}-${originalName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    // Ensure the attachments directory exists
    const uploadDir = path.join(process.cwd(), "public", "attachments");

    // Save the file
    const filePath = path.join(uploadDir, safeName);
    await writeFile(filePath, buffer);

    // Return the relative path that will be accessible from the frontend
    const publicPath = `/attachments/${safeName}`;

    return NextResponse.json({
      path: publicPath,
      name: originalName,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
  }
}
