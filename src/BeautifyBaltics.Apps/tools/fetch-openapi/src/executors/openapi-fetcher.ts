import type { ExecutorContext } from '@nx/devkit';
import { joinPathFragments, logger } from '@nx/devkit';
import { promises as fs } from 'fs';
import { extname, isAbsolute } from 'path';

import { OpenapiFetcherExecutorSchema } from './schema';

export default async function openapiFetcher(
  options: OpenapiFetcherExecutorSchema,
  context: ExecutorContext,
): Promise<{ success: boolean }> {
  const { root } = context;

  const outExt = extname(options.openapiUrl).toLowerCase();
  if (outExt !== '.yaml') {
    logger.error(`❌ Invalid OpenAPI spec url extension "${outExt}". Must end in ".yaml".`);
    return { success: false };
  }

  const outputPath = isAbsolute(options.outputPath)
    ? options.outputPath
    : joinPathFragments(root, options.outputPath);

  logger.info(`🏃‍Fetching OpenAPI spec from ${options.openapiUrl}`);

  let specText: string;

  try {
    const res = await fetch(options.openapiUrl);

    if (!res.ok) {
      logger.error(`❌ HTTP ${res.status} ${res.statusText} when fetching spec`);
      return { success: false };
    }

    specText = await res.text();
  } catch (err: any) {
    const systemCode = err.cause?.code;
    if (systemCode === 'ECONNREFUSED') {
      logger.error(`❌ Connection refused to ${options.openapiUrl}. Is the API running?`);
      return { success: false };
    }

    if (err instanceof TypeError) {
      logger.error(`❌ Network error fetching spec: ${err.message}`);
      return { success: false };
    }

    throw err;
  }

  await fs.writeFile(outputPath, specText, 'utf-8');

  logger.info(`🎉 OpenAPI spec saved to ${options.outputPath}. Run "codegen-state" command to generate clients.`);

  // hotfix: https://github.com/nodejs/node/issues/56645
  await new Promise((resolve) => { setTimeout(resolve, 50); });

  return { success: true };
}
