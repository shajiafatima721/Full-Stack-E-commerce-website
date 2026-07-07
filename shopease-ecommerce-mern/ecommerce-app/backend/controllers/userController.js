const asyncHandler = require('express-async-handler');
const User = require('../models/User');

/**
 * @desc    Get all users (with simple pagination)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { email: { $regex: req.query.keyword, $options: 'i' } },
        ],
      }
    : {};

  const count = await User.countDocuments(keyword);
  const users = await User.find(keyword)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(limit * (page - 1));

  res.json({
    success: true,
    users,
    page,
    pages: Math.ceil(count / limit),
    total: count,
  });
});

/**
 * @desc    Get single user by id
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ success: true, user });
});

/**
 * @desc    Update a user's role / active status (admin only)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name ?? user.name;
  user.role = req.body.role ?? user.role;
  user.isActive = req.body.isActive ?? user.isActive;

  const updated = await user.save();
  res.json({ success: true, user: updated });
});

/**
 * @desc    Delete a user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Admin accounts cannot be deleted from here');
  }

  await user.deleteOne();
  res.json({ success: true, message: 'User removed' });
});

/**
 * @desc    Toggle a product in the logged-in user's wishlist
 * @route   PUT /api/users/wishlist/:productId
 * @access  Private
 */
const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId } = req.params;

  const index = user.wishlist.findIndex((id) => id.toString() === productId);

  if (index > -1) {
    user.wishlist.splice(index, 1);
  } else {
    user.wishlist.push(productId);
  }

  await user.save();
  const populated = await user.populate('wishlist');

  res.json({ success: true, wishlist: populated.wishlist });
});

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleWishlist,
};
