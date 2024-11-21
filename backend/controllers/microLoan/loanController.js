const LoanRequest = require('../../models/microLoan/loanRequestModel');
const MicroLoan = require('../../models/microLoan/loanModel');
const sellerModel = require('../../models/sellerModel');
const { responseReturn } = require('../../utiles/response');
const moment = require('moment');
const { mongo: {ObjectId} } = require('mongoose');

class LoanController {
    createLoanRequest = async (req, res) => {
        const { amount, purpose, businessPlan } = req.body;
        const { id } = req;

        try {
            const seller = await sellerModel.findById(id);
            if (seller.activeLoans.length > 0) {
                return responseReturn(res, 400, { error: 'You already have an active loan' });
            }

            const loanRequest = await LoanRequest.create({
                sellerId: id,
                amount,
                purpose,
                businessPlan
            });

            responseReturn(res, 201, { 
                message: 'Loan request created successfully',
                loanRequest 
            });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }

    getLoanRequests = async (req, res) => {
        const { page, searchValue, parPage } = req.query;
        const skipPage = parseInt(parPage) * (parseInt(page) - 1);

        try {
            let loanRequests;
            if (searchValue) {
                loanRequests = await LoanRequest.aggregate([
                    {
                        $lookup: {
                            from: 'sellers',
                            localField: 'sellerId',
                            foreignField: '_id',
                            as: 'seller'
                        }
                    },
                    {
                        $match: {
                            $or: [
                                { 'seller.name': { $regex: searchValue, $options: 'i' }},
                                { purpose: { $regex: searchValue, $options: 'i' }}
                            ]
                        }
                    }
                ]).skip(skipPage).limit(parPage);
            } else {
                loanRequests = await LoanRequest.find({ status: 'pending' })
                    .populate('sellerId', 'name email shopInfo')
                    .skip(skipPage)
                    .limit(parPage)
                    .sort({ createdAt: -1 });
            }

            const totalRequests = await LoanRequest.countDocuments({ status: 'pending' });
            responseReturn(res, 200, { loanRequests, totalRequests });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }

    getSellerLoans = async (req, res) => {
        const { id } = req;
        try {
            const [loanRequests, microLoans] = await Promise.all([
                LoanRequest.find({ 
                    sellerId: id,
                    status: { $in: ['pending', 'approved'] }
                }),
                MicroLoan.find({ sellerId: id })
                    .populate('lenderId', 'name email')
                    .sort({ createdAt: -1 })
            ]);

            const pendingAmount = microLoans
                .filter(loan => loan.status === 'active')
                .reduce((sum, loan) => sum + (loan.repaymentAmount - (loan.repaidAmount || 0)), 0);

            const totalLoans = microLoans.length;
            const activeLoans = microLoans.filter(loan => loan.status === 'active').length;

            responseReturn(res, 200, {
                loans: [...loanRequests, ...microLoans],
                pendingAmount,
                totalLoans,
                activeLoans
            });
        } catch (error) {
            responseReturn(res, 500, { error: error.message });
        }
    }

    updateLoanStatus = async (req, res) => {
        const { loanId, status } = req.body;
        try {
            const loanRequest = await LoanRequest.findByIdAndUpdate(
                loanId, 
                { status },
                { new: true }
            ).populate('sellerId', 'name email shopInfo');

            if (!loanRequest) {
                return responseReturn(res, 404, { error: 'Loan request not found' });
            }

            if (status === 'approved') {
                const interestRate = 12;
                const duration = 3;
                const monthlyInterestRate = interestRate / 12 / 100;
                const repaymentAmount = loanRequest.amount * (1 + (monthlyInterestRate * duration));

                const microLoan = await MicroLoan.create({
                    sellerId: loanRequest.sellerId._id,
                    lenderId: req.id,
                    amount: loanRequest.amount,
                    interestRate,
                    duration,
                    status: 'pending',
                    repaymentAmount: Math.round(repaymentAmount),
                    dueDate: moment().add(duration, 'months').toDate(),
                    repaidAmount: 0
                });

                await sellerModel.findByIdAndUpdate(loanRequest.sellerId._id, {
                    $push: { 
                        activeLoans: microLoan._id,
                        loanHistory: microLoan._id 
                    }
                });
            }

            responseReturn(res, 200, {
                message: `Loan request ${status} successfully`,
                loan: loanRequest
            });
        } catch (error) {
            console.error('Error in updateLoanStatus:', error);
            responseReturn(res, 500, { error: error.message });
        }
    }
}

module.exports = new LoanController();