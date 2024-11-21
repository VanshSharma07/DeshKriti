const router = require('express').Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const loanController = require('../controllers/microLoan/loanController');
const loanPaymentController = require('../controllers/payment/loanPaymentController');

// Loan Request Routes
router.post('/request', authMiddleware, loanController.createLoanRequest);
router.get('/requests', authMiddleware, loanController.getLoanRequests);
router.get('/seller-loans', authMiddleware, loanController.getSellerLoans);
router.put('/status', authMiddleware, loanController.updateLoanStatus);

// Loan Payment Routes
router.post('/disburse/:loanId', authMiddleware, loanPaymentController.disburseLoan);
router.post('/repayment', authMiddleware, loanPaymentController.processRepayment);

module.exports = router;