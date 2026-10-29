import { randomUUID } from 'node:crypto';
import { mkdir, readdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const imagesRoot = path.join(root, 'public', 'images');
const categories = [
  'accessories',
  'bags',
  'beauty',
  'fashion',
  'gadgets',
  'hairs',
  'home-appliances',
  'home-decor',
  'mens-apparel',
  'sneakers',
  'watches',
  'women-apparel',
];
const imageExtensions = new Set(['.jpg', '.png', '.jpeg', '.webp']);

async function cleanCategory(category) {
  const folder = path.join(imagesRoot, category);
  const entries = await readdir(folder, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

  const stagedFiles = [];
  for (const [index, file] of files.entries()) {
    const extension = path.extname(file.name).toLowerCase();
    const temporaryName = `.achor-${randomUUID()}-${index}${extension}`;
    await rename(path.join(folder, file.name), path.join(folder, temporaryName));
    stagedFiles.push({ original: file.name, temporaryName, extension });
  }

  const cleanedFiles = [];
  for (const [index, file] of stagedFiles.entries()) {
    const filename = `${index + 1}${file.extension}`;
    await rename(path.join(folder, file.temporaryName), path.join(folder, filename));
    const imagePath = `/images/${category}/${filename}`;
    cleanedFiles.push(imagePath);
    if (filename !== file.original) {
      console.log(`${category}/${file.original} -> ${imagePath}`);
    }
  }

  console.log(`${category}: ${cleanedFiles.length} images processed`);
  return cleanedFiles;
}

async function fixImages() {
  const imageMap = {};
  for (const category of categories) {
    try {
      imageMap[category] = await cleanCategory(category);
    } catch (error) {
      console.error(`${category}: ${error.code === 'ENOENT' ? 'folder not found' : error.message}`);
      imageMap[category] = [];
    }
  }

  const json = `${JSON.stringify(imageMap, null, 2)}\n`;
  await mkdir(path.join(root, 'public'), { recursive: true });
  await writeFile(path.join(root, 'image-map.json'), json, 'utf8');
  await writeFile(path.join(root, 'public', 'image-map.json'), json, 'utf8');
  console.log(`Image map contains ${Object.values(imageMap).reduce((total, files) => total + files.length, 0)} images across ${categories.length} categories.`);
  console.log('All image paths are root-absolute (start with /).');
}

fixImages().catch((error) => {
  console.error('Unable to clean product images:', error);
  process.exitCode = 1;
});
