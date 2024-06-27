const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {listingSchema,reviewSchema} = require("../schema");
const ExpressError = require("../utils/ExpressError");
const Listing = require('../models/listing');
const {isLoggedIn} = require("../middleware");
const multer = require("multer");
const {storage} = require("../cloudConfig");
const upload = multer({storage});

//validatingListing
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

const listingController = require("../controllers/listing");

//index route
router.get("/", wrapAsync(listingController.index));

//new route
router.get("/new",isLoggedIn, listingController.renderForm);

//show route
router.get("/:id", wrapAsync(listingController.showListing));

//Crate route
router.post("/",
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing) 
);


//Edit route
router.get("/:id/edit",isLoggedIn, wrapAsync(listingController.renderEditListing));

router.put("/:id",upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing));

//delete route
router.delete("/:id",isLoggedIn, wrapAsync(listingController.deleteListing));

module.exports = router;