const mongoose = require('mongoose');
const StateGroup = require('../models/community/StateGroup');
require('dotenv').config();

const indianStates = [
    {
        stateName: "Jammu and Kashmir",
        description: "Connect with people from the paradise on Earth, known for its stunning landscapes and rich culture."
    },
    {
        stateName: "Andhra Pradesh",
        description: "Connect with the Telugu diaspora and share experiences from the land of Kuchipudi and Telugu culture."
    },
    {
        stateName: "Arunachal Pradesh",
        description: "Join the community of people from the Land of the Dawn-Lit Mountains."
    },
    {
        stateName: "Assam",
        description: "Connect with fellow Assamese and share stories from the land of tea gardens and one-horned rhinos."
    },
    {
        stateName: "Bihar",
        description: "Join the community celebrating the rich heritage of ancient India and modern Bihar."
    },
    {
        stateName: "Chhattisgarh",
        description: "Connect with people from the heart of India, sharing tribal culture and modern development."
    },
    {
        stateName: "Goa",
        description: "Join fellow Goans in celebrating the vibrant culture of sun, sand, and Portuguese heritage."
    },
    {
        stateName: "Gujarat",
        description: "Connect with the global Gujarati community and share business success stories."
    },
    {
        stateName: "Haryana",
        description: "Join the community of sports enthusiasts and agricultural innovators."
    },
    {
        stateName: "Himachal Pradesh",
        description: "Connect with people from the land of snow-capped mountains and ancient temples."
    },
    {
        stateName: "Jharkhand",
        description: "Join the community celebrating tribal culture and industrial progress."
    },
    {
        stateName: "Karnataka",
        description: "Connect with tech professionals and culture enthusiasts from the Silicon Valley of India."
    },
    {
        stateName: "Kerala",
        description: "Join the global Malayali community and share stories from God's Own Country."
    },
    {
        stateName: "Madhya Pradesh",
        description: "Connect with people from the heart of incredible India."
    },
    {
        stateName: "Maharashtra",
        description: "Join the vibrant community from the land of Marathas and modern commerce."
    },
    {
        stateName: "Manipur",
        description: "Connect with people from the jewel of India's northeast."
    },
    {
        stateName: "Meghalaya",
        description: "Join the community from the abode of clouds."
    },
    {
        stateName: "Mizoram",
        description: "Connect with people from the land of rolling hills and valleys."
    },
    {
        stateName: "Nagaland",
        description: "Join the community celebrating the festival state of India."
    },
    {
        stateName: "Odisha",
        description: "Connect with people from the land of ancient temples and modern aspirations."
    },
    {
        stateName: "Punjab",
        description: "Join the global Punjabi community known for its vibrant culture and enterprise."
    },
    {
        stateName: "Rajasthan",
        description: "Connect with people from the land of maharajas and desert culture."
    },
    {
        stateName: "Sikkim",
        description: "Join the community from the peaceful Buddhist state of India."
    },
    {
        stateName: "Tamil Nadu",
        description: "Connect with the global Tamil community and celebrate Dravidian culture."
    },
    {
        stateName: "Telangana",
        description: "Join the community from India's newest state, blending tradition with technology."
    },
    {
        stateName: "Tripura",
        description: "Connect with people from the cultural hub of northeast India."
    },
    {
        stateName: "Uttar Pradesh",
        description: "Join the community from India's most populous and culturally rich state."
    },
    {
        stateName: "Uttarakhand",
        description: "Connect with people from the land of gods and Himalayas."
    },
    {
        stateName: "West Bengal",
        description: "Join the global Bengali community celebrating art, culture, and intellect."
    },
];

const seedStateGroups = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing groups
        await StateGroup.deleteMany({});
        console.log('Cleared existing state groups');
        
        // Insert new groups
        await StateGroup.insertMany(indianStates);
        console.log('Successfully seeded state groups!');

        // Close the connection
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding state groups:', error);
        // Ensure connection is closed even if there's an error
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            console.log('Disconnected from MongoDB after error');
        }
        process.exit(1);
    }
};

// If running this script directly
if (require.main === module) {
    seedStateGroups()
        .then(() => process.exit(0))
        .catch(error => {
            console.error('Seeding failed:', error);
            process.exit(1);
        });
}

module.exports = seedStateGroups;
