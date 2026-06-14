import { createServer } from "node:http";
import { Readable } from "node:stream";

const port = Number.parseInt(process.env.PORT ?? "10000", 10);
const host = process.env.HOST ?? "0.0.0.0";

const { default: server } = await import("./dist/server/server.js");

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
