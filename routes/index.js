const express = require('express');
const router = express.Router();
const campgroundRoutes = require('./campgrounds');
const reviewRoutes = require('./reviews');
const userRoutes = require('./users');

router.use('/campgrounds', campgroundRoutes);
router.use('/campgrounds/:id/reviews', reviewRoutes);
router.use('/', userRoutes);

module.exports = router;
