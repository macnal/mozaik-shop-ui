import 'server-only'
import {Client} from '@notionhq/client';
import {Input} from "ky";
import deepMerge from 'deepmerge'



export async function notionFetch(url: Input, init: RequestInit = {}) {
  const resultOptions: RequestInit = deepMerge({
    // cache: "force-cache",
    next: { revalidate: 300 }
  }, init)

  return fetch(url, resultOptions);
}

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
  fetch: notionFetch,
});

export const NotionService = () => notion
