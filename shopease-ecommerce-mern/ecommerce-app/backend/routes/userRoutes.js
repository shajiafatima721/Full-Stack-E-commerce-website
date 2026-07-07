const express = require('express');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleWishlist,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.put('/wishlist/:productId', protect, toggleWishlist);

router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
