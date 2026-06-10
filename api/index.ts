import { Readable } from "node:stream";

import server from "../dist/server/server.js";

type VercelNodeRequest = {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  pipe: (destination: NodeJS.WritableStream) => void;
};

type VercelNodeResponse = {
  statusCode: number;
  statusMessage?: string;
  setHeader: (name: string, value: string | number | readonly string[]) => void;
  end: (chunk?: string | Uint8Array) => void;
};

async function renderRequest(request: Request) {
  return server.fetch(request, undefined, undefined);
}

export default async function handler(req: VercelNodeRequest, res: VercelNodeResponse) {
  const origin = `https://${req.headers.host ?? "localhost"}`;
  const requestUrl = new URL(req.url ?? "/", origin);
  const hasBody = req.method != null && !["GET", "HEAD"].includes(req.method);
  const headers: HeadersInit = Object.entries(req.headers).flatMap(([key, value]) => {
    if (value == null) return [];
    return Array.isArray(value) ? value.map((item) => [key, item] as [string, string]) : [[key, value] as [string, string]];
  });
  const body = hasBody
    ? (Readable.toWeb(req as unknown as NodeJS.ReadableStream) as unknown as BodyInit)
    : undefined;

  const requestInit: RequestInit & { duplex?: "half" } = {
    method: req.method ?? "GET",
    headers,
    body: body ?? undefined,
    duplex: hasBody ? "half" : undefined,
  };

  const response = await renderRequest(new Request(requestUrl, requestInit));

  res.statusCode = response.status;
  res.statusMessage = response.statusText;

  for (const [key, value] of response.headers.entries() as IterableIterator<[string, string]>) {
    res.setHeader(key, value);
  }

  if (response.body == null) {
    res.end();
    return;
  }

  Readable.fromWeb(response.body).pipe(res as unknown as NodeJS.WritableStream);
}
