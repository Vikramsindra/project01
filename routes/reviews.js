const express =require("express");
const router = express.Router({mergeParams:true});
const Review = require('../models/reviews.js');
const wrapasync = require('../util/wrapasync.js');
const { reviewSchema} = require('../schema.js');
const ExpressError = require('../util/ExpressError.js');
const Listing = require('../models/listing.js');
const {validatereview, isLoggedIn, isReviewAuthor} = require("../midleware.js");
const { createReview, deleteReview } = require("../controllers/review.js");



//create route 
router.post("",isLoggedIn,validatereview,wrapasync(createReview));

//delete route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapasync(deleteReview));

module.exports= router;
