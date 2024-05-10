import { getStore } from "@netlify/blobs";
import puppeteerCore from "puppeteer-core";
import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium"
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
chromium.setHeadlessMode = true; 
chromium.setGraphicsMode = false;

export async function POST(req: NextRequest, res: Response) {
  // Parse the request body
  const { url, options = {} } = await req.json();
  const { width = 1920, height = 1080, fullPage = false, bucket="screenshots" } = options;

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
    let browser = null;
    if (process.env.NODE_ENV !== "production") {
      browser = await puppeteer.launch();
    } else {
      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: process.env.CHROME_EXECUTABLE_PATH || await  chromium.executablePath(),
        headless: chromium.headless,
      });
    }
    const page = await browser.newPage();

    // Set the viewport as specified by the user or use defaults
    await page.setViewport({ width, height });

    // Navigate to the URL and take a screenshot
    await page.goto(url, { waitUntil: "networkidle2" });
    const screenshotBuffer = await page.screenshot({ fullPage });

    // Close the browser
    await browser.close();

    // Save the screenshot to Netlify blob storage
    const store = getStore({
      name: bucket,
      siteID: NETLIFY_SITE_ID,
      token: NETLIFY_API_TOKEN,
    });

    const key = uuidv4();
    await store.set(key, screenshotBuffer, {
      metadata: {
        url,
        type: "image/png",
        size: { width, height },
      },
    });

    // Return the key to the stored image
    return NextResponse.json({ key }, { status: 200, });
  } catch (error) {
    console.log("ENV:", process.env.NODE_ENV);
    console.error("Error capturing screenshot:", error);
    return NextResponse.json(
      { error: "Failed to capture screenshot" },
      { status: 500 }
    );
  }
}
