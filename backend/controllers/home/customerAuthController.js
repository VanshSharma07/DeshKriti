const sellerCustomerModel = require("../../models/chat/sellerCustomerModel")
const customerModel = require("../../models/customerModel")
const { responseReturn } = require("../../utiles/response")
const bcrypt = require('bcrypt')
const { createToken } = require('../../utiles/tokenCreate')
const UserLocation = require("../../models/UserLocation")
const { Country } = require('country-state-city');
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;

const countryCoordinates = {
    // Europe
    'AD': [1.5218, 42.5075],     // Andorra la Vella, Andorra
    'AL': [19.8187, 41.3275],    // Tirana, Albania
    'AT': [16.3738, 48.2082],    // Vienna, Austria
    'BA': [18.3564, 43.8563],    // Sarajevo, Bosnia and Herzegovina
    'BE': [4.3517, 50.8503],     // Brussels, Belgium
    'BG': [23.3219, 42.6977],    // Sofia, Bulgaria
    'BY': [27.5534, 53.9045],    // Minsk, Belarus
    'CH': [7.4474, 46.9480],     // Bern, Switzerland
    'CY': [33.3823, 35.1856],    // Nicosia, Cyprus
    'CZ': [14.4378, 50.0755],    // Prague, Czech Republic
    'DE': [13.4050, 52.5200],    // Berlin, Germany
    'DK': [12.5683, 55.6761],    // Copenhagen, Denmark
    'EE': [24.7536, 59.4369],    // Tallinn, Estonia
    'ES': [-3.7038, 40.4168],    // Madrid, Spain
    'FI': [24.9384, 60.1699],    // Helsinki, Finland
    'FR': [2.3522, 48.8566],     // Paris, France
    'GB': [-0.1276, 51.5074],    // London, United Kingdom
    'GR': [23.7275, 37.9838],    // Athens, Greece
    'HR': [15.9819, 45.8150],    // Zagreb, Croatia
    'HU': [19.0402, 47.4979],    // Budapest, Hungary
    'IE': [-6.2603, 53.3498],    // Dublin, Ireland
    'IS': [-21.8954, 64.1265],   // Reykjavik, Iceland
    'IT': [12.4964, 41.9028],    // Rome, Italy
    'LI': [9.5209, 47.1410],     // Vaduz, Liechtenstein
    'LT': [25.2797, 54.6872],    // Vilnius, Lithuania
    'LU': [6.1296, 49.6116],     // Luxembourg City, Luxembourg
    'LV': [24.1052, 56.9496],    // Riga, Latvia
    'MC': [7.4246, 43.7384],     // Monaco
    'MD': [28.8577, 47.0105],    // Chisinau, Moldova
    'ME': [19.2594, 42.4304],    // Podgorica, Montenegro
    'MK': [21.4314, 42.0024],    // Skopje, North Macedonia
    'MT': [14.5145, 35.8989],    // Valletta, Malta
    'NL': [4.9041, 52.3676],     // Amsterdam, Netherlands
    'NO': [10.7522, 59.9139],    // Oslo, Norway
    'PL': [21.0122, 52.2297],    // Warsaw, Poland
    'PT': [-9.1393, 38.7223],    // Lisbon, Portugal
    'RO': [26.1025, 44.4268],    // Bucharest, Romania
    'RS': [20.4489, 44.7866],    // Belgrade, Serbia
    'RU': [37.6173, 55.7558],    // Moscow, Russia
    'SE': [18.0686, 59.3293],    // Stockholm, Sweden
    'SI': [14.5058, 46.0569],    // Ljubljana, Slovenia
    'SK': [17.1077, 48.1486],    // Bratislava, Slovakia
    'SM': [12.4464, 43.9424],    // San Marino
    'UA': [30.5234, 50.4501],    // Kiev, Ukraine
    'VA': [12.4534, 41.9029],    // Vatican City

    // North America
    'CA': [-75.6972, 45.4215],   // Ottawa, Canada
    'US': [-77.0369, 38.9072],   // Washington DC, USA
    'MX': [-99.1332, 19.4326],   // Mexico City, Mexico
    'CR': [-84.0877, 9.9281],    // San José, Costa Rica
    'CU': [-82.3666, 23.1136],   // Havana, Cuba
    'DO': [-69.9312, 18.4861],   // Santo Domingo, Dominican Republic
    'GT': [-90.5133, 14.6349],   // Guatemala City, Guatemala
    'HN': [-87.2068, 14.0723],   // Tegucigalpa, Honduras
    'HT': [-72.3288, 18.5944],   // Port-au-Prince, Haiti
    'JM': [-76.7936, 18.0179],   // Kingston, Jamaica
    'NI': [-86.2504, 12.1149],   // Managua, Nicaragua
    'PA': [-79.5342, 8.9824],    // Panama City, Panama
    'SV': [-89.2182, 13.6929],   // San Salvador, El Salvador

    // South America
    'AR': [-58.3816, -34.6037],  // Buenos Aires, Argentina
    'BO': [-68.1193, -16.4897],  // La Paz, Bolivia
    'BR': [-47.8645, -15.7942],  // Brasília, Brazil
    'CL': [-70.6483, -33.4489],  // Santiago, Chile
    'CO': [-74.0721, 4.7110],    // Bogotá, Colombia
    'EC': [-78.4678, -0.1807],   // Quito, Ecuador
    'GY': [-58.1553, 6.8013],    // Georgetown, Guyana
    'PE': [-77.0428, -12.0464],  // Lima, Peru
    'PY': [-57.3333, -25.2867],  // Asunción, Paraguay
    'SR': [-55.2038, 5.8520],    // Paramaribo, Suriname
    'UY': [-56.1645, -34.9011],  // Montevideo, Uruguay
    'VE': [-66.9036, 10.4806],   // Caracas, Venezuela

    // Asia
    'AE': [54.3773, 24.4539],    // Abu Dhabi, UAE
    'AF': [69.1761, 34.5553],    // Kabul, Afghanistan
    'AM': [44.5133, 40.1777],    // Yerevan, Armenia
    'AZ': [49.8671, 40.4093],    // Baku, Azerbaijan
    'BD': [90.4125, 23.8103],    // Dhaka, Bangladesh
    'BH': [50.5854, 26.2285],    // Manama, Bahrain
    'BN': [114.9424, 4.9031],    // Bandar Seri Begawan, Brunei
    'BT': [89.6339, 27.4728],    // Thimphu, Bhutan
    'CN': [116.4074, 39.9042],   // Beijing, China
    'GE': [44.7833, 41.7151],    // Tbilisi, Georgia
    'ID': [106.8456, -6.2088],   // Jakarta, Indonesia
    'IL': [35.2137, 31.7683],    // Jerusalem, Israel
    'IN': [77.2090, 28.6139],    // New Delhi, India
    'IQ': [44.3661, 33.3152],    // Baghdad, Iraq
    'IR': [51.3890, 35.6892],    // Tehran, Iran
    'JO': [35.9106, 31.9539],    // Amman, Jordan
    'JP': [139.6917, 35.6895],   // Tokyo, Japan
    'KG': [74.5698, 42.8746],    // Bishkek, Kyrgyzstan
    'KH': [104.9210, 11.5564],   // Phnom Penh, Cambodia
    'KP': [125.7625, 39.0392],   // Pyongyang, North Korea
    'KR': [126.9780, 37.5665],   // Seoul, South Korea
    'KW': [47.9783, 29.3759],    // Kuwait City, Kuwait
    'KZ': [71.4704, 51.1605],    // Nur-Sultan, Kazakhstan
    'LA': [102.6331, 17.9757],   // Vientiane, Laos
    'LB': [35.5018, 33.8938],    // Beirut, Lebanon
    'LK': [79.8528, 6.9271],     // Colombo, Sri Lanka
    'MM': [96.1951, 16.8661],    // Yangon, Myanmar
    'MN': [106.9057, 47.8864],   // Ulaanbaatar, Mongolia
    'MV': [73.5093, 4.1755],     // Male, Maldives
    'MY': [101.6869, 3.1390],    // Kuala Lumpur, Malaysia
    'NP': [85.3240, 27.7172],    // Kathmandu, Nepal
    'OM': [58.5922, 23.6105],    // Muscat, Oman
    'PH': [120.9842, 14.5995],   // Manila, Philippines
    'PK': [73.0479, 33.6844],    // Islamabad, Pakistan
    'PS': [35.2332, 31.9522],    // Palestine
    'QA': [51.5310, 25.2854],    // Doha, Qatar
    'SA': [46.7219, 24.6877],    // Riyadh, Saudi Arabia
    'SG': [103.8198, 1.3521],    // Singapore
    'SY': [36.2919, 33.5138],    // Damascus, Syria
    'TH': [100.5018, 13.7563],   // Bangkok, Thailand
    'TJ': [68.7870, 38.5598],    // Dushanbe, Tajikistan
    'TL': [125.5739, -8.5586],   // Dili, Timor-Leste
    'TM': [58.3833, 37.9500],    // Ashgabat, Turkmenistan
    'TR': [32.8597, 39.9334],    // Ankara, Turkey
    'TW': [121.5654, 25.0330],   // Taipei, Taiwan
    'UZ': [69.2401, 41.2995],    // Tashkent, Uzbekistan
    'VN': [105.8342, 21.0285],   // Hanoi, Vietnam
    'YE': [44.2067, 15.3694],    // Sana'a, Yemen

    // Africa
    'AO': [13.2343, -8.8147],    // Luanda, Angola
    'BF': [-1.5197, 12.3714],    // Ouagadougou, Burkina Faso
    'BI': [29.3639, -3.3822],    // Bujumbura, Burundi
    'BJ': [2.3158, 6.3703],      // Porto-Novo, Benin
    'BW': [25.9201, -24.6282],   // Gaborone, Botswana
    'CD': [15.2663, -4.4419],    // Kinshasa, DR Congo
    'CF': [18.5555, 4.3947],     // Bangui, Central African Republic
    'CG': [15.2832, -4.2634],    // Brazzaville, Republic of Congo
    'CI': [-4.0305, 5.3600],     // Yamoussoukro, Ivory Coast
    'CM': [11.5021, 3.8480],     // Yaoundé, Cameroon
    'CV': [-23.5087, 14.9177],   // Praia, Cape Verde
    'DJ': [43.1456, 11.5806],    // Djibouti City, Djibouti
    'DZ': [3.0588, 36.7538],     // Algiers, Algeria
    'EG': [31.2357, 30.0444],    // Cairo, Egypt
    'ER': [38.9183, 15.3229],    // Asmara, Eritrea
    'ET': [38.7578, 9.0084],     // Addis Ababa, Ethiopia
    'GA': [9.4496, 0.3858],      // Libreville, Gabon
    'GH': [-0.1870, 5.6037],     // Accra, Ghana
    'GM': [-16.5885, 13.4549],   // Banjul, Gambia
    'GN': [-13.7120, 9.5370],    // Conakry, Guinea
    'GQ': [8.7831, 3.7523],      // Malabo, Equatorial Guinea
    'GW': [-15.1804, 11.8816],   // Bissau, Guinea-Bissau
    'KE': [36.8219, -1.2921],    // Nairobi, Kenya
    'KM': [43.2333, -11.7042],   // Moroni, Comoros
    'LR': [-10.7957, 6.3004],    // Monrovia, Liberia
    'LS': [27.4833, -29.3167],   // Maseru, Lesotho
    'LY': [13.1875, 32.8872],    // Tripoli, Libya
    'MA': [-6.8498, 33.9716],    // Rabat, Morocco
    'MG': [47.5079, -18.8792],   // Antananarivo, Madagascar
    'ML': [-8.0029, 12.6392],    // Bamako, Mali
    'MR': [-15.9785, 18.0735],   // Nouakchott, Mauritania
    'MU': [57.4989, -20.1609],   // Port Louis, Mauritius
    'MW': [33.7703, -13.9626],   // Lilongwe, Malawi
    'MZ': [32.5732, -25.9692],   // Maputo, Mozambique
    'NA': [17.0658, -22.5609],   // Windhoek, Namibia
    'NE': [2.1098, 13.5137],     // Niamey, Niger
    'NG': [7.4898, 9.0765],      // Abuja, Nigeria
    'RW': [30.0587, -1.9403],    // Kigali, Rwanda
    'SC': [55.4466, -4.6191],    // Victoria, Seychelles
    'SD': [32.5599, 15.5007],    // Khartoum, Sudan
    'SL': [-13.2317, 8.4847],    // Freetown, Sierra Leone
    'SN': [-17.4440, 14.7167],   // Dakar, Senegal
    'SO': [45.3182, 2.0469],     // Mogadishu, Somalia
    'SS': [31.5825, 4.8594],     // Juba, South Sudan
    'ST': [6.7273, 0.3365],      // São Tomé, São Tomé and Príncipe
    'SZ': [31.1367, -26.3054],   // Mbabane, Eswatini
    'TD': [15.0444, 12.1348],    // N'Djamena, Chad
    'TG': [1.2255, 6.1375],      // Lomé, Togo
    'TN': [10.1815, 36.8065],    // Tunis, Tunisia
    'TZ': [39.2083, -6.7924],    // Dodoma, Tanzania
    'UG': [32.5899, 0.3476],     // Kampala, Uganda
    'ZA': [28.0473, -26.2041],   // Pretoria, South Africa
    'ZM': [28.2826, -15.4067],   // Lusaka, Zambia
    'ZW': [31.0534, -17.8277],   // Harare, Zimbabwe

    // Oceania
    'AU': [149.1300, -35.2809],  // Canberra, Australia
    'FJ': [178.4419, -18.1416],  // Suva, Fiji
    'KI': [169.5339, 1.3290],    // Tarawa, Kiribati
    'MH': [171.3842, 7.1164],    // Majuro, Marshall Islands
    'FM': [158.1590, 6.9248],    // Palikir, Micronesia
    'NR': [166.9208, -0.5477],   // Yaren, Nauru
    'NZ': [174.7762, -41.2866],  // Wellington, New Zealand
    'PG': [147.1803, -9.4438],   // Port Moresby, Papua New Guinea
    'PW': [134.6238, 7.5000],    // Ngerulmud, Palau
    'SB': [159.9498, -9.4438],   // Honiara, Solomon Islands
    'TO': [-175.2026, -21.1393], // Nuku'alofa, Tonga
    'TV': [179.1962, -8.5199],   // Funafuti, Tuvalu
    'VU': [168.3273, -17.7334],  // Port Vila, Vanuatu
    'WS': [-171.7513, -13.8506],  // Apia, Samoa

    // Default coordinates (0°N 0°E - Gulf of Guinea)
    'DEFAULT': [0, 0]
};

