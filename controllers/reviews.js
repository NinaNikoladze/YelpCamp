const Review = require('../model/review');
const Campground = require('../model/campground')

module.exports.postAReview = async(req,res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.review.push(review);
 await  review.save();
 await campground.save();
 req.flash('success', 'Successfully added a review!')
 res.redirect(`/campgrounds/${campground._id}`);
} 

module.exports.deleteAReview= async (req,res) => {
const {id, reviewId} = req.params;
await Campground.findByIdAndUpdate(id, {$pull: {review: reviewId}});
await Review.findByIdAndDelete(reviewId);
req.flash('success', 'Successfully deleted a review!')
res.redirect(`/campgrounds/${id}`)
}