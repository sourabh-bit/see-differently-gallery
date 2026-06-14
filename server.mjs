import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";

const port = Number.parseInt(process.env.PORT ?? "10000", 10);
const host = process.env.HOST ?? "0.0.0.0";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(__dirname, "dist", "client");

const { default: server } = await import("./dist/server/server.js");

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".js", "application/javascript; charset=utf-8"],
  [".mjs", "application/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".gif", "image/gif"],
  [".ico", "image/x-icon"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

function getContentType(filePath) {
  return contentTypes.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream";
}

async function serveStaticAsset(urlPath, res) {
  const normalizedPath = path.normalize(urlPath).replace(/^([.][.][/\\])+/, "");
  const filePath = path.join(clientDir, normalizedPath);
  const resolvedClientDir = path.resolve(clientDir);
  const resolvedFilePath = path.resolve(filePath);

  if (!resolvedFilePath.startsWith(resolvedClientDir)) {
    return false;
  }

  try {
    await access(resolvedFilePath);
  } catch {
    return false;
  }

  res.statusCode = 200;
  res.setHeader("content-type", getContentType(resolvedFilePath));
  res.setHeader("cache-control", "public, max-age=31536000, immutable");
  createReadStream(resolvedFilePath).pipe(res);
  return true;
}

function buildRequest(req) {
  const origin = `http://${req.headers.host ?? `${host}:${port}`}`;
  const url = new URL(req.url ?? "/", origin);
  const headers = new Headers();

  for (const [key, value] of Object.entries(req.headers)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(key, item);
      }
      continue;
    }

    headers.set(key, value);
  }

  const hasBody = req.method != null && !["GET", "HEAD"].includes(req.method);
  const body = hasBody ? Readable.toWeb(req) : undefined;

  return new Request(url, {
    method: req.method ?? "GET",
    headers,
    body: body ?? undefined,
    duplex: hasBody ? "half" : undefined,
  });
}

async function sendResponse(res, response) {
  res.statusCode = response.status;
  res.statusMessage = response.statusText;

  for (const [key, value] of response.headers.entries()) {
    res.setHeader(key, value);
  }

  if (response.body == null) {
    res.end();
    return;
  }

  Readable.fromWeb(response.body).pipe(res);
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? `${host}:${port}`}`);

    if (url.pathname.startsWith("/assets/")) {
      const served = await serveStaticAsset(url.pathname, res);
      if (served) return;
    }

    const response = await server.fetch(buildRequest(req), undefined, undefined);
    await sendResponse(res, response);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end("Internal Server Error");
  }
}).listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}`);
});
