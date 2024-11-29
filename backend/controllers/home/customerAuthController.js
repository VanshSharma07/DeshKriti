const sellerCustomerModel = require("../../models/chat/sellerCustomerModel")
const customerModel = require("../../models/customerModel")
const { responseReturn } = require("../../utiles/response")
const bcrypt = require('bcrypt')
const { createToken } = require('../../utiles/tokenCreate')
const UserLocation = require("../../models/UserLocation")
const { Country } = require('country-state-city');

const countryCoordinates = {
    // Europe
    'GB': [-0.1276, 51.5074],    // London, UK
    'RO': [26.1025, 44.4268],    // Bucharest, Romania
    'DE': [13.4050, 52.5200],    // Berlin, Germany
    'FR': [2.3522, 48.8566],     // Paris, France
    'IT': [12.4964, 41.9028],    // Rome, Italy
    'ES': [-3.7038, 40.4168],    // Madrid, Spain
    'PT': [-9.1393, 38.7223],    // Lisbon, Portugal
    'NL': [4.9041, 52.3676],     // Amsterdam, Netherlands
    'BE': [4.3517, 50.8503],     // Brussels, Belgium
    'CH': [7.4474, 46.9480],     // Bern, Switzerland
    'AT': [16.3738, 48.2082],    // Vienna, Austria
    'SE': [18.0686, 59.3293],    // Stockholm, Sweden
    'NO': [10.7522, 59.9139],    // Oslo, Norway
    'DK': [12.5683, 55.6761],    // Copenhagen, Denmark
    'FI': [24.9384, 60.1699],    // Helsinki, Finland
    'PL': [21.0122, 52.2297],    // Warsaw, Poland
    'CZ': [14.4378, 50.0755],    // Prague, Czech Republic
    'GR': [23.7275, 37.9838],    // Athens, Greece
    'HU': [19.0402, 47.4979],    // Budapest, Hungary
    'IE': [-6.2603, 53.3498],    // Dublin, Ireland

    // Asia
    'JP': [139.6917, 35.6895],   // Tokyo, Japan
    'CN': [116.4074, 39.9042],   // Beijing, China
    'IN': [77.2090, 28.6139],    // New Delhi, India
    'KR': [126.9780, 37.5665],   // Seoul, South Korea
    'SG': [103.8198, 1.3521],    // Singapore
    'MY': [101.6869, 3.1390],    // Kuala Lumpur, Malaysia
    'TH': [100.5018, 13.7563],   // Bangkok, Thailand
    'VN': [105.8342, 21.0285],   // Hanoi, Vietnam
    'ID': [106.8456, -6.2088],   // Jakarta, Indonesia
    'PH': [120.9842, 14.5995],   // Manila, Philippines

    // North America
    'US': [-77.0369, 38.9072],   // Washington DC, USA
    'CA': [-75.6972, 45.4215],   // Ottawa, Canada
    'MX': [-99.1332, 19.4326],   // Mexico City, Mexico

    // South America
    'BR': [-47.8645, -15.7942],  // Brasilia, Brazil
    'AR': [-58.3816, -34.6037],  // Buenos Aires, Argentina
    'CL': [-70.6483, -33.4489],  // Santiago, Chile
    'CO': [-74.0721, 4.7110],    // Bogota, Colombia
    'PE': [-77.0428, -12.0464],  // Lima, Peru

    // Africa
    'ZA': [28.0473, -26.2041],   // Johannesburg, South Africa
    'EG': [31.2357, 30.0444],    // Cairo, Egypt
    'NG': [3.3792, 6.5244],      // Lagos, Nigeria
    'KE': [36.8219, -1.2921],    // Nairobi, Kenya
    'MA': [-6.8498, 33.9716],    // Rabat, Morocco

    // Oceania
    'AU': [151.2093, -33.8688],  // Sydney, Australia
    'NZ': [174.7633, -36.8485],  // Auckland, New Zealand

    // Middle East
    'AE': [55.2708, 25.2048],    // Dubai, UAE
    'SA': [46.7219, 24.6877],    // Riyadh, Saudi Arabia
    'IL': [35.2137, 31.7683],    // Jerusalem, Israel
    'TR': [32.8597, 39.9334],    // Ankara, Turkey

    // Default coordinates (0°N 0°E - Gulf of Guinea)
    'DEFAULT': [0, 0]
};

class customerAuthController{

    
    customer_register = async(req, res) => {
        const {
            firstName,
            lastName,
            email,
            password,
            country,
            phoneNumber
        } = req.body;

        try {
            // Get country details from the code
            const countryData = Country.getCountryByCode(country);
            if (!countryData) {
                return responseReturn(res, 400, { error: 'Invalid country code' });
            }

            // Create customer
            const createCustomer = await customerModel.create({
                firstName: firstName.trim(),
                lastName: lastName ? lastName.trim() : '',
                email: email.trim(),
                password: await bcrypt.hash(password, 10),
                country: countryData.name,
                phoneNumber,
                method: 'manually'
            });

            // Get proper coordinates for the country
            const coordinates = countryCoordinates[country] || countryCoordinates['DEFAULT'];

            console.log('Creating user location with:', {
                userId: createCustomer._id,
                country: countryData.name,
                coordinates,
                continent: this.getContinentByCountry(countryData.isoCode)
            });

            // Create user location
            await UserLocation.create({
                userId: createCustomer._id,
                userType: 'customers',
                location: {
                    continent: this.getContinentByCountry(countryData.isoCode),
                    country: countryData.name,
                    coordinates
                },
                lastActive: new Date()
            });

            await sellerCustomerModel.create({
                myId: createCustomer.id
            });

            responseReturn(res, 201, { message: 'Registration successful' });
        } catch (error) {
            console.error('Registration error:', error);
            responseReturn(res, 500, { error: 'Internal Server Error' });
        }
    }
    // End Method 


    customer_login = async(req,res) => {
        const { email, password } = req.body;
        try {
            const customer = await customerModel.findOne({email}).select('+password');
            if (customer) {
                const match = await bcrypt.compare(password, customer.password);
                if (match) {
                    const token = await createToken({
                        id: customer.id,
                        firstName: customer.firstName,
                        lastName: customer.lastName,
                        email: customer.email,
                        country: customer.country,
                        phoneNumber: customer.phoneNumber,
                        method: customer.method
                    });
                    res.cookie('customerToken', token, {
                        expires: new Date(Date.now() + 7*24*60*60*1000)
                    });
                    responseReturn(res, 201, { message: 'User Login Success', token });
                } else {
                    responseReturn(res, 404, { error: 'Password Wrong' });
                }
            } else {
                responseReturn(res, 404, { error: 'Email Not Found' });
            }
        } catch (error) {
            console.log(error.message);
            responseReturn(res, 500, { error: 'Internal Server Error' });
        }
    }
    // End Method


    customer_logout = async(req, res) => {
        res.cookie('customerToken',"",{
            expires : new Date(Date.now())
        })
        responseReturn(res, 200,{ message :  'Logout Success'})
      }
        // End Method

    // Helper function to determine continent based on country
    getContinentByCountry(countryCode) {
        // Mapping of regions to continents
        const regionToContinentMap = {
            'Europe': 'Europe',
            'Asia': 'Asia',
            'Americas': 'North America',
            'Africa': 'Africa',
            'Oceania': 'Oceania'
        };

        const country = Country.getCountryByCode(countryCode);
        if (!country) return 'Unknown';

        // Get region from country data and map to continent
        const region = country.region;
        return regionToContinentMap[region] || 'Unknown';
    }

}






module.exports = new customerAuthController()