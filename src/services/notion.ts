import 'server-only'
import {Client} from '@notionhq/client';

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const NotionService = () => notion
