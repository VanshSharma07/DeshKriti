import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { IoSend } from "react-icons/io5";
import socket from "../../utils/socket";
import {
  fetchConnectedUsers,
  fetchMessages,
  sendMessage,
  addMessage,
  updateMessageStatus,
  setCurrentChat,
} from "../../store/reducers/communityMessageSlice";
import { toast } from "react-hot-toast";
import Header2 from "../Header2";

const CommunityChat = () => {
  console.log("🔵 Component mounting");
  const dispatch = useDispatch();
  const { receiverId } = useParams();
  const scrollRef = useRef();
  const [messageText, setMessageText] = useState("");
  
  const { userInfo } = useSelector((state) => {
    console.log("🔵 Auth state:", state.auth.userInfo);
    return state.auth;
  });

  const normalizedUserInfo = userInfo ? {
    ...userInfo,
    _id: userInfo.id
  } : null;

  const { connectedUsers, messages, currentChat, loading } = useSelector((state) => {
    return state.communityMessage;
  });

  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeChat = async () => {
      if (!normalizedUserInfo?._id) {
        console.warn("⚠️ No user info available");
        return;
      }
      
      try {
        console.log("🔵 Fetching connected users for:", normalizedUserInfo._id);
        const users = await dispatch(fetchConnectedUsers()).unwrap();
        console.log("✅ Connected users loaded:", users);
        
        socket.emit("join_user", normalizedUserInfo._id);
        socket.emit('add_community_user', normalizedUserInfo._id, normalizedUserInfo);
        setIsInitialized(true);
      } catch (error) {
        console.error("❌ Error initializing chat:", error);
        toast.error("Failed to initialize chat");
      }
    };

    initializeChat();
  }, [dispatch, normalizedUserInfo?._id]);

  useEffect(() => {
    if (!receiverId || !normalizedUserInfo?._id) return;

    console.log("🔵 Receiver changed:", receiverId);
    
    try {
      // Fetch messages for this receiver
      dispatch(fetchMessages(receiverId));
      
      // Find and set current chat user
      const receiver = connectedUsers.find(user => user._id === receiverId);
      console.log("Found receiver:", receiver);
      
      if (receiver) {
        dispatch(setCurrentChat(receiver));
      } else {
        console.warn("⚠️ No receiver found for ID:", receiverId);
      }
    } catch (error) {
      console.error("❌ Error setting up chat with receiver:", error);
      toast.error("Failed to load chat");
    }
  }, [dispatch, receiverId, connectedUsers, normalizedUserInfo?._id]);

  useEffect(() => {
    socket.on('activeUser', (users) => {
      console.log('🔵 Active users updated:', users);
      setOnlineUsers(new Set(users));
    });

    return () => {
      socket.off('activeUser');
    };
  }, []);

  useEffect(() => {
    socket.on('receive_message', (message) => {
      console.log('🔵 Received message:', message);
      dispatch(addMessage(message));
    });

    return () => {
      socket.off('receive_message');
    };
  }, [dispatch]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !normalizedUserInfo?._id || !receiverId) return;

    try {
      const messageData = {
        senderId: normalizedUserInfo._id,
        receiverId,
        message: messageText.trim()
      };

      console.log('🔵 Sending message:', messageData);
      await dispatch(sendMessage(messageData)).unwrap();
      setMessageText('');
      
      socket.emit('send_message', messageData);
    } catch (error) {
      console.error('❌ Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const renderUserStatus = (userId) => {
    return onlineUsers.has(userId) ? (
      <span className="w-3 h-3 bg-green-500 rounded-full absolute bottom-0 right-0" />
    ) : (
      <span className="w-3 h-3 bg-gray-400 rounded-full absolute bottom-0 right-0" />
    );
  };

  const renderContent = () => {
    console.log("🔵 Rendering content", { 
      isInitialized, 
      loading, 
      hasUserInfo: !!normalizedUserInfo?._id,
      connectedUsers: connectedUsers.length
    });

    if (!normalizedUserInfo?._id) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500">
            Please wait while loading... (User ID: {normalizedUserInfo?.id || 'none'})
          </div>
        </div>
      );
    }

    if (!isInitialized || loading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading chat...</div>
        </div>
      );
    }

    return (
      <div className="flex h-[calc(100vh-64px)]">
        {/* Connected Users Sidebar */}
        <div className="w-64 bg-white border-r">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Connected Users</h2>
            <div className="space-y-2">
              {connectedUsers.map((user) => (
                <Link
                  key={user._id}
                  to={`/community/chat/${user._id}`}
                  className={`flex items-center p-2 rounded ${
                    user._id === receiverId ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}>
                  <img
                    src={user.image || "/images/user.png"}
                    alt={user.firstName}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                  {renderUserStatus(user._id)}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b bg-white">
                <div className="flex items-center">
                  <img
                    src={currentChat.image || "/images/user.png"}
                    alt={currentChat.firstName}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <span className="font-semibold">
                    {currentChat.firstName} {currentChat.lastName}
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message, index) => {
                  if (!normalizedUserInfo?._id) return null;
                  
                  const isSentByMe = message.senderId === normalizedUserInfo._id;
                  console.log('🔍 Message:', {
                    senderId: message.senderId,
                    currentUserId: normalizedUserInfo._id,
                    isSentByMe,
                    messageText: message.message
                  });
                  
                  return (
                    <div
                      ref={index === messages.length - 1 ? scrollRef : null}
                      key={message._id || index}
                      className={`w-full flex ${isSentByMe ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      <div className={`flex ${isSentByMe ? 'flex-row-reverse' : 'flex-row'} items-start max-w-[70%] gap-2`}>
                        <img
                          className="w-8 h-8 rounded-full"
                          src={isSentByMe ? (normalizedUserInfo.image || "/images/user.png") : (currentChat?.image || "/images/user.png")}
                          alt=""
                        />
                        <div>
                          <span className="text-xs text-gray-500 block mb-1">
                            {isSentByMe ? 'You' : currentChat?.firstName}
                          </span>
                          <div
                            className={`p-3 rounded-lg ${
                              isSentByMe 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            <p>{message.message}</p>
                            <span className="text-xs opacity-70 block mt-1">
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    <IoSend size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a user to start chatting
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen">
      <Header2/>
      {renderContent()}
    </div>
  );
};

export default CommunityChat;
