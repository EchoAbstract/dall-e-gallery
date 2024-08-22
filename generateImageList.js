import { open, readdir, access, constants, stat } from "node:fs/promises";
import { basename } from "node:path";
import { exec } from "node:child_process";
import { createHash } from "node:crypto";

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

function writeOutputHeader(outFile) {
  outFile.write("export default function listImages() {\n");
  outFile.write("\treturn [\n");
}

function writeOutputFooter(outFile) {
  outFile.write("\t];\n}\n");
}

async function processFiles(files, outFile) {
  for (const file of files) {
    if (!file.endsWith(".png")) continue;

    const filePath = `./public/images/${file}`;
    const thumbPath = `./public/images/thumbnails/${file}`;
    const fileUrl = `./images/${file}`;
    const thumbUrl = `./images/thumbnails/${file}`;

    const stats = await stat(filePath);
    const sha = await computeHash(filePath);

    console.log(file, sha, (new Date(stats.ctime)).toGMTString());
    //
    // Make thumbnail
    try {
      const thumbnailExists = await exists(thumbPath);
      if (!thumbnailExists) {
        console.log(`Making thumbnail for ${file}`);
        await exec(
          `magick "${filePath}" -resize 256x256 "${thumbPath}"`,
        );
      }
    } catch (err) {
      console.error(err);
    }
    const rootName = basename(file, ".png");
    await outFile.write(`{\n`);
    await outFile.write(`description: "${rootName}",\n`);
    await outFile.write(`file: "${fileUrl}",\n`);
    await outFile.write(`thumbnail: "${thumbUrl}",\n`);
    await outFile.write(`hash: "${sha}",\n`);
    await outFile.write(`},\n`);
  }
}


try {
  const outFile = await open("./src/listImages.js", "w");

  writeOutputHeader(outFile);

  const files = await readdir("./public/images");
  await processFiles(files, outFile);

  writeOutputFooter(outFile);
  outFile.close();
} catch (err) {
  console.error(err);
}
