const WebSocket = require('ws');

const PORT = process.env.PORT || 433;
const server = new WebSocket.Server({ port: PORT });

const clients = new Set();

server.on('connection', (socket) => {
    console.log('Client connected');
    clients.add(socket);

    socket.on('message', (message) => {
        console.log('Received:', message.toString());
        // Broadcast to all other clients
        for (const client of clients) {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        }
    });

    socket.on('close', () => {
        console.log('Client disconnected');
        clients.delete(socket);
    });

    socket.on('error', (err) => {
        console.error('WebSocket error:', err);
    });
});

console.log(`WebSocket server is running on port ${PORT}`);
