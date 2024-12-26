const { HfInference } = require('@huggingface/inference');
const AIChatHistory = require('../../models/chat/AIChatHistory');
const { responseReturn } = require('../../utiles/response');

class AIChatController {
    constructor() {
        this.hf = new HfInference(process.env.HUGGINGFACE_TOKEN);
        this.model = 'microsoft/DialoGPT-large';

        // Enhanced predefined responses
        this.responses = {
            bharat_post_gpt: `Bharat Post GPT is an AI assistant developed for DeshKriti and India Post to help users:

• Learn about Indian culture, traditions, and festivals
• Discover authentic Indian products and crafts
• Understand regional customs and heritage
• Navigate the DeshKriti platform
• Connect with Indian artisans and sellers`,

            deshkriti: `DeshKriti is a platform by Team Instant Ideators for India Post that:

• Connects Indian artisans with global customers
• Offers authentic traditional products
• Provides cultural discovery through AI
• Features an interactive 3D Culture Map
• Enables global shipping via India Post`,

            festivals: `Major Indian festivals include:

• Diwali - Festival of lights
• Holi - Spring festival of colors
• Durga Puja - Nine-day celebration
• Ganesh Chaturthi - Lord Ganesha's festival
• Navratri - Nine nights of celebration`,

            help: `I can help you with:

• Information about Indian festivals and traditions
• Details about traditional products and crafts
• Knowledge about regional customs
• Navigation of DeshKriti platform
• Cultural heritage information`,

            culture_map: `DeshKriti's 3D Culture Map is an interactive feature that:

• Provides immersive exploration of India's cultural diversity
• Showcases regional festivals, traditions, and customs
• Displays local arts, crafts, and traditional products
• Offers virtual tours of cultural landmarks
• Connects users with local artisans and their stories`,

            about_india: `India is a diverse nation characterized by:

• Rich cultural heritage spanning over 5000 years
• 28 states and 8 union territories, each with unique traditions
• Over 1600 languages with 22 official languages
• Various art forms, dance styles, and music traditions
• Diverse cuisines, festivals, and customs across regions`,

            products: `DeshKriti offers authentic Indian products including:

• Traditional Handicrafts - Regional artworks and sculptures
• Textiles - Handloom sarees, shawls, and fabrics
• Festival Items - Religious and ceremonial products
• Home Decor - Traditional art pieces and furnishings
• Wellness Products - Ayurvedic and natural items`,

            shipping: `DeshKriti's shipping through India Post ensures:

• Pan-India coverage through 155,000+ post offices
• International shipping to 190+ countries
• Secure packaging for delicate items
• Real-time tracking and delivery updates
• Customs clearance assistance for international orders`,

            community: `DeshKriti's community features include:

• Cultural Forums - Connect with art enthusiasts
• Artisan Stories - Learn about traditional crafts
• Virtual Events - Participate in cultural celebrations
• Knowledge Sharing - Learn about regional traditions
• Direct Communication - Chat with sellers and artists`,

            become_seller: `To become a seller on DeshKriti:

• Register as a verified seller
• Submit necessary documentation
• Complete KYC verification
• List authentic Indian products
• Maintain quality standards`,

            seller_requirements: `DeshKriti seller requirements:

• Valid business registration/artisan ID
• GST registration (if applicable)
• Bank account details
• Quality certification for products
• Proof of authentic traditional items`,

            seller_benefits: `DeshKriti helps local sellers by:

• Providing global market access
• Offering India Post shipping integration
• Marketing traditional products
• Handling digital payments
• Providing business analytics
• Offering seller training programs`
        };
    }

