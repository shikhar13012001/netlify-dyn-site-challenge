import { getStore } from "@netlify/blobs";

// Save the screenshot to Netlify blob storage
const { NETLIFY_API_TOKEN, NETLIFY_SITE_ID } = process.env;
export const store = getStore({
  name: "screenshots",
  siteID: NETLIFY_SITE_ID,
  token: NETLIFY_API_TOKEN,
});
