// const Listing = require("../models/listing");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/tilesets');
// const mapToken = process.env.MAP_TAKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// module.exports.index = async (req, res) => {
//     const listings = await Listing.find({});
//     res.render("listings/index", { listings});
// };

// module.exports.renderForm = (req, res) => {
//     res.render("listings/new");
// }

// module.exports.showListing = async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id).populate({
//         path:"reviews",populate:{path:"author"},
//     }).populate("owner");
//     if (!listing) {
//         req.flash("error","Listing you requested for does not exist");
//         res.redirect("/listings");
//     }
//     console.log(listing);
//     res.render("listings/show", { listing });
// }

// module.exports.createListing = async (req, res, next) => {
//     let response = geocodingClient.forwardGeocode({
//         query: 'Paris, France',
//         limit: 2
//       })
//         .send()
//         .then(response => {
//           const match = response.body;
//         });
    
//     console.log(response);
//     res.send("done!!!");

//     let url = req.file.path;
//     let filename = req.file.filename;
//     const newListing = new Listing({...req.body.listing,owner: req.user._id});
//     newListing.image = {url,filename};
//     await newListing.save();
//     req.flash("success","New listing created");
//     res.redirect('/listings');
// }

// module.exports.rendereditListing = async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findById(id);
//     if (!listing) {
//         throw new ExpressError(404, "Listing not found");
//     }
//     let originalListingUrl = listing.image.url;
//     originalListingUrl=originalListingUrl.replace("/upload","/upload/h_300,w_250");
    
//     res.render("listings/edit", { listing,originalListingUrl });
// }

// module.exports.updateListing = async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     if(typeof req.file !== "undefined"){
//     let url = req.file.path;
//     let filename = req.file.filename;
//     listing.image = {url,filename};
//     await listing.save();
//     }
//     if (!listing) {
//         throw new ExpressError(404, "Listing not found");
//     }
//     res.redirect(`/listings/${id}`);
// }

// module.exports.deleteListing = async (req, res) => {
//     const { id } = req.params;
//     const listing = await Listing.findByIdAndDelete(id);
//     if (!listing) {
//         throw new ExpressError(404, "Listing not found");
//     }
//     req.flash("success","listing deleted successfully");
//     res.redirect("/listings");
// }

const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TAKEN;  // Ensure this is correctly named
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const listings = await Listing.find({});
    res.render("listings/index", { listings });
};

module.exports.renderForm = (req, res) => {
    res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: { path: "author" },
    }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", { listing });
};

module.exports.createListing = async (req, res, next) => {
    try {
        const response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,  // Assuming you get the location from the form
            limit: 1
        }).send();

        
        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing({ 
            ...req.body.listing, 
            owner: req.user._id,
             // Assuming you want to store the geocoding result
        });
        newListing.image = { url, filename };
        newListing.geometry = response.body.features[0].geometry;
        console.log(newListing);
        await newListing.save();
        req.flash("success", "New listing created");
        res.redirect('/listings');
    } catch (error) {
        next(error);
    }
};

module.exports.renderEditListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    let originalListingUrl = listing.image.url;
    originalListingUrl = originalListingUrl.replace("/upload", "/upload/h_300,w_250");

    res.render("listings/edit", { listing, originalListingUrl });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndDelete(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
};
