const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.createReview=async (req,res)=>{
    let {id} = req.params;
    let listing  = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = res.locals.curruser._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Added");
    res.redirect(`/listing/${id}`);
   

};

module.exports.deleteReview=async (req,res) => {
    const {reviewId ,id} = req.params;
   await Review.findByIdAndDelete(reviewId);
   await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}}); 
   req.flash("success","Review is Deleted");
   res.redirect(`/listing/${id}`);
};