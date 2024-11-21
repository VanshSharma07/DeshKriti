const router = require('express').Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const microLoanPaymentController = require('../controllers/payment/microLoanPaymentController');

router.post('/loan/disburse/:loanId', authMiddleware, microLoanPaymentController.disburseLoan);
router.post('/loan/payment/create', authMiddleware, microLoanPaymentController.createLoanPayment);
router.post('/loan/payment/confirm', authMiddleware, microLoanPaymentController.confirmLoanRepayment);

module.exports = router;