const Customer = require('../../models/customerModel');
const { responseReturn } = require('../../utiles/response');

class UserController {
    getUser = async (req, res) => {
        try {
            const { userId } = req.params;
            const targetUserId = userId || req.id;
            
            console.log('Fetching user profile for ID:', targetUserId);

            const userData = await Customer.findById(targetUserId)
                .select('-password')
                .lean();

            if (!userData) {
                return responseReturn(res, 404, { error: 'User not found' });
            }

            console.log("API - User Data Being Sent:", {
                id: userData._id,
                imageData: userData.profilePicture || userData.image,
                hasProfilePicture: !!userData.profilePicture,
                hasImage: !!userData.image,
                fullData: userData
            });

            // Format user data before sending
            const formattedUser = {
                _id: userData._id,
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                profilePicture: userData.profilePicture,
                phoneNumber: userData.phoneNumber,
                country: userData.country,
                indianState: userData.indianState,
                location: userData.location
            };

            responseReturn(res, 200, { user: formattedUser });
        } catch (error) {
            console.error('Get user error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    getCurrentUser = async (req, res) => {
        try {
            const user = await Customer.findById(req.id)
                .select('firstName lastName email image location')
                .lean();

            if (!user) {
                return responseReturn(res, 404, { error: 'User not found' });
            }

            const formattedUser = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                image: user.image,
                location: user.location
            };

            responseReturn(res, 200, { user: formattedUser });
        } catch (error) {
            console.error('Get current user error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };
}

module.exports = new UserController(); 