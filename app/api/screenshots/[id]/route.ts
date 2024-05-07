import { store } from "@/lib/netlify.blob";  

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        // Attempt to retrieve the blob with metadata from the store
        const blob = await store.getWithMetadata(id, { type: "blob" });
        if (!blob) {
            // If no blob is found, return a 404 error
            return new Response(JSON.stringify({ error: "Screenshot not found" }), { status: 404, headers: { "Content-Type": "application/json" } });
        }

        const { data, metadata } = blob;
        // Return the blob data with the appropriate content type and content length headers
        return new Response(data, {
            headers: {
                "Content-Type": metadata.type as string,
                "Content-Length": String(metadata.size), // Ensure size is a string
                "Cache-Control": "max-age=86400" // Optional: Cache for 1 day
            },
        });
    } catch (error) {
        // Log the error and return a 500 server error response
        console.error("Failed to retrieve the screenshot:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
}
