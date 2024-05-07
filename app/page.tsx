"use client"
import WebshotApi from '@/utils/Screenshot.api';
import { FormEvent, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [url, setUrl] = useState('');
  const [screenshotKey, setScreenshotKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a valid URL.');
      return;
    }
    setIsLoading(true);
    setError('');

    try {
      const api = new WebshotApi();
      const key  = await api.takeScreenshot(url);
      setScreenshotKey(key);
    } catch (err) {
      console.error(err);
      setError('Failed to capture the screenshot. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className='w-full min-h-[100vh] flex flex-col items-center p-8'>
      <h1 className="text-6xl font-semibold tracking-tight">WebVoyager</h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6 w-3/4 text-center text-gray-600">
        Capture a screenshot of any website by entering the URL below. The screenshot will be saved to <i className="font-bold">Netlify blob storage</i>.
      </p>
      <form onSubmit={handleSubmit} className='flex flex-col items-center'>
        <Input type="text" placeholder="https://www.example.com" value={url} onChange={(e) => setUrl(e.target.value)} className='w-[400px] mt-8' />
        <p className="text-gray-500 text-sm mt-2">------or-------</p>
        
        <Button type="submit" disabled={isLoading} className="bg-slate-600 text-white font-light mt-4">
          {isLoading ? 'Capturing...' : 'Capture Screenshot'}
        </Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
      {screenshotKey && (
        <div className="mt-4">
          <img src={`/api/screenshots/${screenshotKey}`} alt="Screenshot" className="max-w-full"/>
          <a href={`/api/screenshots/${screenshotKey}`} download className="text-blue-500 hover:underline">
            Download Screenshot
          </a>
        </div>
      )}
    </div>
  );
}
