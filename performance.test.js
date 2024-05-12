const TEST_URL = "https://shikhar.pro/";
const server = "http://localhost:4000/scrape";

const puppeteer = require("puppeteer");

const browserOptions = {
  headless: true,
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
const TEST_SCRAPE = async (browserOptions, waitUntil, testNo) => {
  try {
    const start = Date.now();
    const url = TEST_URL;
    // Validate URL
    if (!url) {
      console.error("Invalid URL provided");
      return;
    }
    const options = {};

    const { width = 1920, height = 1080, fullPage = false } = options;

    const browser = await puppeteer.launch({ ...browserOptions });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    await page.setViewport({ width, height });
    await page.goto(url, { waitUntil: waitUntil });
    // disable all timeouts

    const screenshot = await page.screenshot({ fullPage });
    // save screenshot to file
    const fs = require("fs");

    fs.writeFileSync(`./output/${testNo}.png`, screenshot);
    await browser.close();
    const end = Date.now();
    const time = end - start;

    // log time in seconds
    console.log(time / 1000, testNo, waitUntil);
    // save test configuration to file ${testNo}.json
    fs.writeFileSync(
      `./output/${testNo}.json`,
      JSON.stringify({ browserOptions, waitUntil, time })
    );
    return { time, testNo, waitUntil };
  } catch (error) {
    console.error("Error occurred during scraping:", error);
  }
};

const waitUntil = ["domcontentloaded", "load", "networkidle0", "networkidle2"];
const minimal_args = [
  "--autoplay-policy=user-gesture-required",
  "--disable-background-networking",
  "--disable-background-timer-throttling",
  "--disable-backgrounding-occluded-windows",
  "--disable-breakpad",
  "--disable-client-side-phishing-detection",
  "--disable-component-update",
  "--disable-default-apps",
  "--disable-dev-shm-usage",
  "--disable-domain-reliability",
  "--disable-extensions",
  "--disable-features=AudioServiceOutOfProcess",
  "--disable-hang-monitor",
  "--disable-ipc-flooding-protection",
  "--disable-notifications",
  "--disable-offer-store-unmasked-wallet-cards",
  "--disable-popup-blocking",
  "--disable-print-preview",
  "--disable-prompt-on-repost",
  "--disable-renderer-backgrounding",
  "--disable-setuid-sandbox",
  "--disable-speech-api",
  "--disable-sync",
  "--hide-scrollbars",
  "--ignore-gpu-blacklist",
  "--metrics-recording-only",
  "--mute-audio",
  "--no-default-browser-check",
  "--no-first-run",
  "--no-pings",
  "--no-sandbox",
  "--no-zygote",
  "--password-store=basic",
  "--use-gl=swiftshader",
  "--use-mock-keychain",
];

const TEST = async () => {
  let ans = 99999999;
  let ansTestNo = 0;
  for (let i = 0; i < waitUntil.length; i++) {
    const { time, testNo } = await TEST_SCRAPE(browserOptions, waitUntil[i], i);
    if (time < ans) {
      ans = time;
      ansTestNo = testNo;
    }
  }
  for (let i = 0; i < minimal_args.length; i++) {
    browserOptions.args.push(minimal_args[i]);
    for (let j = 0; j < waitUntil.length; j++) {
     const {time, testNo}= await TEST_SCRAPE(browserOptions, waitUntil[j], `${i}_${j}`);
        if (time < ans) {
        ans = time;
        ansTestNo = testNo;
        }
    }
  }
    console.log("Fastest test", ans, ansTestNo);
};

TEST();
