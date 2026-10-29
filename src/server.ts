import http from "http";

const PORT = Number(process.env.PORT) || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ success: true, data: { message: "Shopping List API is running" } }));
});

server.listen(PORT, () => {
  console.log(`Shopping List API running on http://localhost:${PORT}`);
});