    processMessage = async (req, res) => {
        try {
            if (!req.body || !req.body.message) {
                return responseReturn(res, 400, { error: 'Message is required' });
            }

            let { message } = req.body;
            message = message.toLowerCase().trim();

            // Check for purchase/order intent
            const purchaseIntents = ['want to buy', 'want to order', 'order', 'place order', 'purchase', 'buy'];
            const hasOrderIntent = purchaseIntents.some(intent => message.includes(intent));

            if (hasOrderIntent) {
                // Extract product name by removing purchase intent phrases
                let productQuery = message;
                purchaseIntents.forEach(intent => {
                    productQuery = productQuery.replace(intent, '');
                });
                
                // Clean up the product query
                productQuery = productQuery
                    .replace(/i|please|can|you/gi, '')
                    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
                    .trim();

                // Common product name corrections with proper formatting
                const productCorrections = {
                    // Silk Sarees variations
                    'kanchpuram': 'Kanchipuram',
                    'kanjivaram': 'Kanchipuram',
                    'kanjeevaram': 'Kanchipuram',
                    'kanchipuram saree': 'Kanchipuram Silk Sarees',
                    'kanchipuram sarees': 'Kanchipuram Silk Sarees',
                    'silk saree': 'Silk Sarees',
                    'silk sarees': 'Silk Sarees',
                    
                    // Shawls variations
                    'pashmna': 'Pashmina',
                    'pashmeena': 'Pashmina',
                    'shwal': 'Shawl',
                    'shwals': 'Shawls',
                    
                    // Other products
                    'handloom': 'Handloom',
                    'handicraft': 'Handicrafts',
                    'traditional': 'Traditional',
                    'saree': 'Sarees'
                };

                // Apply corrections (case-insensitive)
                Object.entries(productCorrections).forEach(([incorrect, correct]) => {
                    const regex = new RegExp(incorrect, 'gi');
                    productQuery = productQuery.replace(regex, correct);
                });

                // Ensure proper formatting for specific product categories
                if (productQuery.toLowerCase().includes('kanchipuram') && 
                    productQuery.toLowerCase().includes('saree')) {
                    productQuery = 'Kanchipuram Silk Sarees';
                }

                return responseReturn(res, 200, { 
                    message: `I'll help you find ${productQuery}. Let me search for it in our product catalog.`,
                    action: 'search',
                    searchQuery: productQuery
                });
            }

            // Direct matches for DeshKriti queries first
            if ((message.includes('what') || message.includes('tell')) && 
                (message.includes('deshkriti') || message.includes('desh kriti'))) {
                return responseReturn(res, 200, { message: this.responses.deshkriti });
            }

            // Priority patterns for common queries
            const priorityPatterns = [
                {
                    keys: ['what', 'deshkriti'],
                    response: 'deshkriti'
                },
                {
                    keys: ['about', 'deshkriti'],
                    response: 'deshkriti'
                },
                {
                    keys: ['desh', 'kriti'],
                    response: 'deshkriti'
                },
                {
                    keys: ['india post', 'delivery'],
                    response: 'shipping'
                },
                {
                    keys: ['shipping', 'delivery'],
                    response: 'shipping'
                },
                {
                    keys: ['cultural', 'forum'],
                    response: 'community'
                },
                {
                    keys: ['become', 'seller'],
                    response: 'become_seller'
                },
                {
                    keys: ['bharat', 'post', 'gpt'],
                    response: 'bharat_post_gpt'
                }
            ];

            // Check priority patterns first
            for (const pattern of priorityPatterns) {
                if (pattern.keys.every(key => message.includes(key))) {
                    return responseReturn(res, 200, { message: this.responses[pattern.response] });
                }
            }

            // Keep existing patterns
            const patterns = {
                bharat_post_gpt: [
                    ['what', 'bharat', 'post', 'gpt'],
                    ['who', 'are', 'you'],
                    ['what', 'assistant']
                ],
                deshkriti: [
                    ['what', 'deshkriti'],
                    ['about', 'deshkriti'],
                    ['tell', 'deshkriti'],
                    ['what', 'platform']
                ],
                community: [
                    ['community', 'feature'],
                    ['cultural', 'forum'],
                    ['connect', 'artisan']
                ],
                culture_map: [
                    ['3d', 'map'],
                    ['culture', 'map'],
                    ['explore', 'culture']
                ],
                about_india: [
                    ['about', 'india'],
                    ['indian', 'culture'],
                    ['india', 'unique']
                ],
                products: [
                    ['what', 'product'],
                    ['can', 'buy'],
                    ['traditional', 'product']
                ],
                shipping: [
                    ['shipping', 'work'],
                    ['delivery'],
                    ['india', 'post']
                ],
                seller_requirements: [
                    ['seller', 'requirement'],
                    ['document', 'need'],
                    ['become', 'seller']
                ],
                seller_benefits: [
                    ['help', 'seller'],
                    ['seller', 'benefit'],
                    ['advantage', 'seller']
                ],
                festivals: [
                    ['festival'],
                    ['celebration'],
                    ['traditional', 'festival']
                ]
            };

            // Check existing patterns
            for (const [responseKey, patternGroup] of Object.entries(patterns)) {
                if (patternGroup.some(pattern => 
                    pattern.every(word => message.includes(word)))) {
                    return responseReturn(res, 200, { message: this.responses[responseKey] });
                }
            }

            // Context-based matching
            if (message.includes('deshkriti') || message.includes('desh kriti')) {
                return responseReturn(res, 200, { message: this.responses.deshkriti });
            }

            if (message.includes('india') && !message.includes('post')) {
                return responseReturn(res, 200, { message: this.responses.about_india });
            }

            // If no specific pattern matches, return the help message
            return responseReturn(res, 200, { message: this.responses.help });

        } catch (error) {
            console.error('AI Chat Error:', error);
            return responseReturn(res, 500, { 
                error: "I apologize, but I'm having trouble right now. Please try again." 
            });
        }
    }

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