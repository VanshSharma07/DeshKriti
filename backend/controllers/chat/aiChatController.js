const { OpenAI } = require('openai');
const textToSpeech = require('@google-cloud/text-to-speech');
const AIChatHistory = require('../../models/chat/AIChatHistory');
const { responseReturn } = require('../../utiles/response');

class AIChatController {
    constructor() {
        // Initialize OpenAI with the new SDK
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        
        // Custom knowledge base
        this.customData = {
            platform_info: {
                about: "Deshkriti is a platform developed by Team Instant Ideators for the Department of Posts, bridges Indian artisans and MSME sellers with the global diaspora. It fulfills the demand for authentic Indian products, fostering connections to cultural roots.",
                
                products: [
                    "Regional and traditional items",
                    "Pooja essentials",
                    "State-specific popular products",
                    "Indian arts",
                    "Wedding attire",
                    "Indian sweets"
                ],

                key_features: [
                    {
                        name: "AI-Powered Discovery",
                        description: "Tailored recommendations based on cultural background, location, and trends"
                    },
                    {
                        name: "Quality & Shipping",
                        description: "Vetted products with flat-rate global shipping through India Post"
                    },
                    {
                        name: "Festive Shopping",
                        description: "Wishlist, festival pre-orders, and event-centric filters"
                    },
                    {
                        name: "Interactive 3D Culture Map",
                        description: "Explore state-wise stories, traditions, and products"
                    },
                    {
                        name: "Virtual Events",
                        description: "Host and attend global Indian cultural events"
                    },
                    {
                        name: "Community Forum",
                        description: "Share experiences and engage with the diaspora worldwide"
                    },
                    {
                        name: "AR Product View",
                        description: "Experience products in 3D through Augmented Reality"
                    },
                    {
                        name: "Help India Portal",
                        description: "Support India via donations, campaigns, and volunteering"
                    },
                    {
                        name: "Region-Based Filters",
                        description: "Discover India's diversity through state-wise product categories"
                    }
                ],

                seller_benefits: [
                    {
                        name: "Empowerment",
                        description: "Easy onboarding, training, and actionable analytics"
                    },
                    {
                        name: "Sustainability",
                        description: "Promote eco-friendly and fair-trade-certified products"
                    }
                ]
            }
        };

        this.systemPrompt = `You are Bharat Post GPT, the official AI assistant for the DeshKriti platform, developed by Team Instant Ideators for the Department of Post.

Keep all responses brief and to the point. Avoid unnecessary elaboration.

When users specifically ask "What is DeshKriti?", provide a concise response with:
- Deshkriti is a platform developed by Team Instant Ideators for the Department of Post.
- Platform overview (1-2 sentences)
- Key products (maximum 3)
- Main features (maximum 3)
- Core seller benefit (1 sentence)

When users ask about features or "What are DeshKriti's features?", respond with:
"The features DeshKriti offers are:" followed by top 5 features only:
• Feature Name - Brief description (max 8 words)

For specific feature questions, provide a single, focused explanation.

When listing items or places:
- Limit to 5 most important items
- Use bullet points
- Name - Brief description
- No markdown symbols

Always maintain a friendly tone while being concise.

Here is your complete knowledge base:
${JSON.stringify(this.customData, null, 2)}`;

        // Initialize Google Text-to-Speech
        this.ttsClient = new textToSpeech.TextToSpeechClient({
            keyFilename: process.env.GOOGLE_CLOUD_CREDENTIALS
        });
    }

