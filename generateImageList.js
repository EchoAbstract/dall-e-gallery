import { open, readdir } from "node:fs/promises";
import { basename } from "node:path";
import { exec } from "node:child_process";

try {
  const outFile = await open("./src/listImages.js", "w");
  outFile.write("export default function listImages() {\n");
  outFile.write("return [\n");

  const files = await readdir("./public/images");
  for (const file of files) {
    if (!file.endsWith(".png")) continue;
    // Make thumbnail
    try {
      console.log(`Making thumbnail for ${file}`);
      await exec(
        `magick "./public/images/${file}" -resize 256x256 "./public/images/thumbnails/${file}"`,
      );
    } catch (err) {
      console.error(err);
    }
    const rootName = basename(file, ".png");
    await outFile.write(`{\n`);
    await outFile.write(`description: "${rootName}",\n`);
    await outFile.write(`file: "./images/${file}",\n`);
    await outFile.write(`thumbnail: "./images/thumbnails/${file}",\n`);
    await outFile.write(`},\n`);
  }
  outFile.write("];\n}\n");
  outFile.close();
} catch (err) {
  console.error(err);
}
