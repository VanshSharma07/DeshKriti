const UserLocation = require('../../models/UserLocation');
const { responseReturn } = require('../../utiles/response');

class MapController {
    updateUserLocation = async (req, res) => {
        const { id } = req;
        const { country, continent, coordinates } = req.body;

        try {
            console.log('Updating location for user:', id);
            
            const location = await UserLocation.findOneAndUpdate(
                { userId: id },
                {
                    userId: id,
                    userType: 'customers',
                    location: {
                        country,
                        continent,
                        coordinates
                    },
                    lastActive: new Date()
                },
                { upsert: true, new: true }
            );

            console.log('Location updated:', location);
            responseReturn(res, 200, { success: true, location });
        } catch (error) {
            console.error('Error updating location:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    getFilteredLocations = async (req, res) => {
        try {
            console.log('Fetching all user locations...');
            const locations = await UserLocation.find()
                .populate('userId', 'firstName lastName image email phoneNumber country')
                .sort('-lastActive');
            
            const filteredLocations = locations
                .filter(loc => loc.userId != null)
                .map(loc => {
                    const coords = loc.location.coordinates;
                    console.log(`Location for ${loc.userId.firstName}:`, {
                        coordinates: coords,
                        country: loc.location.country
                    });
                    
                    return {
                        _id: loc._id,
                        userId: loc.userId,
                        location: {
                            continent: loc.location.continent,
                            country: loc.location.country,
                            coordinates: coords
                        },
                        lastActive: loc.lastActive
                    };
                });

            console.log(`Found ${filteredLocations.length} valid locations`);
            return responseReturn(res, 200, { 
                success: true, 
                locations: filteredLocations 
            });
        } catch (error) {
            console.error('Error in getFilteredLocations:', error);
            return responseReturn(res, 500, { error: error.message });
        }
    };
}

module.exports = new MapController();