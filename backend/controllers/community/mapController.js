const UserLocation = require('../../models/UserLocation');
const { responseReturn } = require('../../utiles/response');
const { Country, City } = require('country-state-city');
const capitalCoordinates = require('../../utiles/capitalCoordinates');

class MapController {
    updateUserLocation = async (req, res) => {
        const { id } = req;
        const { country } = req.body;

        try {
            // First, verify that the user exists
            const userExists = await require('../../models/customerModel').findById(id);
            if (!userExists) {
                console.log('User not found:', id);
                return responseReturn(res, 404, { error: 'User not found' });
            }

            console.log('Updating location for user:', id);
            console.log('Country:', country);

            // Get country code
            const countryCode = Country.getAllCountries()
                .find(c => c.name === country)?.isoCode;
            
            if (!countryCode) {
                console.log('Invalid country name:', country);
                return responseReturn(res, 400, { error: 'Invalid country name' });
            }

            // Get coordinates from predefined list first
            let coordinates = capitalCoordinates[countryCode];
            
            if (!coordinates) {
                console.log('No predefined coordinates, attempting to find capital city');
                // Fallback to capital city lookup
                const cities = City.getCitiesOfCountry(countryCode);
                const capitalCity = cities?.find(city => city.isCapital);
                
                if (capitalCity) {
                    coordinates = [
                        parseFloat(capitalCity.longitude),
                        parseFloat(capitalCity.latitude)
                    ];
                    console.log('Using capital city coordinates:', coordinates);
                } else {
                    console.log('No capital city found, using default coordinates');
                    coordinates = [0, 0];
                }
            } else {
                console.log('Using predefined coordinates:', coordinates);
            }

            // Get continent information
            const countryData = Country.getCountryByCode(countryCode);
            const continent = this.getContinentByRegion(countryData.region);
            console.log('Continent:', continent);

            // Update user location with validation
            const location = await UserLocation.findOneAndUpdate(
                { userId: id },
                {
                    userId: id,
                    userType: 'customer',
                    location: {
                        country,
                        continent,
                        coordinates
                    },
                    lastActive: new Date()
                },
                { 
                    upsert: true, 
                    new: true,
                    runValidators: true 
                }
            ).populate({
                path: 'userId',
                model: 'customer',
                select: 'firstName lastName profilePicture email phoneNumber country indianState'
            });

            if (!location.userId) {
                console.error('Location created but userId is null:', location);
                return responseReturn(res, 500, { error: 'Failed to link location to user' });
            }

            console.log('Location updated successfully:', location);
            responseReturn(res, 200, { success: true, location });

        } catch (error) {
            console.error('Error updating location:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    getFilteredLocations = async (req, res) => {
        try {
            console.log('Getting filtered locations');
            const { continent, country } = req.query;
            let query = { userId: { $ne: null } }; // Only get locations with valid userIds

            if (continent) {
                query['location.continent'] = continent;
            }
            if (country) {
                query['location.country'] = country;
            }

            console.log('Query:', query);

            const locations = await UserLocation.find(query)
                .populate({
                    path: 'userId',
                    model: 'customer',
                    select: 'firstName lastName profilePicture email phoneNumber country indianState'
                })
                .lean()
                .exec();

            console.log(`Found ${locations.length} locations`);

            const filteredLocations = locations
                .filter(loc => {
                    const isValid = loc.userId && loc.location?.coordinates;
                    if (!isValid) {
                        console.log('Invalid location data:', loc);
                    }
                    return isValid;
                })
                .map(loc => ({
                    _id: loc._id,
                    userId: {
                        _id: loc.userId._id,
                        firstName: loc.userId.firstName,
                        lastName: loc.userId.lastName,
                        image: loc.userId.profilePicture?.url || null,
                        email: loc.userId.email,
                        phoneNumber: loc.userId.phoneNumber,
                        country: loc.userId.country
                    },
                    location: {
                        continent: loc.location.continent,
                        country: loc.location.country,
                        coordinates: loc.location.coordinates
                    },
                    lastActive: loc.lastActive
                }));

            console.log(`Returning ${filteredLocations.length} filtered locations`);
            return responseReturn(res, 200, { 
                success: true, 
                locations: filteredLocations 
            });

        } catch (error) {
            console.error('Error in getFilteredLocations:', error);
            return responseReturn(res, 500, { 
                error: 'Failed to fetch locations',
                details: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    };

    getContinentByRegion(region) {
        const regionToContinentMap = {
            'Europe': 'Europe',
            'Asia': 'Asia',
            'Americas': 'North America',
            'Africa': 'Africa',
            'Oceania': 'Oceania'
        };
        return regionToContinentMap[region] || 'Unknown';
    }
}

module.exports = new MapController();