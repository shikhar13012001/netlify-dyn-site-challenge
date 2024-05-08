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

  async processCSV(csvFile: { file: File }) {
    const file = csvFile.file;

    // Create a Promise that resolves when the file is read
    const readFilePromise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });

    try {
        const fileContent = await readFilePromise;
        const urls = fileContent.split("\n");

        // Process all URLs concurrently using Promise.all
        const keys = await Promise.all(urls.map(url => this.takeScreenshot(url)));

        return keys;
    } catch (error) {
        console.error("Error processing CSV:", error);
        throw error;  // Rethrow or handle as needed
    }
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
