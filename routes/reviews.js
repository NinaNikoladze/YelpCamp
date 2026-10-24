const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utilities/wrapAsync');
const ExpressError = require('../utilities/ExpressError');
const Review = require('../model/review');
const {reviewSchema} = require('../schemas');
const Campground = require('../model/campground');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews')

router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.postAReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteAReview))
router.all('/{*path}', (req,res,next) => {
    next(new ExpressError('Page Not Found', 404));
    
})



module.exports = router;
