const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const rootDir = __dirname;
const port = Number(process.env.PORT || 8000);

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

function getLanAddress() {
  const interfaces = os.networkInterfaces();

  for (const networkGroup of Object.values(interfaces)) {
    for (const network of networkGroup || []) {
      if (network.family !== "IPv4" || network.internal) {
        continue;
      }

      if (network.address.startsWith("169.254.")) {
        continue;
      }

      return network.address;
    }
  }

  return null;
}

function safeResolve(requestPath) {
  const normalized = path.normalize(path.join(rootDir, requestPath));

  if (!normalized.startsWith(rootDir)) {
    return null;
  }

  return normalized;
}

function sendJson(response, payload) {
  response.writeHead(200, {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload, null, 2));
}

function sendFile(filePath, response) {
  fs.stat(filePath, (statError, stats) => {
    if (statError) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("File not found.");
      return;
    }

    const resolvedPath = stats.isDirectory() ? path.join(filePath, "index.html") : filePath;
    const extension = path.extname(resolvedPath).toLowerCase();
    const contentType = mimeTypes[extension] || "application/octet-stream";

    fs.readFile(resolvedPath, (readError, fileBuffer) => {
      if (readError) {
        response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Could not read the requested file.");
        return;
      }

      response.writeHead(200, { "Content-Type": contentType });
      response.end(fileBuffer);
    });
  });
}

const server = http.createServer((request, response) => {
  const host = request.headers.host || `localhost:${port}`;
  const requestUrl = new URL(request.url || "/", `http://${host}`);

  if (requestUrl.pathname === "/launch-config.json") {
    const lanAddress = getLanAddress();
    const lanOrigin = lanAddress ? `http://${lanAddress}:${port}` : null;

    sendJson(response, {
      lanOrigin,
      localOrigin: `http://localhost:${port}`,
      port,
    });
    return;
  }

  const pathname = requestUrl.pathname === "/" ? "/index.html" : decodeURIComponent(requestUrl.pathname);
  const resolvedPath = safeResolve(pathname.slice(1));

  if (!resolvedPath) {
    response.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Blocked.");
    return;
  }

  sendFile(resolvedPath, response);
});

server.listen(port, "0.0.0.0", () => {
  const lanAddress = getLanAddress();

  console.log("");
  console.log("Love page server is running.");
  console.log(`Desktop preview: http://localhost:${port}`);

  if (lanAddress) {
    console.log(`Phone QR target: http://${lanAddress}:${port}/phone.html`);
    console.log(`QR launcher page: http://${lanAddress}:${port}`);
  } else {
    console.log("No LAN IPv4 address was found. Connect to Wi-Fi or Ethernet first.");
  }

  console.log("");
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Close the other server or change PORT.`);
    return;
  }

  console.error(error.message);
});
