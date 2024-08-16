import { open, readdir } from "node:fs/promises";
import { basename } from "node:path";

try {
  const outFile = await open("./src/listImages.js", "w");
  outFile.write("export default function listImages() {\n");
  outFile.write("return [\n");

  const files = await readdir("./public/images");
  for (const file of files) {
    if (!file.endsWith(".png")) continue;
    const rootName = basename(file, ".png");
    //     {description: '3d render of a programmer fighting a bug', file: './images/3d render of a programmer fighting a bug.png'},
    await outFile.write(
      `{ description: "${rootName}", file: "./images/${file}" },\n`,
    );
  }
  outFile.write("];\n}\n");
  outFile.close();
} catch (err) {
  console.error(err);
}
