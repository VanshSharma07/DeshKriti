const Customer = require('../models/customerModel');
const { responseReturn } = require('../utiles/response');

class UserController {
    // Get current user
    getCurrentUser = async (req, res) => {
        try {
            const user = await Customer.findById(req.id).select('-password');
            if (!user) {
                return responseReturn(res, 404, { error: 'User not found' });
            }
            responseReturn(res, 200, user);
        } catch (error) {
            console.error('Get current user error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Get user by ID
    getUser = async (req, res) => {
        const { userId } = req.params;
        
        try {
            const user = await Customer.findById(userId || req.id)
                .select('-password')
                .lean();

            if (!user) {
                return responseReturn(res, 404, { error: 'User not found' });
            }

            responseReturn(res, 200, { 
                user: {
                    ...user,
                    id: user._id
                }
            });
        } catch (error) {
            console.error('Get user error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Update user profile
    updateProfile = async (req, res) => {
        try {
            const userId = req.id;
            const updateData = req.body;

            if (!updateData.firstName) {
                return responseReturn(res, 400, { error: 'First name is required' });
            }

            const updatedUser = await Customer.findByIdAndUpdate(
                userId,
                {
                    firstName: updateData.firstName,
                    lastName: updateData.lastName,
                    country: updateData.country,
                    phoneNumber: updateData.phoneNumber,
                },
                { new: true }
            ).select('-password').lean();

            if (!updatedUser) {
                return responseReturn(res, 404, { error: 'User not found' });
            }

            responseReturn(res, 200, { 
                user: {
                    ...updatedUser,
                    id: updatedUser._id
                }
            });
        } catch (error) {
            console.error('Update profile error:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };
}

module.exports = new UserController();