import { store } from "@/lib/netlify.blob";

class WebshotApi {
  async takeScreenshot(
    url: string,
    OPTIONS?: {
      width?: number;
      height?: number;
      fullPage?: boolean;
      bucket?: string;
    }
  ) {
    // Take screenshot of the given url
    try {
      const res = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, OPTIONS }),
      });
      const { key } = await res.json();
      return key;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  async getScreenshot(key: string) {
    // Get the screenshot from the given key
    const res = await fetch(`/api/screenshots/${key}`);
    return res; // this is blob data
  }

  async processCSV(csvFile: { file: File }, OPTIONS?: { bucket?: string }) {
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
      const urls = fileContent.split("\n").filter((url) => url.trim() !== "");

      // Process all URLs concurrently using Promise.all
      const keys = await Promise.all(
        urls.map((url) => this.takeScreenshot(url, OPTIONS))
      );

      return keys;
    } catch (error) {
      console.error("Error processing CSV:", error);
      throw error; // Rethrow or handle as needed
    }
  }
  async saveKeys(bucketKey: string, keys: string[]) {
    // Save the keys to the given bucketKey
    try {
      const res = await fetch("/api/bucketList", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bucketKey, opCode: "save", keys }),
      });
      const { bucketKeys } = await res.json();
      return bucketKeys;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async getKeys(bucketKey: string) {
    // Get the keys from the given bucketKey
    try {
      const res = await fetch("/api/bucketList", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bucketKey }),
      });
      const { bucketKeys } = await res.json();
      return bucketKeys;
    } catch (err) {
      console.log(err);
      return null;
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
