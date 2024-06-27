const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const {listingSchema,reviewSchema} = require("../schema");
const Review = require('../models/review');
const Listing = require('../models/listing');
const {isLoggedIn} = require("../middleware");
const {isReviewAuthor} = require("../middleware");
const reviewController = require("../controllers/review");
//validateReview
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

//Reviews post
router.post("/",isLoggedIn,validateReview,
    wrapAsync(reviewController.CreateReview));

//ReviewDelete
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteRoute));

module.exports =router;