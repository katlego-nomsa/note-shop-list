import http from "http";
import { validateCreate, validateUpdate } from "./models/item";
import { itemStore } from "./store/itemStore";
import { sendSuccess, sendNoContent } from "./utils/response";
import { parseJsonBody } from "./utils/body";
import {
  BadRequestError,
  MethodNotAllowedError,
  NotFoundError,
  handleError,
} from "./utils/errors";

const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer(async (req, res) => {
  // Every error thrown below ends up in the catch at the bottom
  try {
    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    const segments = url.pathname.split("/").filter(Boolean); // "/items/3" becomes ["items", "3"]

    // ---- /items ----
    if (segments[0] === "items" && segments.length === 1) {
      if (req.method === "GET") {
        return sendSuccess(res, 200, itemStore.getAll());
      }

      if (req.method === "POST") {
        const body = await parseJsonBody(req);
        const { errors, value } = validateCreate(body);
        if (errors.length > 0 || !value) throw new BadRequestError("Validation failed", errors);
        return sendSuccess(res, 201, itemStore.create(value));
      }

      throw new MethodNotAllowedError();
    }

    // ---- /items/:id ----
    if (segments[0] === "items" && segments.length === 2) {
      const id = Number(segments[1]);
      if (!Number.isInteger(id) || id <= 0) {
        throw new BadRequestError("Item id must be a positive whole number");
      }

      if (req.method === "GET") {
        const item = itemStore.getById(id);
        if (!item) throw new NotFoundError(`Item with id ${id} not found`);
        return sendSuccess(res, 200, item);
      }

      if (req.method === "PUT") {
        if (!itemStore.getById(id)) throw new NotFoundError(`Item with id ${id} not found`);
        const body = await parseJsonBody(req);
        const { errors, value } = validateUpdate(body);
        if (errors.length > 0 || !value) throw new BadRequestError("Validation failed", errors);
        return sendSuccess(res, 200, itemStore.update(id, value));
      }

      if (req.method === "DELETE") {
        if (!itemStore.delete(id)) throw new NotFoundError(`Item with id ${id} not found`);
        return sendNoContent(res);
      }

      throw new MethodNotAllowedError();
    }

    throw new NotFoundError("Route not found");
  } catch (err) {
    handleError(res, err);
  }
});

server.listen(PORT, () => {
  console.log(`Shopping List API running on http://localhost:${PORT}`);
});