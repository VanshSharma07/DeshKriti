const Customer = require('../../models/customerModel');
const { responseReturn } = require('../../utiles/response');

class UserController {
    getUser = async (req, res) => {
        try {
            const { userId } = req.params;
            const targetUserId = userId || req.id;
            
            console.log('Fetching user profile for ID:', targetUserId);

            const user = await Customer.findById(targetUserId)
                .select('firstName lastName email image location country occupation')
                .lean();

            if (!user) {
                console.log('User not found:', targetUserId);
                return responseReturn(res, 404, { error: 'User not found' });
            }

            console.log('Found user:', user);
            responseReturn(res, 200, { user });
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