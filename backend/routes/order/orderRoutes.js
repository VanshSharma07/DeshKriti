const orderController = require('../../controllers/order/orderController')

const router = require('express').Router()


//CUSTOMER

router.post('/home/order/place-order',orderController.place_order)
router.get('/home/customer/get-dashboard-data/:userId',orderController.get_customer_dashboard_data)
router.get('/home/customer/get-orders/:customerId/:status',orderController.get_orders)
router.get('/home/customer/get-order-details/:orderId',orderController.get_order_details)
router.get('/admin/order/:orderId',orderController.get_admin_order)
router.post('/order/create-payment',orderController.create_payment)
router.get('/order/confirm/:orderId',orderController.order_confirm)
//ADMIN

router.get('/admin/orders',orderController.get_admin_orders)
router.put('/admin/order-status/update/:orderId',orderController.admin_order_status_update)

//SELLER 
router.get('/seller/orders/:sellerId',orderController.get_seller_orders)
router.get('/seller/order/:orderId',orderController.get_seller_order)
router.put('/seller/order-status/update/:orderId',orderController.seller_order_status_update)

// AUTRE
router.put('/product/:productId/decrease-stock',orderController.decrease_stock)
router.put('/product/:productId/increase-stock',orderController.increase_stock)

module.exports = router