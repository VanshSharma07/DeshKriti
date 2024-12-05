import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane } from 'react-icons/fa';
import { BsSoundwave, BsMicFill } from 'react-icons/bs';
import api from '../../api/api';
import { useNavigate } from 'react-router-dom';

// Add this custom event function at the top of the file, outside the component
const triggerGlobalSearch = (searchQuery) => {
    const searchEvent = new CustomEvent('deshkriti-search', {
        detail: { searchQuery }
    });
    window.dispatchEvent(searchEvent);
};

const SoundWave = () => (
    <div className="flex items-center gap-[2px] h-4">
        {[1, 2, 3, 4].map((i) => (
            <div
                key={i}
                className="w-[2px] h-full bg-white animate-sound-wave"
                style={{
                    animation: `soundWave 0.5s linear infinite`,
                    animationDelay: `${i * 0.1}s`
                }}
            />
        ))}
    </div>
);

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [recognition, setRecognition] = useState(null);
    const [currentAudio, setCurrentAudio] = useState(null);
    const silenceTimeoutRef = useRef(null);
    const interimResultRef = useRef('');
    const [audioQueue, setAudioQueue] = useState([]);
    const currentAudioRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (window.webkitSpeechRecognition) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-IN';

            recognition.onstart = () => {
                setIsRecording(true);
                interimResultRef.current = '';
                stopAllAudio();
            };

            recognition.onresult = (event) => {
                stopAllAudio();
                clearTimeout(silenceTimeoutRef.current);
                
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                        stopAllAudio();
                    } else {
                        interimTranscript += transcript;
                        if (interimTranscript.trim().length > 0) {
                            stopAllAudio();
                        }
                    }
                }

                if (finalTranscript) {
                    interimResultRef.current = '';
                    handleSendMessage(finalTranscript);
                } else if (interimTranscript) {
                    interimResultRef.current = interimTranscript;
                    setInputMessage(interimTranscript);
                }

                silenceTimeoutRef.current = setTimeout(() => {
                    if (interimResultRef.current) {
                        stopAllAudio();
                        handleSendMessage(interimResultRef.current);
                        interimResultRef.current = '';
                    }
                }, 2000);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                if (event.error !== 'no-speech') {
                    stopRecording();
                }
            };

            recognition.onend = () => {
                if (isRecording) {
                    recognition.start(); // Restart if still in recording mode
                }
            };

            setRecognition(recognition);
        }

        return () => {
            if (recognition) {
                recognition.stop();
            }
            stopAllAudio();
        };
    }, []);

    const stopAllAudio = () => {
        if (currentAudioRef.current) {
            try {
                currentAudioRef.current.pause();
                currentAudioRef.current.currentTime = 0;
            } catch (error) {
                console.error('Error stopping audio:', error);
            }
            currentAudioRef.current = null;
        }
        setCurrentAudio(null);
        setAudioQueue([]);
    };

    const startRecording = () => {
        if (recognition) {
            // Stop any playing audio
            stopAllAudio();
            recognition.start();
            setIsRecording(true);
        }
    };

    const stopRecording = () => {
        if (recognition) {
            recognition.stop();
            setIsRecording(false);
            clearTimeout(silenceTimeoutRef.current);
            if (interimResultRef.current) {
                handleSendMessage(interimResultRef.current);
                interimResultRef.current = '';
            }
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handleSendMessage = async (directMessage = null) => {
        const messageToSend = directMessage || inputMessage;
        if (!messageToSend.trim()) return;

        try {
            stopAllAudio();
            setIsLoading(true);
            setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
            setInputMessage('');

            const response = await api.post('/ai-chat/process-message', {
                message: messageToSend
            });

            if (response.data?.searchIntent && response.data?.searchQuery) {
                // Add the AI's response to the chat
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: response.data.message
                }]);

                // Trigger the global search event instead of direct navigation
                triggerGlobalSearch(response.data.searchQuery);
            } else if (response.data?.message) {
                // Handle normal responses as before
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: response.data.message
                }]);

                // Only proceed with text-to-speech if not recording
                if (!isRecording) {
                    try {
                        const speechResponse = await api.post('/ai-chat/text-to-speech', {
                            text: response.data.message
                        });

                        if (speechResponse.data?.audioContent) {
                            // Create new audio instance
                            const audio = new Audio(`data:audio/mp3;base64,${speechResponse.data.audioContent}`);
                            
                            // Set up audio event handlers
                            audio.onplay = () => {
                                currentAudioRef.current = audio;
                            };
                            
                            audio.onended = () => {
                                currentAudioRef.current = null;
                                setCurrentAudio(null);
                            };

                            audio.onerror = (e) => {
                                console.error('Audio playback error:', e);
                                currentAudioRef.current = null;
                                setCurrentAudio(null);
                            };

                            // Stop any existing audio before playing new one
                            stopAllAudio();
                            
                            // Play new audio
                            setCurrentAudio(audio);
                            currentAudioRef.current = audio;
                            
                            // Add error handling for play()
                            try {
                                await audio.play();
                            } catch (error) {
                                console.error('Failed to play audio:', error);
                            }
                        }
                    } catch (error) {
                        console.error('Text-to-speech error:', error);
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (currentAudioRef.current) {
                currentAudioRef.current.pause();
                currentAudioRef.current = null;
            }
            setCurrentAudio(null);
        };
    }, []);

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-50 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <img 
                    src="/images/ai.png" 
                    alt="AI Assistant" 
                    className="w-28 h-28 object-contain"
                />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-20 right-4 w-96 h-[600px] bg-white rounded-lg shadow-xl overflow-hidden z-50"
                    >
                        {/* Chat header */}
                        <div className="flex justify-between items-center p-4 bg-blue-500 text-white">
                            <div className="flex items-center gap-2">
                                <img 
                                    src="/images/ai.png" 
                                    alt="AI Assistant" 
                                    className="w-10 h-10 object-contain"
                                />
                                <h3 className="font-semibold">Bharat Post GPT</h3>
                            </div>
                            <button 
                                onClick={() => {
                                    stopAllAudio();  // Stop any playing audio
                                    setMessages([]); // Clear all messages
                                    setInputMessage(''); // Clear input
                                    setIsOpen(false);
                                }}
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        {/* Messages container */}
                        <div className="h-96 overflow-y-auto p-4 bg-gray-50">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                                    <div className={`max-w-[80%] p-3 rounded-lg ${
                                        msg.role === 'user' 
                                            ? 'bg-blue-500 text-white rounded-br-none' 
                                            : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input area */}
                        <div className="p-4 border-t border-gray-200 bg-white">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type your message..."
                                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                                <button
                                    onClick={toggleRecording}
                                    className={`p-2 rounded-full transition-colors ${
                                        isRecording 
                                            ? 'bg-blue-500 hover:bg-blue-800' 
                                            : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                                >
                                    {isRecording ? (
                                        <SoundWave />
                                    ) : (
                                        <BsSoundwave 
                                            size={20} 
                                            className="text-gray-600"
                                        />
                                    )}
                                </button>
                                <button
                                    onClick={() => handleSendMessage()}
                                    disabled={isLoading || !inputMessage.trim()}
                                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FaPaperPlane size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBot; 