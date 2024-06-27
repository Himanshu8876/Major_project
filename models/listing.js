const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url:String,
        filename:String,
    },
    price: Number,
    location: String,
    country: String,
    owner: 
        {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    geometry:{
        type: {
            type: String,  // 'type' is required and must be a string
            enum: ['Point'],  // 'type' must be 'Point'
            required: true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    }
    
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
