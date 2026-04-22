'use server';

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const RAW_DIR = join(process.cwd(), 'src/wiki/raw');

export interface SaveResult {
  success: boolean;
  filename?: string;
  path?: string;
  error?: string;
}

export async function saveToRaw(
  content: string,
  filename: string,
  metadata?: {
    url?: string;
    title?: string;
  }
): Promise<SaveResult> {
  try {
    if (!content || content.trim().length === 0) {
      return { success: false, error: 'Content is empty' };
    }

    const safeFilename = filename.endsWith('.md') ? filename : `${filename}.md`;

    if (!existsSync(RAW_DIR)) {
      mkdirSync(RAW_DIR, { recursive: true });
    }

    const outputPath = join(RAW_DIR, safeFilename);

    let frontmatter = '';
    if (metadata) {
      frontmatter = `---
url: "${metadata.url || ''}"
title: "${metadata.title || safeFilename}"
saved: "${new Date().toISOString()}"
---

`;
    }

    writeFileSync(outputPath, frontmatter + content);

    return {
      success: true,
      filename: safeFilename,
      path: outputPath
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
}