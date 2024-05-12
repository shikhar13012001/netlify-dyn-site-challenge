import { NextRequest, NextResponse } from "next/server";
import { SERVER_API_URL } from "@/lib/constants";
export async function POST(req: NextRequest, res: Response) {
  // Parse the request body
  const { url, options = {} } = await req.json();
  if (!url) {
    return NextResponse.json(
      { error: "Missing required parameter: url" },
      { status: 400 }
    );
  }

  // Validate required environment variables
  const { NETLIFY_API_TOKEN, NETLIFY_SITE_ID } = process.env;
  if (!NETLIFY_API_TOKEN || !NETLIFY_SITE_ID) {
    return NextResponse.json(
      {
        error:
          "Missing environment variables: NETLIFY_API_TOKEN or NETLIFY_SITE_ID",
      },
      { status: 500 }
    );
  }

  try {
    // Launch the browser and create a new page

    const _key = await fetch(
      `${SERVER_API_URL}/scrape`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      }
    );
    const {key} = await _key.json();
    // Return the key to the stored image
    return NextResponse.json({ key }, { status: 200 });
  } catch (error) {
    console.log("ENV:", process.env.NODE_ENV);
    console.error("Error capturing screenshot:", error);
    return NextResponse.json(
      { error: "Failed to capture screenshot" },
      { status: 500 }
    );
  }
}
