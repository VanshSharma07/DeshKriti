const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

class WebSocketService {
    constructor(server) {
        this.wss = new WebSocket.Server({ 
            noServer: true,
            path: '/ws'
        });

        server.on('upgrade', (request, socket, head) => {
            try {
                const url = new URL(request.url, `http://${request.headers.host}`);
                const token = url.searchParams.get('token');

                if (!token) {
                    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                    socket.destroy();
                    return;
                }

                jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                    if (err) {
                        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
                        socket.destroy();
                        return;
                    }

                    request.userId = decoded.id;

                    this.wss.handleUpgrade(request, socket, head, (ws) => {
                        this.wss.emit('connection', ws, request);
                    });
                });
            } catch (error) {
                console.error('WebSocket upgrade error:', error);
                socket.write('HTTP/1.1 500 Internal Server Error\r\n\r\n');
                socket.destroy();
            }
        });

        this.clients = new Map();

        this.wss.on('connection', (ws, request) => {
            const userId = request.userId;
            
            this.clients.set(userId, ws);

            console.log(`Client connected: ${userId}`);

            ws.send(JSON.stringify({
                type: 'connection',
                status: 'success',
                userId: userId
            }));

            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    this.handleMessage(userId, data, ws);
                } catch (error) {
                    console.error('Error handling message:', error);
                }
            });

            ws.on('close', () => {
                console.log(`Client disconnected: ${userId}`);
                this.clients.delete(userId);
            });

            ws.on('error', (error) => {
                console.error(`WebSocket error for user ${userId}:`, error);
            });
        });
    }

    handleMessage(senderId, data, ws) {
        switch (data.type) {
            case 'chat_message':
                this.handleChatMessage(senderId, data);
                break;
            case 'typing':
                this.handleTypingStatus(senderId, data);
                break;
            case 'read_receipt':
                this.handleReadReceipt(senderId, data);
                break;
            default:
                console.log('Unknown message type:', data.type);
        }
    }

    handleChatMessage(senderId, data) {
        const { recipientId, message } = data;
        const recipientWs = this.clients.get(recipientId);

        if (recipientWs) {
            recipientWs.send(JSON.stringify({
                type: 'chat_message',
                senderId,
                message,
                timestamp: new Date()
            }));
        }
    }

    handleTypingStatus(senderId, data) {
        const { recipientId, isTyping } = data;
        const recipientWs = this.clients.get(recipientId);

        if (recipientWs) {
            recipientWs.send(JSON.stringify({
                type: 'typing',
                senderId,
                isTyping
            }));
        }
    }

    handleReadReceipt(senderId, data) {
        const { recipientId, messageId } = data;
        const recipientWs = this.clients.get(recipientId);

        if (recipientWs) {
            recipientWs.send(JSON.stringify({
                type: 'read_receipt',
                senderId,
                messageId
            }));
        }
    }

    sendToUser(userId, message) {
        const ws = this.clients.get(userId);
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(message));
        }
    }

    broadcast(senderId, message) {
        this.clients.forEach((ws, userId) => {
            if (userId !== senderId && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(message));
            }
        });
    }

    getConnectedUsers() {
        return Array.from(this.clients.keys());
    }
}

module.exports = WebSocketService; 