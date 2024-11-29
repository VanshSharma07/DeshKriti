const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;
const Campaign = require('../../models/Campaign');
const Customer = require('../../models/customerModel');
const { responseReturn } = require('../../utiles/response');
const mongoose = require('mongoose');
class CampaignController {
    // Create campaign with multiple images
    create_campaign = async (req, res) => {
        const form = formidable({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return responseReturn(res, 500, { error: "Form parsing failed" });
            }

            try {
                let {
                    title,
                    description,
                    shortDescription,
                    targetAmount,
                    startDate,
                    endDate,
                    category,
                    beneficiaryInfo
                } = fields;

                // Validate target amount
                const parsedAmount = parseFloat(targetAmount);
                if (isNaN(parsedAmount) || parsedAmount <= 0) {
                    return responseReturn(res, 400, { error: "Invalid target amount" });
                }

                let { mainImage, galleryImages, documentProof } = files;

                // Ensure galleryImages is always an array
                if (!Array.isArray(galleryImages)) {
                    galleryImages = galleryImages ? [galleryImages] : [];
                }

                title = title.trim();
                const slug = title.split(" ").join("-").toLowerCase();

                cloudinary.config({
                    cloud_name: process.env.cloud_name,
                    api_key: process.env.api_key,
                    api_secret: process.env.api_secret,
                    secure: true
                });

                try {
                    // Upload main image
                    const mainImageResult = await cloudinary.uploader.upload(
                        mainImage.filepath,
                        { folder: "campaigns/main" }
                    );

                    // Upload gallery images
                    let galleryUrls = [];
                    for (let image of galleryImages) {
                        const result = await cloudinary.uploader.upload(
                            image.filepath,
                            { folder: "campaigns/gallery" }
                        );
                        galleryUrls.push(result.url);
                    }

                    // Upload document proof if exists
                    let documentUrl = '';
                    if (documentProof) {
                        const docResult = await cloudinary.uploader.upload(
                            documentProof.filepath,
                            { folder: "campaigns/documents" }
                        );
                        documentUrl = docResult.url;
                    }

                    const campaign = await Campaign.create({
                        title,
                        slug,
                        description,
                        shortDescription,
                        images: {
                            main: mainImageResult.url,
                            gallery: galleryUrls
                        },
                        targetAmount: parsedAmount,
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                        category,
                        beneficiary: {
                            ...JSON.parse(beneficiaryInfo),
                            documentProof: documentUrl
                        },
                        createdBy: req.id,
                        status: 'draft'
                    });

                    responseReturn(res, 201, {
                        campaign,
                        message: "Campaign Created Successfully"
                    });
                } catch (error) {
                    console.error("Campaign creation error:", error);
                    responseReturn(res, 500, { error: error.message });
                }
            } catch (error) {
                console.error("Campaign creation error:", error);
                responseReturn(res, 500, { error: error.message });
            }
        });
    };

    // Update campaign images
    update_campaign_images = async (req, res) => {
        const form = formidable({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return responseReturn(res, 500, { error: "Form parsing failed" });
            }

            const { campaignId, imageType, oldImageUrl } = fields;
            const { newImage } = files;

            try {
                cloudinary.config({
                    cloud_name: process.env.cloud_name,
                    api_key: process.env.api_key,
                    api_secret: process.env.api_secret,
                    secure: true
                });

                const result = await cloudinary.uploader.upload(
                    newImage.filepath,
                    { folder: `campaigns/${imageType}` }
                );

                let updateQuery = {};
                if (imageType === 'main') {
                    updateQuery = { 'images.main': result.url };
                } else if (imageType === 'gallery') {
                    const campaign = await Campaign.findById(campaignId);
                    const galleryImages = [...campaign.images.gallery];
                    const index = galleryImages.indexOf(oldImageUrl);
                    if (index !== -1) {
                        galleryImages[index] = result.url;
                        updateQuery = { 'images.gallery': galleryImages };
                    }
                }

                const campaign = await Campaign.findByIdAndUpdate(
                    campaignId,
                    updateQuery,
                    { new: true }
                );

                responseReturn(res, 200, {
                    campaign,
                    message: "Campaign Image Updated Successfully"
                });
            } catch (error) {
                responseReturn(res, 500, { error: error.message });
            }
        });
    };

    // Get all campaigns with optional filtering
    get_campaigns = async (req, res) => {
        try {
            const { status } = req.query;
            const query = status ? { status } : {};
            
            const campaigns = await Campaign.find(query)
                .sort({ createdAt: -1 });

            responseReturn(res, 200, { campaigns });
        } catch (error) {
            console.error("Get campaigns error:", error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    // Get single campaign by ID or slug
    get_campaign = async (req, res) => {
        const { identifier } = req.params;
        
        try {
            console.log('Searching for campaign with identifier:', identifier);
            
            let campaign;
            // First try to find by slug
            campaign = await Campaign.findOne({ slug: identifier });
            console.log('Search by slug result:', campaign);
            
            // If not found by slug and it's a valid ObjectId, try finding by ID
            if (!campaign && mongoose.Types.ObjectId.isValid(identifier)) {
                campaign = await Campaign.findById(identifier);
                console.log('Search by ID result:', campaign);
            }
            
            if (!campaign) {
                console.log('No campaign found for identifier:', identifier);
                return responseReturn(res, 404, { error: 'Campaign not found' });
            }

            console.log('Campaign found:', campaign.title);
            return responseReturn(res, 200, { campaign });
        } catch (error) {
            console.error('Error in get_campaign:', error);
            return responseReturn(res, 500, { error: 'Internal server error' });
        }
    };

    // Update campaign
    update_campaign = async (req, res) => {
        const form = formidable();
        const { campaignId } = req.params;

        form.parse(req, async (err, fields, _) => {
            if (err) {
                return responseReturn(res, 500, { error: "Form parsing failed" });
            }

            try {
                const {
                    title,
                    description,
                    shortDescription,
                    targetAmount,
                    startDate,
                    endDate,
                    category,
                    beneficiaryInfo
                } = fields;

                const updateData = {
                    ...(title && { title: title.trim(), slug: title.trim().split(" ").join("-").toLowerCase() }),
                    ...(description && { description }),
                    ...(shortDescription && { shortDescription }),
                    ...(targetAmount && { targetAmount: parseInt(targetAmount) }),
                    ...(startDate && { startDate: new Date(startDate) }),
                    ...(endDate && { endDate: new Date(endDate) }),
                    ...(category && { category }),
                    ...(beneficiaryInfo && { beneficiary: JSON.parse(beneficiaryInfo) })
                };

                const campaign = await Campaign.findByIdAndUpdate(
                    campaignId,
                    updateData,
                    { new: true }
                );

                if (!campaign) {
                    return responseReturn(res, 404, { error: 'Campaign not found' });
                }

                responseReturn(res, 200, {
                    campaign,
                    message: "Campaign Updated Successfully"
                });
            } catch (error) {
                console.error("Campaign update error:", error);
                responseReturn(res, 500, { error: error.message });
            }
        });
    };

    // Delete campaign
    delete_campaign = async (req, res) => {
        const { campaignId } = req.params;

        try {
            const campaign = await Campaign.findById(campaignId);
            if (!campaign) {
                return responseReturn(res, 404, { error: 'Campaign not found' });
            }

            // Delete images from Cloudinary
            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            });

            // Delete main image
            if (campaign.images.main) {
                const mainImageId = campaign.images.main.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`campaigns/main/${mainImageId}`);
            }

            // Delete gallery images
            for (let imageUrl of campaign.images.gallery) {
                const imageId = imageUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`campaigns/gallery/${imageId}`);
            }

            // Delete document proof if exists
            if (campaign.beneficiary?.documentProof) {
                const docId = campaign.beneficiary.documentProof.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`campaigns/documents/${docId}`);
            }

            await Campaign.findByIdAndDelete(campaignId);
            responseReturn(res, 200, { message: "Campaign Deleted Successfully" });
        } catch (error) {
            console.error("Campaign deletion error:", error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    get_featured_campaigns = async (req, res) => {
        try {
            const campaigns = await Campaign.find({ 
                featured: true,
                status: 'active',
                endDate: { $gt: new Date() }
            })
            .sort({ createdAt: -1 })
            .limit(6);
            
            responseReturn(res, 200, { campaigns });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    get_campaigns_by_category = async (req, res) => {
        const { category } = req.params;
        try {
            const campaigns = await Campaign.find({ 
                category,
                status: 'active',
                endDate: { $gt: new Date() }
            }).sort({ createdAt: -1 });
            
            responseReturn(res, 200, { campaigns });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    toggle_feature = async (req, res) => {
        const { campaignId } = req.params;
        try {
            const campaign = await Campaign.findById(campaignId);
            campaign.featured = !campaign.featured;
            await campaign.save();
            
            responseReturn(res, 200, { 
                campaign,
                message: `Campaign ${campaign.featured ? 'featured' : 'unfeatured'} successfully`
            });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    add_campaign_update = async (req, res) => {
        const form = formidable({ multiples: true });
        const { campaignId } = req.params;

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return responseReturn(res, 500, { error: "Form parsing failed" });
            }

            const { title, content } = fields;
            const { images } = files;

            try {
                // Handle image uploads similar to main campaign creation
                let imageUrls = [];
                if (images) {
                    cloudinary.config({
                        cloud_name: process.env.cloud_name,
                        api_key: process.env.api_key,
                        api_secret: process.env.api_secret,
                        secure: true
                    });

                    if (Array.isArray(images)) {
                        for (let image of images) {
                            const result = await cloudinary.uploader.upload(
                                image.filepath,
                                { folder: "campaigns/updates" }
                            );
                            imageUrls.push(result.url);
                        }
                    } else {
                        const result = await cloudinary.uploader.upload(
                            images.filepath,
                            { folder: "campaigns/updates" }
                        );
                        imageUrls.push(result.url);
                    }
                }

                const campaign = await Campaign.findByIdAndUpdate(
                    campaignId,
                    {
                        $push: {
                            updates: {
                                title,
                                content,
                                images: imageUrls,
                                date: new Date()
                            }
                        }
                    },
                    { new: true }
                );

                responseReturn(res, 200, {
                    campaign,
                    message: "Campaign update added successfully"
                });
            } catch (error) {
                responseReturn(res, 500, { error: error.message });
            }
        });
    };

    add_donation = async (req, res) => {
        const { campaignId } = req.params;
        const { amount, isAnonymous } = req.body;
        const { id: userId } = req;

        try {
            // Parse amount and validate it's a number
            const parsedAmount = parseFloat(amount);
            console.log('Received amount:', amount, 'Parsed amount:', parsedAmount);

            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                return responseReturn(res, 400, { error: 'Invalid donation amount' });
            }

            const campaign = await Campaign.findById(campaignId);
            
            if (!campaign) {
                return responseReturn(res, 404, { error: 'Campaign not found' });
            }

            if (campaign.status !== 'active') {
                return responseReturn(res, 400, { error: 'Campaign is not active' });
            }

            if (new Date() > campaign.endDate) {
                return responseReturn(res, 400, { error: 'Campaign has ended' });
            }

            // Add donation to campaign
            const donation = {
                userId,
                amount: parsedAmount,
                isAnonymous: Boolean(isAnonymous),
                date: new Date()
            };

            // Update campaign with new donation
            const updatedCampaign = await Campaign.findByIdAndUpdate(
                campaignId,
                {
                    $push: { donors: donation },
                    $inc: { currentAmount: parsedAmount },
                    $set: {
                        status: parsedAmount + campaign.currentAmount >= campaign.targetAmount 
                            ? 'completed' 
                            : 'active'
                    }
                },
                { new: true }
            );

            responseReturn(res, 200, {
                campaign: updatedCampaign,
                message: "Donation added successfully"
            });
        } catch (error) {
            console.error("Donation error:", error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    get_campaign_donations = async (req, res) => {
        const { campaignId } = req.params;
        try {
            const campaign = await Campaign.findById(campaignId)
                .populate({
                    path: 'donors.userId',
                    select: 'firstName lastName email'
                });

            if (!campaign) {
                return responseReturn(res, 404, { error: 'Campaign not found' });
            }

            // Sort donations by date in descending order (most recent first)
            const donations = campaign.donors
                .sort((a, b) => b.date - a.date)
                .map(donation => ({
                    id: donation._id,
                    amount: donation.amount,
                    date: donation.date,
                    isAnonymous: donation.isAnonymous,
                    donor: donation.isAnonymous 
                        ? { name: 'Anonymous' } 
                        : { 
                            name: donation.userId 
                                ? `${donation.userId.firstName} ${donation.userId.lastName || ''}`.trim()
                                : 'Anonymous',
                            email: donation.userId?.email
                        }
                }));

            console.log('Fetched donations:', donations); // Debug log
            responseReturn(res, 200, { donations });
        } catch (error) {
            console.error('Error fetching donations:', error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    delete_campaign_update = async (req, res) => {
        const { campaignId, updateId } = req.params;

        try {
            const campaign = await Campaign.findById(campaignId);
            if (!campaign) {
                return responseReturn(res, 404, { error: 'Campaign not found' });
            }

            const update = campaign.updates.id(updateId);
            if (!update) {
                return responseReturn(res, 404, { error: 'Update not found' });
            }

            // Delete update images from Cloudinary
            if (update.images && update.images.length > 0) {
                cloudinary.config({
                    cloud_name: process.env.cloud_name,
                    api_key: process.env.api_key,
                    api_secret: process.env.api_secret,
                    secure: true
                });

                for (let imageUrl of update.images) {
                    const imageId = imageUrl.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(`campaigns/updates/${imageId}`);
                }
            }

            campaign.updates.pull(updateId);
            await campaign.save();

            responseReturn(res, 200, {
                message: "Campaign update deleted successfully"
            });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    update_campaign_status = async (req, res) => {
        const { campaignId } = req.params;
        const { status } = req.body;

        try {
            const validStatuses = ['draft', 'active', 'paused', 'completed', 'cancelled'];
            if (!validStatuses.includes(status)) {
                return responseReturn(res, 400, { error: 'Invalid status' });
            }

            const campaign = await Campaign.findById(campaignId);
            if (!campaign) {
                return responseReturn(res, 404, { error: 'Campaign not found' });
            }

            // Additional validations
            if (status === 'active') {
                if (new Date() > campaign.endDate) {
                    return responseReturn(res, 400, { error: 'Cannot activate campaign after end date' });
                }
            }

            const updatedCampaign = await Campaign.findByIdAndUpdate(
                campaignId,
                { status },
                { new: true }
            );

            responseReturn(res, 200, {
                campaign: updatedCampaign,
                message: `Campaign status updated to ${status}`
            });
        } catch (error) {
            console.error("Update status error:", error);
            responseReturn(res, 500, { error: error.message });
        }
    };

    get_campaign_stats = async (req, res) => {
        try {
            const stats = await Campaign.aggregate([
                {
                    $group: {
                        _id: null,
                        totalCampaigns: { $sum: 1 },
                        activeCampaigns: {
                            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] }
                        },
                        totalRaised: { $sum: "$currentAmount" },
                        totalDonors: { $sum: { $size: "$donors" } }
                    }
                }
            ]);
            
            responseReturn(res, 200, { stats: stats[0] });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    get_recent_donations = async (req, res) => {
        try {
            const campaigns = await Campaign.aggregate([
                { $unwind: "$donors" },
                { $sort: { "donors.date": -1 } },
                { $limit: 10 },
                {
                    $lookup: {
                        from: "customers",
                        localField: "donors.userId",
                        foreignField: "_id",
                        as: "donorInfo"
                    }
                },
                {
                    $project: {
                        title: 1,
                        "donors.amount": 1,
                        "donors.date": 1,
                        "donors.isAnonymous": 1,
                        "donorInfo.firstName": 1,
                        "donorInfo.lastName": 1,
                        "donorInfo.email": 1
                    }
                }
            ]);
            
            responseReturn(res, 200, { donations: campaigns });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };

    get_campaign_analytics = async (req, res) => {
        const { campaignId } = req.params;
        try {
            const campaign = await Campaign.findById(campaignId);
            if (!campaign) {
                return responseReturn(res, 404, { error: 'Campaign not found' });
            }

            const analytics = {
                totalDonors: campaign.donors.length,
                averageDonation: campaign.donors.reduce((acc, donor) => acc + donor.amount, 0) / campaign.donors.length,
                donationsByDay: await Campaign.aggregate([
                    { $match: { _id: mongoose.Types.ObjectId(campaignId) } },
                    { $unwind: "$donors" },
                    {
                        $group: {
                            _id: { $dateToString: { format: "%Y-%m-%d", date: "$donors.date" } },
                            total: { $sum: "$donors.amount" },
                            count: { $sum: 1 }
                        }
                    },
                    { $sort: { "_id": 1 } }
                ])
            };
            
            responseReturn(res, 200, { analytics });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    };
}

module.exports = new CampaignController();