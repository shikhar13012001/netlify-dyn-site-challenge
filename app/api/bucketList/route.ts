import { getStore } from "@netlify/blobs";
import puppeteer from "puppeteer";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest, res: Response) {
  try {
    // Parse and validate the request body
    const { bucketKey, opCode = "retrieve", keys = [] } = await req.json();
    if (!bucketKey || !Array.isArray(keys)) {
      throw new Error("Invalid input data");
    }

    const { NETLIFY_API_TOKEN, NETLIFY_SITE_ID } = process.env;
    if (!NETLIFY_API_TOKEN || !NETLIFY_SITE_ID) {
      throw new Error("Missing Netlify configuration");
    }

    // Initialize Netlify store
    const store = getStore({
      name: "screenshots",
      siteID: NETLIFY_SITE_ID,
      token: NETLIFY_API_TOKEN,
    });

    let bucketKeys;

    // Handle operations
    if (opCode === "save") {
      bucketKeys = await store.setJSON(bucketKey, { keys });
    } else if (opCode === "retrieve") {
      bucketKeys = await store.get(bucketKey, { type: "json" });
    } else {
      throw new Error(`Unsupported operation code: ${opCode}`);
    }

    // Return the bucket keys
    return NextResponse.json({ bucketKeys }, { status: 200 });

  } catch (error: any) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
