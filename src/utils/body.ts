import { IncomingMessage } from "http";
import { BadRequestError } from "./errors";

export function parseJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      if (raw.trim() === "") return reject(new BadRequestError("Request body is required"));
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new BadRequestError("Invalid JSON in request body"));
      }
    });
    req.on("error", reject);
  });
}