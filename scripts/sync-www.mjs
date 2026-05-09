import { copyFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const www = join(root, "www");

const files = ["index.html", "app.js", "styles.css"];

if (!existsSync(www)) mkdirSync(www, { recursive: true });

for (const name of files) {
  copyFileSync(join(root, name), join(www, name));
  console.log(`sync: ${name} -> www/${name}`);
}

console.log("www/ ready for wrangler deploy");
