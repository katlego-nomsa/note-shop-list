# Shopping List API

A REST API for managing a shopping list, built with Node.js, TypeScript and the built-in `http` module (no frameworks). Items are stored in memory, so the list resets when the server restarts.

## Features
- Add, view, update and delete shopping list items
- Mark items as purchased and change quantities
- Input validation with clear error messages
- Consistent JSON responses for every endpoint

## Project Structure
```
src/
├── server.ts            # HTTP server and routing
├── models/item.ts       # Item type and validation
├── store/itemStore.ts   # In-memory data store
└── utils/
    ├── errors.ts        # Error classes and reusable error handler
    ├── response.ts      # JSON response helpers
    └── body.ts          # JSON request body parser
```

## Getting Started
Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

The server runs on `http://localhost:3000` (set the `PORT` environment variable to change it).

To build and run the compiled version:

```bash
npm run build
npm start
```

## Item Model
| Field       | Type    | Notes                                  |
|-------------|---------|----------------------------------------|
| `id`        | number  | Auto-generated                         |
| `name`      | string  | Required, cannot be empty              |
| `quantity`  | number  | Positive number, defaults to `1`       |
| `unit`      | string  | Optional, e.g. `"L"`, `"kg"`           |
| `purchased` | boolean | Defaults to `false`                    |
| `createdAt` | string  | ISO timestamp, set automatically       |
| `updatedAt` | string  | ISO timestamp, updated on every change |

## Response Format
Success:
```json
{ "success": true, "data": { } }
```

Error:
```json
{ "success": false, "error": { "message": "Validation failed", "details": ["name is required"] } }
```

`details` only appears for validation errors. A successful `DELETE` returns `204 No Content` with an empty body.

## Endpoints

### POST /items
Add an item.

Request body:
```json
{ "name": "Milk", "quantity": 2, "unit": "L" }
```
- `201 Created`: returns the new item
- `400 Bad Request`: missing or invalid fields, or invalid JSON

### GET /items
Get all items.
- `200 OK`: returns an array of items (empty if there are none)

### GET /items/:id
Get a single item.
- `200 OK`: returns the item
- `400 Bad Request`: id is not a positive whole number
- `404 Not Found`: item does not exist

### PUT /items/:id
Update an item. Send any of `name`, `quantity`, `unit`, `purchased` (at least one).

Request body:
```json
{ "purchased": true, "quantity": 3 }
```
- `200 OK`: returns the updated item
- `400 Bad Request`: invalid fields, empty body or invalid id
- `404 Not Found`: item does not exist

### DELETE /items/:id
Delete an item.
- `204 No Content`: item deleted
- `404 Not Found`: item does not exist

### Other errors
- `404`: unknown route
- `405`: method not supported on that route
- `500`: unexpected server error

## Testing with Postman
1. Start the server and use the base URL `http://localhost:3000`.
2. For `POST` and `PUT`, open **Body**, choose **raw** and set the type to **JSON**.
3. Suggested test flow:
   1. `POST /items` with `{"name":"Milk","quantity":2,"unit":"L"}` returns 201
   2. `POST /items` with `{"name":"Eggs"}` returns 201
   3. `POST /items` with `{}` returns 400
   4. `GET /items` returns both items
   5. `GET /items/1` returns Milk
   6. `GET /items/99` returns 404
   7. `PUT /items/1` with `{"purchased":true,"quantity":3}` returns 200
   8. `PUT /items/1` with `{"quantity":-5}` returns 400
   9. `DELETE /items/2` returns 204
   10. `DELETE /items/2` again returns 404
