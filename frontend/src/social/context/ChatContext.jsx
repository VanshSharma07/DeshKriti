import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [ws, setWs] = useState(null);
    const [messages, setMessages] = useState({});
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const { userInfo } = useSelector(state => state.auth);

    useEffect(() => {
        if (userInfo?.token) {
            const wsUrl = `ws://localhost:5000?token=${userInfo.token}`;
            const websocket = new WebSocket(wsUrl);

            websocket.onopen = () => {
                console.log('WebSocket Connected');
            };

            websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                handleWebSocketMessage(data);
            };

            websocket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            websocket.onclose = () => {
                console.log('WebSocket disconnected');
            };

            setWs(websocket);

            return () => {
                websocket.close();
            };
        }
    }, [userInfo]);

    const handleWebSocketMessage = (data) => {
        switch (data.type) {
            case 'message':
                setMessages(prev => ({
                    ...prev,
                    [data.chatId]: [...(prev[data.chatId] || []), data.message]
                }));
                break;
            case 'online_users':
                setOnlineUsers(new Set(data.users));
                break;
            default:
                console.log('Unknown message type:', data.type);
        }
    };

    const sendMessage = (chatId, content) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'message',
                chatId,
                content
            }));
        }
    };

    return (
        <ChatContext.Provider value={{
            messages,
            onlineUsers,
            sendMessage
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext); 