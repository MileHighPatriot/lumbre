/**
 * GitHub Pages serves files by extension. The Next export writes the share
 * image as "opengraph-image" with no extension, and Pages sends that as a
 * download instead of a picture. Copy it to a .png and point the tags at it.
 */
import { copyFile, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("docs");

await copyFile(path.join(root, "opengraph-image"), path.join(root, "opengraph-image.png"));
await writeFile(path.join(root, ".nojekyll"), "");

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
      continue;
    }
    if (!entry.name.endsWith(".html")) continue;
    const text = await readFile(full, "utf8");
    const next = text.replace(/opengraph-image\?[a-z0-9]+/g, "opengraph-image.png");
    if (next !== text) await writeFile(full, next);
  }
}

await walk(root);
