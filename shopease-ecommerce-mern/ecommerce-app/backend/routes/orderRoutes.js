const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  markOrderAsPaid,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/', protect, admin, getAllOrders);

router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, markOrderAsPaid);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