    // Process text message without requiring user authentication
    processMessage = async (req, res) => {
        let { message } = req.body;

        try {
            // Normalize and preprocess the message
            message = message.toLowerCase();

            // Correct common misinterpretations of "DeshKriti"
            const deshKritiVariations = ["this kriti", "desh preeti", "desh kriti"];
            deshKritiVariations.forEach(variation => {
                if (message.includes(variation)) {
                    message = message.replace(variation, "deshkriti");
                }
            });

            // Check if the message is asking about Bharat Post GPT
            if (message.includes("what is bharat post gpt")) {
                const aiResponse = "Bharat Post GPT is the official AI assistant of DeshKriti, developed by Team Instant Ideators for the Department of Post.";
                responseReturn(res, 200, { message: aiResponse });
                return;
            }

            // Add a check for search-related keywords
            const searchKeywords = ['order', 'buy', 'purchase', 'find', 'search', 'looking for', 'where can i get'];
            const hasSearchIntent = searchKeywords.some(keyword => message.toLowerCase().includes(keyword));

            if (hasSearchIntent) {
                // Get the search query from GPT
                const searchIntentCompletion = await this.openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "Extract the product or item to search for from the user's message. Respond with a JSON object containing type: 'search_intent' and searchQuery: 'the product to search for'"
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 100
                });

                const response = searchIntentCompletion.choices[0].message.content;
                try {
                    const searchData = JSON.parse(response);
                    if (searchData.type === 'search_intent' && searchData.searchQuery) {
                        return responseReturn(res, 200, {
                            message: `I'll help you search for "${searchData.searchQuery}"`,
                            searchIntent: true,
                            searchQuery: searchData.searchQuery
                        });
                    }
                } catch (e) {
                    // If JSON parsing fails, continue with normal processing
                }
            }

            // First, check if the message is related to DeshKriti or platform features
            const relevanceCheck = await this.openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a classifier. Respond with 'true' if the query is about DeshKriti, its features, products, or Indian cultural marketplace. Respond with 'false' for any other topics."
                    },
                    {
                        role: "user",
                        content: message
                    }
                ],
                temperature: 0.3,
                max_tokens: 10
            });

            const isRelevantToPlatform = relevanceCheck.choices[0].message.content.toLowerCase().includes('true');

            // If relevant to platform, use custom knowledge base
            if (isRelevantToPlatform) {
                const completion = await this.openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { 
                            role: "system", 
                            content: this.systemPrompt
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                });

                const aiResponse = completion.choices[0].message.content;
                responseReturn(res, 200, { message: aiResponse });
            } 
            // For non-platform queries, use general AI response
            else {
                const completion = await this.openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful AI assistant. Provide informative and accurate responses while maintaining a professional tone."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                });

                const aiResponse = completion.choices[0].message.content;
                responseReturn(res, 200, { message: aiResponse });
            }
        } catch (error) {
            console.error('AI Chat Error:', error);
            responseReturn(res, 500, { error: 'Failed to process message. Please try again.' });
        }
    }

    // Convert text to speech
    textToSpeech = async (req, res) => {
        const { text } = req.body;

        try {
            const request = {
                input: { text },
                voice: { 
                    languageCode: 'en-IN',
                    ssmlGender: 'FEMALE',
                    name: 'en-IN-Standard-A'
                },
                audioConfig: { 
                    audioEncoding: 'MP3',
                    pitch: 0,
                    speakingRate: 1.0,
                    effectsProfileId: ['handset-class-device']
                },
            };

            const [response] = await this.ttsClient.synthesizeSpeech(request);
            const audioContent = response.audioContent;

            responseReturn(res, 200, { 
                audioContent: audioContent.toString('base64')
            });
        } catch (error) {
            console.error('Text-to-Speech Error:', error);
            responseReturn(res, 500, { error: 'Failed to convert text to speech. Please try again.' });
        }
    }

    // Clear chat history
    clearHistory = async (req, res) => {
        const userId = req.id;
        
        try {
            await AIChatHistory.findOneAndDelete({ userId });
            responseReturn(res, 200, { message: 'Chat history cleared successfully' });
        } catch (error) {
            console.error('Clear History Error:', error);
            responseReturn(res, 500, { error: 'Failed to clear chat history' });
        }
    }
}

module.exports = new AIChatController(); 