const puppeteer = require("puppeteer");
const { URL } = require("url");
const { getStore } = require("@netlify/blobs");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const NETLIFY_API_TOKEN = 'nfp_TGGX5WVfzeNfFXEATjdWwwWa1LS8fWXf8191';
const NETLIFY_SITE_ID = 'a6424d35-a993-487b-9455-a1b25f0362fc';
const store = getStore({
  name: "screenshots",
  siteID: NETLIFY_SITE_ID,
  token: NETLIFY_API_TOKEN,
});

const scrapeLogic = async (req, res) => {
  const browserOptions = {
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  };

  try {
    const { url, options = {} } = req.body;

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ error: "Invalid URL provided" });
    }

    const { width = 1920, height = 1080, fullPage = false } = options;

    const browser = await puppeteer.launch({...browserOptions});

    const page = await browser.newPage();

    await page.setViewport({ width, height });
    await page.goto(url, { waitUntil: "networkidle2" });
     // disable all timeouts
    page.setDefaultNavigationTimeout(0);
    page.setDefaultTimeout(0);

    const screenshot = await page.screenshot({ fullPage });
    await browser.close();

    const key = uuidv4();
    await store.set(key, screenshot, {
      metadata: {
        url,
        type: "image/png",
        size: { width, height },
      },
    });
   return  res.json({ key });
  } catch (error) {
    console.error("Error occurred during scraping:", error);
    res.status(500).json({ error: `Something went wrong: ${error.message}` });
  } 
};

// Utility function to validate URLs
const isValidUrl = (urlString) => {
  try {
    new URL(urlString);
    return true;
  } catch (e) {
    return false;
  }
};

module.exports = { scrapeLogic };
