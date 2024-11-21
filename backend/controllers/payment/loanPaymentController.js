const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const MicroLoan = require('../../models/microLoan/loanModel');
const sellerModel = require('../../models/sellerModel');
const stripeModel = require('../../models/stripeModel');
const { responseReturn } = require('../../utiles/response');
const moment = require('moment');

class LoanPaymentController {
    disburseLoan = async (req, res) => {
        const { loanId } = req.params;
        
        try {
            const loan = await MicroLoan.findById(loanId);
            const seller = await sellerModel.findById(loan.sellerId);
            const stripeInfo = await stripeModel.findOne({ sellerId: loan.sellerId });

            if (!stripeInfo) {
                return responseReturn(res, 400, { error: 'Seller has no connected Stripe account' });
            }

            // Calculate loan amount in cents for Stripe
            const amount = Math.round(loan.amount * 100);

            // Create transfer to seller's connected account
            const transfer = await stripe.transfers.create({
                amount: amount,
                currency: 'inr',
                destination: stripeInfo.stripeId,
                description: `Loan disbursement for ${seller.name}`
            });

            // Update loan status
            loan.status = 'active';
            loan.disbursementDate = new Date();
            await loan.save();

            // Add loan to seller's active loans
            await sellerModel.findByIdAndUpdate(loan.sellerId, {
                $push: { activeLoans: loan._id }
            });

            responseReturn(res, 200, {
                message: 'Loan disbursed successfully',
                transfer
            });

        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    }

    processRepayment = async (req, res) => {
        const { loanId, amount } = req.body;
        const { id: sellerId } = req;

        try {
            const loan = await MicroLoan.findById(loanId);
            
            if (loan.status !== 'active') {
                return responseReturn(res, 400, { error: 'Loan is not active' });
            }

            // Reference your existing payment processing
            // Similar to payment_request_confirm in paymentController.js (lines 169-199)
            const payment = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency: 'inr',
                automatic_payment_methods: {
                    enabled: true
                }
            });

            // Update loan repayment status
            const remainingAmount = loan.repaymentAmount - amount;
            if (remainingAmount <= 0) {
                loan.status = 'repaid';
                await sellerModel.findByIdAndUpdate(sellerId, {
                    $pull: { activeLoans: loanId },
                    $push: { loanHistory: loanId }
                });
            }

            loan.repaidAmount = (loan.repaidAmount || 0) + amount;
            await loan.save();

            responseReturn(res, 200, {
                message: 'Repayment processed successfully',
                clientSecret: payment.client_secret
            });

        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { error: 'Internal server error' });
        }
    }
}

module.exports = new LoanPaymentController();