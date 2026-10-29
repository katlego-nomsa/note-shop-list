import http from "http";
import { validateCreate } from "./models/item";
import { itemStore } from "./store/itemStore";
import { sendJson } from "./utils/response";
import { parseJsonBody } from "./utils/body";

const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  if (url.pathname === "/items") {
    // GET /items: return all items
    if (req.method === "GET") {
      return sendJson(res, 200, { success: true, data: itemStore.getAll() });
    }

    // POST /items: create a new item
    if (req.method === "POST") {
      let body;
      try {
        body = await parseJsonBody(req);
      } catch (err) {
        return sendJson(res, 400, { success: false, error: { message: (err as Error).message } });
      }

      const { errors, value } = validateCreate(body);
      if (errors.length > 0 || !value) {
        return sendJson(res, 400, {
          success: false,
          error: { message: "Validation failed", details: errors },
        });
      }

      return sendJson(res, 201, { success: true, data: itemStore.create(value) });
    }
  }

  sendJson(res, 404, { success: false, error: { message: "Route not found" } });
});

server.listen(PORT, () => {
  console.log(`Shopping List API running on http://localhost:${PORT}`);
});