import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane, FaComments } from 'react-icons/fa';
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
    const [voices, setVoices] = useState([]);

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
                stopSpeech();
            };

            recognition.onresult = (event) => {
                stopAllAudio();
                stopSpeech();
                clearTimeout(silenceTimeoutRef.current);
                
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                        stopAllAudio();
                        stopSpeech();
                    } else {
                        interimTranscript += transcript;
                        if (interimTranscript.trim().length > 0) {
                            stopAllAudio();
                            stopSpeech();
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
            stopSpeech();
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
            stopSpeech();
            startRecording();
        }
    };

    const speakMessage = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            // Clean and format the text
            const cleanText = text
                .replace(/•/g, '')
                .replace(/\n/g, '. ')
                .replace(/\s+/g, ' ')
                .trim();

            // Split into sentences and remove duplicates
            const chunks = [...new Set(
                cleanText.split(/(?<=[.!?।])\s+/)
                    .filter(chunk => chunk.trim())
            )];
            
            let currentChunkIndex = 0;
            let isSpeaking = false;

            const speakNextChunk = () => {
                if (currentChunkIndex < chunks.length && !isRecording && !isSpeaking) {
                    const chunk = chunks[currentChunkIndex].trim();
                    if (chunk) {
                        isSpeaking = true;
                        const utterance = new SpeechSynthesisUtterance(chunk);
                        
                        // Optimized voice settings for Indian accent
                        utterance.lang = 'en-IN'; // Ensure Indian English
                        utterance.rate = 1.3;      // Increased rate for faster speech
                        utterance.pitch = 1.2;     // Higher pitch for female voice
                        utterance.volume = 1.0;

                        // Get available voices
                        const voices = window.speechSynthesis.getVoices();
                        
                        // Prioritized voice selection for Indian female voices
                        const voiceOptions = [
                            voices.find(voice => voice.name.includes('Zira')),
                            voices.find(voice => 
                                (voice.name.toLowerCase().includes('priya') || 
                                 voice.name.toLowerCase().includes('isha') ||
                                 voice.name.toLowerCase().includes('veena')) &&
                                (voice.lang === 'en-IN' || voice.lang === 'hi-IN')
                            ),
                            voices.find(voice => 
                                voice.lang === 'en-IN' && 
                                voice.name.toLowerCase().includes('female')
                            ),
                            voices.find(voice => 
                                voice.lang.startsWith('en-') && 
                                voice.name.toLowerCase().includes('female')
                            ),
                            voices.find(voice => 
                                voice.name.toLowerCase().includes('female')
                            )
                        ];

                        const selectedVoice = voiceOptions.find(voice => voice !== undefined);
                        if (selectedVoice) {
                            utterance.voice = selectedVoice;
                        }

                        utterance.onend = () => {
                            isSpeaking = false;
                            currentChunkIndex++;
                            // Reduced delay between chunks
                            setTimeout(() => {
                                speakNextChunk();
                            },0.5); // Further reduced to 50ms for quicker transitions
                        };

                        utterance.onerror = (event) => {
                            console.error('Speech synthesis error:', event);
                            isSpeaking = false;
                            currentChunkIndex++;
                            speakNextChunk();
                        };

                        currentAudioRef.current = utterance;
                        window.speechSynthesis.speak(utterance);

                        // More frequent resume checks
                        const ensureSpeaking = setInterval(() => {
                            if (window.speechSynthesis.paused && !isRecording) {
                                window.speechSynthesis.resume();
                            }
                        }, 100); // Keep this at 100ms for responsiveness

                        utterance.onend = () => {
                            clearInterval(ensureSpeaking);
                            isSpeaking = false;
                            currentChunkIndex++;
                            setTimeout(() => {
                                speakNextChunk();
                            }, 50); // Reduced to 50ms for quicker transitions
                        };
                    } else {
                        currentChunkIndex++;
                        speakNextChunk();
                    }
                }
            };

            // Start speaking
            speakNextChunk();

            // Cleanup after estimated completion
            const estimatedDuration = chunks.length * 2000; // Reduced from 2500ms to 2000ms per chunk
            setTimeout(() => {
                if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                }
            }, estimatedDuration + 1000);
        }
    };

    const handleSendMessage = async (directMessage = null) => {
        const messageToSend = directMessage || inputMessage;
        if (!messageToSend.trim()) return;

        try {
            setIsLoading(true);
            stopSpeech();
            
            setMessages(prev => [...prev, {
                role: 'user',
                content: messageToSend
            }]);
            
            setInputMessage('');
            
            const response = await api.post('/ai-chat/process-message', {
                message: messageToSend
            });

            if (response.data?.message) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: response.data.message
                }]);
                
                // Handle search action
                if (response.data.action === 'search' && response.data.searchQuery) {
                    // Trigger global search
                    triggerGlobalSearch(response.data.searchQuery);
                }
                
                if (!isRecording) {
                    speakMessage(response.data.message);
                }
            }
        } catch (error) {
            console.error('Detailed Error:', error);
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

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Initialize voices with preference for Indian accent
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            
            // Log available Indian voices for debugging
            const indianVoices = availableVoices.filter(voice => 
                voice.lang === 'en-IN' || voice.lang === 'hi-IN'
            );
            console.log('Available Indian voices:', indianVoices.map(v => v.name));
        };

        if ('speechSynthesis' in window) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
            loadVoices();
        }

        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    // Enhanced stop speech function
    const stopSpeech = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            if (currentAudioRef.current) {
                currentAudioRef.current = null;
            }
        }
    };

    // Handle chat box close
    const handleClose = () => {
        stopSpeech();  // Stop any ongoing speech
        setMessages([]); // Clear messages
        setInputMessage(''); // Clear input
        setIsOpen(false); // Close chat box
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isOpen ? (
                <div className="w-96 h-[600px] bg-white rounded-lg shadow-xl flex flex-col">
                    {/* Header */}
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
                            onClick={handleClose}
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
                </div>
            ) : (
                <button 
                    onClick={() => setIsOpen(true)}
                    // className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition-colors"
                >
                    <img 
                        src="/images/ai.png" 
                        alt="AI Assistant" 
                        className="w-24 h-24 object-contain"
                    />
                </button>
            )}
        </div>
    );
};

export default ChatBot; 