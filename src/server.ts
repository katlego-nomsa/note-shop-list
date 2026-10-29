import http from "http";
import { validateCreate, validateUpdate } from "./models/item";
import { itemStore } from "./store/itemStore";
import { sendJson } from "./utils/response";
import { parseJsonBody } from "./utils/body";

const PORT = Number(process.env.PORT) || 3000;

function sendError(res: http.ServerResponse, status: number, message: string, details?: string[]) {
  sendJson(res, status, { success: false, error: { message, ...(details && { details }) } });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
  const segments = url.pathname.split("/").filter(Boolean); // "/items/3" becomes ["items", "3"]

  // ---- /items ----
  if (segments[0] === "items" && segments.length === 1) {
    if (req.method === "GET") {
      return sendJson(res, 200, { success: true, data: itemStore.getAll() });
    }

    if (req.method === "POST") {
      let body;
      try {
        body = await parseJsonBody(req);
      } catch (err) {
        return sendError(res, 400, (err as Error).message);
      }
      const { errors, value } = validateCreate(body);
      if (errors.length > 0 || !value) return sendError(res, 400, "Validation failed", errors);
      return sendJson(res, 201, { success: true, data: itemStore.create(value) });
    }
  }

  // ---- /items/:id ----
  if (segments[0] === "items" && segments.length === 2) {
    const id = Number(segments[1]);
    if (!Number.isInteger(id) || id <= 0) {
      return sendError(res, 400, "Item id must be a positive whole number");
    }

    // GET /items/:id
    if (req.method === "GET") {
      const item = itemStore.getById(id);
      if (!item) return sendError(res, 404, `Item with id ${id} not found`);
      return sendJson(res, 200, { success: true, data: item });
    }

    // PUT /items/:id
    if (req.method === "PUT") {
      if (!itemStore.getById(id)) return sendError(res, 404, `Item with id ${id} not found`);

      let body;
      try {
        body = await parseJsonBody(req);
      } catch (err) {
        return sendError(res, 400, (err as Error).message);
      }
      const { errors, value } = validateUpdate(body);
      if (errors.length > 0 || !value) return sendError(res, 400, "Validation failed", errors);
      return sendJson(res, 200, { success: true, data: itemStore.update(id, value) });
    }
  }

  sendError(res, 404, "Route not found");
});

server.listen(PORT, () => {
  console.log(`Shopping List API running on http://localhost:${PORT}`);
});