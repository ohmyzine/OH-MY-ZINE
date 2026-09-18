import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const cssDirectory = path.join(root, "CSS");

function collapseWhitespace(css) {
  let output = "";
  let quote = "";
  let escaped = false;
  let inComment = false;
  let pendingSpace = false;

  for (let index = 0; index < css.length; index += 1) {
    const character = css[index];
    const next = css[index + 1] || "";

    if (inComment) {
      if (character === "*" && next === "/") {
        inComment = false;
        index += 1;
      }
      continue;
    }

    if (quote) {
      output += character;
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = "";
      continue;
    }

    if (character === "/" && next === "*") {
      inComment = true;
      index += 1;
      pendingSpace = true;
      continue;
    }

    if (character === '"' || character === "'") {
      if (pendingSpace && output && !output.endsWith(" ")) output += " ";
      pendingSpace = false;
      quote = character;
      output += character;
      continue;
    }

    if (/\s/.test(character)) {
      pendingSpace = true;
      continue;
    }

    if (pendingSpace && output && !output.endsWith(" ")) output += " ";
    pendingSpace = false;
    output += character;
  }

  return `${output.trim()}\n`;
}

async function readSources(names) {
  const files = await Promise.all(names.map((name) => fs.readFile(path.join(cssDirectory, name), "utf8")));
  return files.join("\n");
}

async function build(outputName, sourceNames) {
  const source = await readSources(sourceNames);
  const banner = `/* GENERATED from ${sourceNames.join(" + ")} — run tools/build-common-css.mjs */\n`;
  await fs.writeFile(path.join(cssDirectory, outputName), banner + collapseWhitespace(source), "utf8");
}

await build("common-runtime.min.css", ["finishing.css", "mobile-readability.css", "os-stage.css"]);
await build("common-responsive.min.css", ["mobile-readability.css", "os-stage.css"]);

console.log("Built shared CSS bundles.");
