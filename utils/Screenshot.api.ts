import { store } from "@/lib/netlify.blob";
import exp from "constants";

class WebshotApi {
  async takeScreenshot(
    url: string,
    OPTIONS?: { width?: number; height?: number; fullPage?: boolean }
  ) {
    // Take screenshot of the given url
    const res = await fetch("/api/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, OPTIONS }),
    });
    const { key } = await res.json();
    return key;
  }
  async getScreenshot(key: string) {
    // Get the screenshot from the given key
    const res = await fetch(`/api/screenshots/${key}`);
    return res; // this is blob data
  }

  async processCSV(csv: string) {
    // take the csv data and get the screenshot for each url
    const urls = csv.split("\n");
    const keys: string[] = [];
    // run in parallel
    await Promise.all(
      urls.map(async (url) => {
        const key = await this.takeScreenshot(url);
        keys.push(key);
      })
    );
    return keys;
  }

  async downloadScreenshot(key: string) {
    // download the screenshot from the given key
    const res = await this.getScreenshot(key);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "screenshot.png";
    a.click();
    URL.revokeObjectURL(url);
  }

  async downloadScreenshots(keys: string[]) {
    // download the screenshots from the given keys
    keys.forEach(async (key) => {
      await this.downloadScreenshot(key);
    });
  }
}

export default WebshotApi;
