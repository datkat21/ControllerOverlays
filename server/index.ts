// Basic HTTP server
const server = Bun.serve({
  fetch(req) {
    const u = new URL(req.url);

    if (u.pathname === '/') u.pathname = '/index.html';

    return new Response(Bun.file("../" + u.pathname));
  },
});

console.log("Listening on", `http://${server.hostname}:${server.port}`);
