const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

const clients = new Set();

server.on('connection', (ws) => {
  clients.add(ws);
  console.log('Client connected, total:', clients.size);

  ws.on('message', (message) => {
    console.log('Received:', message);

    // Broadcast to all *other* clients
    for (const client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected, total:', clients.size);
  });
});
