import { ServerResponse } from "http";
import { sendJson } from "./response";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: string[]
  ) {
    super(message);
  }
}

// 400: the client sent bad input
export class BadRequestError extends AppError {
  constructor(message = "Bad request", details?: string[]) {
    super(400, message, details);
  }
}

// 404: the thing the client asked for doesn't exist
export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(404, message);
  }
}

// 405: the route exists but not for this HTTP method
export class MethodNotAllowedError extends AppError {
  constructor() {
    super(405, "Method not allowed");
  }
}

/** Reusable error handler: turns any error into a consistent JSON response. */
export function handleError(res: ServerResponse, err: unknown): void {
  if (err instanceof AppError) {
    sendJson(res, err.statusCode, {
      success: false,
      error: { message: err.message, ...(err.details && { details: err.details }) },
    });
    return;
  }

  // Anything unexpected becomes a 500 and gets logged in the terminal
  console.error(err);
  sendJson(res, 500, { success: false, error: { message: "Internal server error" } });
}