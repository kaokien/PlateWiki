import fs from 'fs';
import path from 'path';

const contentPath = 'C:\\Users\\kevin\\.gemini\\antigravity\\brain\\069f8482-b356-448f-9001-f83f6b4f869a\\.system_generated\\steps\\11756\\content.md';
const content = fs.readFileSync(contentPath, 'utf8');

// Strip HTML tags and script/style tags
let text = content
  .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
  .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

console.log(text.substring(0, 5000));
