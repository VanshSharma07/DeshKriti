import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    CircularProgress,
    TextField,
    Button,
    List,
    useTheme,
    Avatar
} from '@mui/material';
import { Close, ArrowBack } from '@mui/icons-material';
import api from '../../../api/api';
import { useSelector } from 'react-redux';
import Friend from '../Friend';

const ChatPanel = ({ onClose, isOpen }) => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeChat, setActiveChat] = useState(null);
    const [activeFriend, setActiveFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const currentUser = useSelector((state) => state.auth.userInfo);
    const theme = useTheme();
    const { selectedUser } = useSelector(state => state.communityMap);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const [followingResponse, followersResponse] = await Promise.all([
                    api.get(`/social/following/${currentUser.id}`),
                    api.get(`/social/followers/${currentUser.id}`)
                ]);

                const following = followingResponse.data?.following || [];
                const followers = followersResponse.data?.followers || [];

                // Combine and remove duplicates
                const allFriends = [...following, ...followers].reduce((acc, friend) => {
                    if (!acc.some(f => f._id === friend._id)) {
                        acc.push(friend);
                    }
                    return acc;
                }, []);

                console.log('Fetched friends:', allFriends);
                setFriends(allFriends);

                if (selectedUser?.userId) {
                    const selectedFriend = allFriends.find(
                        friend => friend._id === selectedUser.userId._id
                    );
                    if (selectedFriend) {
                        handleStartChat(selectedFriend);
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching friends list:', error);
                setLoading(false);
            }
        };

        if (currentUser?.id && isOpen) {
            fetchFriends();
        }
    }, [currentUser, isOpen, selectedUser]);

    const handleStartChat = async (friend) => {
        try {
            setActiveFriend(friend);
            const response = await api.post('/social/chats/create', {
                participantIds: [friend._id]
            });
            if (response.data && response.data.chat) {
                setActiveChat(response.data.chat);
                const messagesResponse = await api.get(`/social/chats/${response.data.chat._id}`);
                if (messagesResponse.data && messagesResponse.data.chat) {
                    setMessages(messagesResponse.data.chat.messages || []);
                }
            }
        } catch (error) {
            console.error('Error creating chat:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !activeChat?._id) return;

        try {
            const response = await api.post(`/social/chats/${activeChat._id}/message`, {
                text: newMessage
            });
            
            if (response.data && response.data.message) {
                setMessages([...messages, response.data.message]);
                setNewMessage('');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleBack = () => {
        setActiveChat(null);
        setActiveFriend(null);
        setMessages([]);
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                right: 0,
                height: '100vh',
                width: '360px',
                bgcolor: theme.palette.background.default,
                boxShadow: 3,
                zIndex: 1300,
                transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 0.3s ease-in-out',
                display: 'flex',
                flexDirection: 'column',
                borderLeft: `1px solid ${theme.palette.divider}`
            }}
        >
            {!activeChat ? (
                // Friends List View
                <>
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            flex: '0 0 auto', 
                            display: 'flex', 
                            alignItems: 'center', 
                            p: 2,
                            bgcolor: theme.palette.background.alt,
                            color: theme.palette.text.primary
                        }}
                    >
                        <Typography variant="h6" sx={{ flex: 1 }}>Messages</Typography>
                        <IconButton onClick={onClose} sx={{ color: theme.palette.text.primary }}>
                            <Close />
                        </IconButton>
                    </Paper>
                    <Box sx={{ 
                        flex: 1, 
                        overflowY: 'auto',
                        bgcolor: theme.palette.background.default,
                        p: 2
                    }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <List sx={{ p: 0 }}>
                                {friends.map((friend) => (
                                    <Box 
                                        key={friend._id} 
                                        sx={{ 
                                            mb: 2,
                                            '&:hover': {
                                                bgcolor: theme.palette.background.alt,
                                                borderRadius: 1
                                            }
                                        }}
                                    >
                                        <Friend
                                            friendId={friend._id}
                                            name={`${friend.firstName} ${friend.lastName}`}
                                            subtitle={friend.email}
                                            userPicturePath={friend.image}
                                            onClick={() => handleStartChat(friend)}
                                            hideActions={true}
                                        />
                                    </Box>
                                ))}
                            </List>
                        )}
                    </Box>
                </>
            ) : (
                // Chat View
                <>
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            flex: '0 0 auto', 
                            display: 'flex', 
                            alignItems: 'center', 
                            p: 2,
                            bgcolor: theme.palette.background.alt,
                            color: theme.palette.text.primary
                        }}
                    >
                        <IconButton onClick={handleBack} sx={{ mr: 1, color: theme.palette.text.primary }}>
                            <ArrowBack />
                        </IconButton>
                        <Avatar src={activeFriend?.image} sx={{ mr: 2 }} />
                        <Typography variant="h6">
                            {activeFriend?.firstName} {activeFriend?.lastName}
                        </Typography>
                    </Paper>

                    <Box sx={{ 
                        flex: 1, 
                        overflowY: 'auto', 
                        p: 2,
                        bgcolor: theme.palette.background.default
                    }}>
                        {messages.map((msg, index) => (
                            <Box 
                                key={index} 
                                sx={{ 
                                    mb: 2, 
                                    display: 'flex',
                                    justifyContent: msg.senderId === currentUser.id ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <Box
                                    sx={{
                                        maxWidth: '70%',
                                        bgcolor: msg.senderId === currentUser.id ? 
                                            theme.palette.primary.main : 
                                            theme.palette.background.alt,
                                        color: msg.senderId === currentUser.id ? 
                                            '#fff' : 
                                            theme.palette.text.primary,
                                        p: 1.5,
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography variant="body1">{msg.text}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    <Box sx={{ 
                        p: 2, 
                        borderTop: `1px solid ${theme.palette.divider}`, 
                        display: 'flex', 
                        alignItems: 'center',
                        bgcolor: theme.palette.background.alt
                    }}>
                        <TextField
                            fullWidth
                            placeholder="Message..."
                            variant="outlined"
                            size="small"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSendMessage();
                                }
                            }}
                            sx={{ 
                                mr: 1,
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: theme.palette.background.default,
                                    '& fieldset': {
                                        borderColor: theme.palette.divider
                                    },
                                    '&:hover fieldset': {
                                        borderColor: theme.palette.primary.main
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.palette.primary.main
                                    }
                                },
                                '& .MuiInputBase-input': {
                                    color: theme.palette.text.primary
                                }
                            }}
                        />
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                        >
                            Send
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default ChatPanel; 