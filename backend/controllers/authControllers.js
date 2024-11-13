const adminModel = require('../models/adminModel');
const sellerModel = require('../models/sellerModel');
const sellerCustomerModel = require('../models/chat/sellerCustomerModel');
const { responseReturn } = require('../utiles/response');
const bcrypt = require('bcrypt');
const { createToken } = require('../utiles/tokenCreate');
const formidable = require("formidable");
const cloudinary = require('cloudinary').v2;

class authControllers {
    // Admin registration method
    admin_register = async (req, res) => {
        const { email, name, password } = req.body;
        try {
            // Check if admin with the same email already exists
            const existingAdmin = await adminModel.findOne({ email });
            if (existingAdmin) {
                responseReturn(res, 400, { error: 'Email already exists' });
                return;
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create the new admin
            const admin = await adminModel.create({
                name,
                email,
                password: hashedPassword,
                role: 'admin'
            });

            // Generate a token for the new admin
            const token = await createToken({ id: admin.id, role: admin.role });
            res.cookie('accessToken', token, {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                httpOnly: true
            });

            // Send success response
            responseReturn(res, 201, { token, message: 'Admin registration successful' });
        } catch (error) {
            responseReturn(res, 500, { error: 'Internal Server Error' });
        }
    };

    // Existing methods...
    admin_login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const admin = await adminModel.findOne({ email }).select('+password');
            if (admin) {
                const match = await bcrypt.compare(password, admin.password);
                if (match) {
                    const token = await createToken({
                        id: admin.id,
                        role: admin.role
                    });
                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    });
                    responseReturn(res, 200, { token, message: "Login Success" });
                } else {
                    responseReturn(res, 404, { error: "Password Wrong" });
                }
            } else {
                responseReturn(res, 404, { error: "Email not Found" });
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    seller_login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const seller = await sellerModel.findOne({ email }).select('+password');
            if (seller) {
                const match = await bcrypt.compare(password, seller.password);
                if (match) {
                    const token = await createToken({
                        id: seller.id,
                        role: seller.role
                    });
                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    });
                    responseReturn(res, 200, { token, message: "Login Success" });
                } else {
                    responseReturn(res, 404, { error: "Password Wrong" });
                }
            } else {
                responseReturn(res, 404, { error: "Email not Found" });
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    seller_register = async (req, res) => {
        const { email, name, password } = req.body;
        try {
            const getUser = await sellerModel.findOne({ email });
            if (getUser) {
                responseReturn(res, 404, { error: 'Email Already Exists' });
            } else {
                const seller = await sellerModel.create({
                    name,
                    email,
                    password: await bcrypt.hash(password, 10),
                    method: 'manual',
                    shopInfo: {}
                });
                await sellerCustomerModel.create({
                    myId: seller.id
                });

                const token = await createToken({ id: seller.id, role: seller.role });
                res.cookie('accessToken', token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                });

                responseReturn(res, 201, { token, message: 'Register Success' });
            }
        } catch (error) {
            responseReturn(res, 500, { error: 'Internal Server Error' });
        }
    };

    getUser = async (req, res) => {
        const { id, role } = req;
        try {
            if (role === 'admin') {
                const user = await adminModel.findById(id);
                responseReturn(res, 200, { userInfo: user });
            } else {
                const seller = await sellerModel.findById(id);
                const shopInfo = seller.shopInfo || {}; // Ensure shopInfo is not empty
                responseReturn(res, 200, { userInfo: { ...seller.toObject(), shopInfo } });
            }
        } catch (error) {
            responseReturn(res, 500, { error: 'Internal Server Error' });
        }
    };

    profile_image_upload = async (req, res) => {
        const { id } = req;
        const form = formidable({ multiples: true });
        form.parse(req, async (err, _, files) => {
            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            });
            const { image } = files;

            try {
                const result = await cloudinary.uploader.upload(image.filepath, { folder: 'profile' });
                if (result) {
                    await sellerModel.findByIdAndUpdate(id, {
                        image: result.url
                    });
                    const userInfo = await sellerModel.findById(id);
                    responseReturn(res, 201, { message: 'Profile Image Upload Successfully', userInfo });
                } else {
                    responseReturn(res, 404, { error: 'Image Upload Failed' });
                }
            } catch (error) {
                responseReturn(res, 500, { error: error.message });
            }
        });
    };

    profile_info_add = async (req, res) => {
        const { division, district, shopName, sub_district } = req.body;
        const { id } = req;
        try {
            await sellerModel.findByIdAndUpdate(id, {
                shopInfo: {
                    shopName,
                    division,
                    district,
                    sub_district
                }
            });
            const userInfo = await sellerModel.findById(id);
            responseReturn(res, 201, { message: 'Profile info Add Successfully', userInfo });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    logout = async (req, res) => {
        try {
            res.cookie('accessToken', null, {
                expires: new Date(Date.now()),
                httpOnly: true
            });
            responseReturn(res, 200, { message: 'Logout Success' });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };
}

module.exports = new authControllers();
