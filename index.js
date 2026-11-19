// Wrong Chat — AUTO LOADER (v2)
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const d = fileURLToPath(new URL(".", import.meta.url));

const files = readdirSync(d)
  .filter((n) => /^server[\d\s().]+\.js$/i.test(n))
  .map((n) => {
    const head = readFileSync(d + n, "utf8").slice(0, 3000);
    const m = head.match(/v?(\d+)\.(\d+)\.(\d+)/);
    const fileNo = Number((n.match(/server\s*(\d+)/i) || [])[1] || 0);
    return { n, v: m ? [m[1], m[2], m[3]].join(".") : "0.0.0", fileNo };
  })
  .sort((a, b) => b.v.localeCompare(a.v, undefined, { numeric: true }) || b.fileNo - a.fileNo);

if (!files.length) {
  console.error("No server file found.");
  process.exit(1);
}

console.log("[boot] loading →", files[0].n);
await import("./" + files[0].n);
