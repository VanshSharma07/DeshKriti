const mongoose = require('mongoose');
const UserLocation = require('../models/UserLocation');
const customerModel = require('../models/customerModel');
require('dotenv').config();

async function cleanupLocations() {
    try {
        // Connect to MongoDB
        console.log('Connecting to database...');
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to database');

        // 1. Remove locations with null userId
        console.log('\nRemoving locations with null userId...');
        const deleteResult = await UserLocation.deleteMany({ userId: null });
        console.log(`Deleted ${deleteResult.deletedCount} locations with null userId`);

        // 2. Find locations with invalid user references
        console.log('\nChecking for locations with invalid user references...');
        const allLocations = await UserLocation.find({});
        let invalidCount = 0;

        for (const location of allLocations) {
            const userExists = await customerModel.findById(location.userId);
            if (!userExists) {
                console.log(`Found invalid location for userId: ${location.userId}`);
                await UserLocation.deleteOne({ _id: location._id });
                invalidCount++;
            }
        }
        console.log(`Removed ${invalidCount} locations with invalid user references`);

        // 3. Update userType if needed
        console.log('\nUpdating incorrect userTypes...');
        const userTypeUpdate = await UserLocation.updateMany(
            { userType: 'customers' },
            { $set: { userType: 'customer' } }
        );
        console.log(`Updated ${userTypeUpdate.modifiedCount} locations with incorrect userType`);

        // 4. Verify remaining locations
        const remainingLocations = await UserLocation.find({})
            .populate('userId', 'firstName lastName email');
        
        console.log('\nRemaining valid locations:');
        remainingLocations.forEach(loc => {
            console.log(`- Location ID: ${loc._id}`);
            console.log(`  User: ${loc.userId?.firstName} ${loc.userId?.lastName}`);
            console.log(`  Country: ${loc.location.country}`);
            console.log(`  Coordinates: ${loc.location.coordinates}`);
            console.log('---');
        });

        console.log(`\nCleanup complete. ${remainingLocations.length} valid locations remain.`);

    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('\nDatabase connection closed');
    }
}

// Run the cleanup
cleanupLocations(); 