class customerAuthController{

    
    customer_register = async(req, res) => {
        const form = formidable();
        
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return responseReturn(res, 500, { error: 'Form parsing failed' });
            }

            const { firstName, lastName, email, password, phoneNumber, country, indianState } = fields;

            try {
                const checkUser = await customerModel.findOne({ email });
                if (checkUser) {
                    return responseReturn(res, 404, { error: 'Email already exists' });
                }

                // Handle profile picture upload
                let profilePicture = {};
                if (files.image) {
                    const result = await cloudinary.uploader.upload(files.image.filepath, {
                        folder: 'deshKriti/customers'
                    });
                    profilePicture = {
                        url: result.secure_url,
                        public_id: result.public_id
                    };
                }

                // Hash password
                const hashPassword = await bcrypt.hash(password, 10);

                // Create new customer
                const createCustomer = await customerModel.create({
                    firstName,
                    lastName,
                    email,
                    password: hashPassword,
                    phoneNumber,
                    country,
                    indianState,
                    profilePicture
                });

                // Get country data
                const countryData = Country.getCountryByCode(country);
                if (!countryData) {
                    return responseReturn(res, 400, { error: 'Invalid country code' });
                }

                // Get proper coordinates for the country
                const coordinates = countryCoordinates[country] || countryCoordinates['DEFAULT'];

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
                    myId: createCustomer._id
                });

                responseReturn(res, 201, { message: 'Registration successful', customer: createCustomer });
            } catch (error) {
                console.error('Registration error:', error);
                responseReturn(res, 500, { error: 'Internal Server Error' });
            }
        });
    }



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