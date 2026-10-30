export interface Item {
  id: number;
  name: string;
  quantity: number;
  unit?: string; // e.g. "L", "kg"
  purchased: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItemInput {
  name: string;
  quantity: number;
  unit?: string;
  purchased: boolean;
}

/** Checks the body of POST /items and returns a list of error messages. */
export function validateCreate(body: any): { errors: string[]; value?: CreateItemInput } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { errors: ["Request body must be a JSON object"] };
  }

  const errors: string[] = [];

  if (body.name === undefined) {
    errors.push("name is required");
  } else if (typeof body.name !== "string" || body.name.trim() === "") {
    errors.push("name must be a non-empty string");
  }

  if (body.quantity !== undefined && (typeof body.quantity !== "number" || body.quantity <= 0)) {
    errors.push("quantity must be a positive number");
  }

  if (body.unit !== undefined && typeof body.unit !== "string") {
    errors.push("unit must be a string");
  }

  if (body.purchased !== undefined && typeof body.purchased !== "boolean") {
    errors.push("purchased must be a boolean");
  }

  if (errors.length > 0) return { errors };

  return {
    errors,
    value: {
      name: body.name.trim(),
      quantity: body.quantity ?? 1,
      unit: body.unit,
      purchased: body.purchased ?? false,
    },
  };
  
}
export interface UpdateItemInput {
  name?: string;
  quantity?: number;
  unit?: string;
  purchased?: boolean;
}

/** Checks the body of PUT /items/:id. Any field is optional, but at least one is needed. */
export function validateUpdate(body: any): { errors: string[]; value?: UpdateItemInput } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { errors: ["Request body must be a JSON object"] };
  }

  const errors: string[] = [];
  const value: UpdateItemInput = {};

  if (body.name !== undefined) {
    if (typeof body.name !== "string" || body.name.trim() === "") {
      errors.push("name must be a non-empty string");
    } else {
      value.name = body.name.trim();
    }
  }

  if (body.quantity !== undefined) {
    if (typeof body.quantity !== "number" || body.quantity <= 0) {
      errors.push("quantity must be a positive number");
    } else {
      value.quantity = body.quantity;
    }
  }

  if (body.unit !== undefined) {
    if (typeof body.unit !== "string") {
      errors.push("unit must be a string");
    } else {
      value.unit = body.unit.trim();
    }
  }

  if (body.purchased !== undefined) {
    if (typeof body.purchased !== "boolean") {
      errors.push("purchased must be a boolean");
    } else {
      value.purchased = body.purchased;
    }
  }

  if (errors.length === 0 && Object.keys(value).length === 0) {
    errors.push("Provide at least one field to update: name, quantity, unit, purchased");
  }

  return errors.length > 0 ? { errors } : { errors, value };
}