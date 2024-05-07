import { getStore } from '@netlify/blobs';
import puppeteer from 'puppeteer';
import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest, res: Response) {
  
    const { url } = await req.json();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const screenshotBuffer = await page.screenshot();
    await browser.close();

    const store = getStore('screenshots');
    const key = `${Date.now()}.png`;
    await store.set(key, screenshotBuffer, { 
      metadata: { url }
    });

   return  NextResponse.json({ key}, { status: 201 });
     
   
}