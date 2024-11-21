const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const MicroLoan = require('../../models/microLoan/loanModel');
const sellerModel = require('../../models/sellerModel');
const stripeModel = require('../../models/stripeModel');
const { responseReturn } = require('../../utiles/response');
const moment = require('moment');

class MicroLoanPaymentController {
    // Similar to payment_request_confirm in paymentController.js
    // Reference: backend/controllers/payment/paymentController.js (lines 169-199)
    disburseLoan = async (req, res) => {
        const { loanId } = req.params;
        
        try {
            const loan = await MicroLoan.findById(loanId);
            const { stripeId } = await stripeModel.findOne({
                sellerId: new ObjectId(loan.sellerId)
            });

            if (!stripeId) {
                return responseReturn(res, 400, { error: 'Seller has no connected Stripe account' });
            }

            // Calculate amount with platform fee (similar to your existing logic)
            const amount = Math.round(loan.amount * 100 * 0.33);

            // Create Stripe transfer
            const transfer = await stripe.transfers.create({
                amount: amount,
                currency: 'inr',
                destination: stripeId,
                description: `Loan disbursement for loan ID: ${loanId}`
            });

            // Update loan status
            await MicroLoan.findByIdAndUpdate(loanId, {
                status: 'active',
                disbursementDate: moment(Date.now()).format('l')
            });

            // Add to seller's active loans
            await sellerModel.findByIdAndUpdate(loan.sellerId, {
                $push: { activeLoans: loanId }
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

    // Similar to create_payment in orderController.js
    // Reference: backend/controllers/order/orderController.js (lines 293-308)
    createLoanPayment = async (req, res) => {
        const { amount } = req.body;
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100),
                currency: 'inr',
                automatic_payment_methods: {
                    enabled: true
                }
            });

            responseReturn(res, 200, { 
                clientSecret: paymentIntent.client_secret 
            });
        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { error: 'Payment creation failed' });
        }
    }

    // Similar to order_confirm in orderController.js
    // Reference: backend/controllers/order/orderController.js (lines 311-344)
    confirmLoanRepayment = async (req, res) => {
        const { loanId, amount } = req.body;
        try {
            const loan = await MicroLoan.findById(loanId);
            const time = moment(Date.now()).format('l');
            const splitTime = time.split('/');

            // Record repayment in seller wallet
            await sellerWallet.create({
                sellerId: loan.sellerId.toString(),
                amount: -amount, // Negative amount for repayment
                month: splitTime[0],
                year: splitTime[2],
                type: 'loan_repayment'
            });

            // Update loan repayment status
            const remainingAmount = loan.repaymentAmount - amount;
            if (remainingAmount <= 0) {
                await MicroLoan.findByIdAndUpdate(loanId, {
                    status: 'repaid',
                    repaymentDate: moment(Date.now()).format('l')
                });

                await sellerModel.findByIdAndUpdate(loan.sellerId, {
                    $pull: { activeLoans: loanId },
                    $push: { loanHistory: loanId }
                });
            }

            responseReturn(res, 200, { message: 'Repayment successful' });
        } catch (error) {
            console.log(error);
            responseReturn(res, 500, { error: 'Repayment confirmation failed' });
        }
    }
}

module.exports = new MicroLoanPaymentController();