import { open, readdir, access, constants, stat } from "node:fs/promises";
import { basename } from "node:path";
import { exec } from "node:child_process";
import { createHash } from "node:crypto";

// Utilities
async function exists(file) {
  try {
    await access(file, constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

async function computeHash(file) {
  return new Promise(async (resolve, reject) => {
    const fd = await open(file);
    const stream = fd.createReadStream();
    const hash = createHash('sha256');
    stream.on('error', reject);
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}


// Functions related to the listImages.js file generation
function header() {
  return `
export default function listImages() {
  return [
`;
}

function footer() {
  return `
  ];
}
`;
}

function fileEntry(file) {
  const { description, fileUrl, thumbUrl, hash } = file;
  return `
  {
    description: "${description}",
    file: "${fileUrl}",
    thumbnail: "${thumbUrl}",
    hash: "${hash}",
  },
`;
}

async function writeOutputHeader(outFile) {
  return outFile.write(header());
}

async function writeOutputFooter(outFile) {
  return outFile.write(footer());
}

async function writeListFiles(files) {
  const outFile = await open("./src/listImages.js", "w");
  writeOutputHeader(outFile);
  await Promise.all(files.map(async f => outFile.write(fileEntry(f))));
  writeOutputFooter(outFile);
  outFile.close();
}


// Functions related to the RSS feed
function rssFileEntry(file) {
  const { description, hash, date } = file;
  const link = `https://echoabstract.github.io/dall-e-gallery/${hash}`;
  return `
<item>
   <title>${description}</title>
   <description>Prompt: ${description}</description>
   <pubDate>${date}</pubDate>
   <link>${link}</link>
   <guid isPermaLink="true">${link}</guid>
</item>
`;
}

function generateRssEntries(files) {
  return files.reduce((acc, currentFile) => {
    const ent = rssFileEntry(currentFile);
    return acc + ent;
  }, '');
}

async function generateRssFeed(files) {
  const feed =`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
 <channel>
  <title>DALL•E Gallery</title>
  <description>Brian's silly AI generated image gallery.</description>
  <link>https://echoabstract.github.io/dall-e-gallery/</link>
  <atom:link href="https://echoabstract.github.io/dall-e-gallery/rss.xml" rel="self" type="application/rss+xml" />
  ${generateRssEntries(files)}
 </channel>
</rss>
`;

  const outFile = await open("./public/rss.xml", "w");
  await outFile.write(feed);
  await outFile.close();
}

// Thumbnail Generation
async function generateThumbnails(files) {
  await Promise.all(files.map(async (f) => {
    try {
      const thumbnailExists = await exists(f.thumbPath);
      if (!thumbnailExists) {
        console.log(`Making thumbnail for ${f.name}`);
        await exec(
          `magick "${f.filePath}" -resize 256x256 "${f.thumbPath}"`,
        );
      }
    } catch (err) {
      console.error(err);
    }
  }));
}

// File munging
async function computeFileEntries(files) {
  const entries = await Promise.all(files.filter(f => f.endsWith(".png")).map(async (f) => {
    const filePath = `./public/images/${f}`;
    const stats = await stat(filePath);
    return {
      name: f,
      filePath,
      thumbPath: `./public/images/thumbnails/${f}`,
      fileUrl: `./images/${f}`,
      thumbUrl: `./images/thumbnails/${f}`,
      description: basename(f, ".png"),
      date: (new Date(stats.ctime)).toGMTString(),
      hash: await computeHash(filePath),
    };
  }));

  return entries;
}

try {
  const files = await readdir("./public/images");
  const fileEntries = await computeFileEntries(files);

  await writeListFiles(fileEntries);
  await generateThumbnails(fileEntries);
  await generateRssFeed(fileEntries);


} catch (err) {
  console.error(err);
}
