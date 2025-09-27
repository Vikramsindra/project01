const Listing = require("./models/listing");
const ExpressError = require("./util/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./models/reviews.js");

module.exports.isLoggedIn = (req, res, next) => {
   if (!req.isAuthenticated()) {
      req.session.redirectUrl = req.originalUrl;
      req.flash("error", " login first");
      return res.redirect("/login");
   }
   next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
   if (req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
   }
   next();
};

module.exports.isOwner = async (req, res, next) => {
   let { id } = req.params;
   let listing = await Listing.findById(id);
   if(!listing.owner.equals(res.locals.curruser._id)){
      req.flash("error","you not have permission");
      return res.redirect(`/listing/${id}`);
   }
   next();
}

module.exports.validateListing = (req, res, next) => {
  const  { error } = listingSchema.validate(req.body);
  if (error) {
   const  errmsg = error.details.map((el)=> el.message).join(",");
    return  next(new ExpressError(400, errmsg));
  }
  next();
};

module.exports.validatereview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map(el => el.message).join(",");
    console.log("Validation error:", errmsg);
    return next(new ExpressError(400, errmsg));
  }
  next();
};


module.exports.isReviewAuthor = async (req, res, next) => {
   let { id , reviewId } = req.params;
   let review = await Review.findById(reviewId);
   if(!review.author.equals(res.locals.curruser._id)){
      req.flash("error","you not author of this review permission");
      return res.redirect(`/listing/${id}`);
   }
   next();
}