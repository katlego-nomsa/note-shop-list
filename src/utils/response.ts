import { ServerResponse } from "http";

export function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

/** Success shape: { success: true, data: ... } */
export function sendSuccess(res: ServerResponse, status: number, data: unknown): void {
  sendJson(res, status, { success: true, data });
}

export function sendNoContent(res: ServerResponse): void {
  res.writeHead(204);
  res.end();
}