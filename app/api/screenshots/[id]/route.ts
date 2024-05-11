import { getStore } from "@netlify/blobs";
import { NextRequest } from "next/server";
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params; // Extract the screenshot ID from the request parameters
  const bucket = "screenshots"
  const store = getStore({
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_API_TOKEN,
    name: bucket,
  });

  try {
    // Attempt to retrieve the blob with metadata from the store
    const blob = await store.getWithMetadata(id, { type: "blob" });
    if (!blob) {
      // If no blob is found, return a 404 error
      return new Response(JSON.stringify({ error: "Screenshot not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data, metadata } = blob;
    console.log(metadata);
    // Return the blob data with the appropriate content type and content length headers
    return new Response(data, {
      headers: {
        "Content-Type": 'image/png',
        "Content-Length": String(metadata.size), // Ensure size is a string
        "Netlify-CDN-Cache-Control":
          "public, s-maxage=31536000, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    // Log the error and return a 500 server error response
    console.error("Failed to retrieve the screenshot:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
