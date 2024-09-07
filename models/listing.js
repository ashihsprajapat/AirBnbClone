const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "https://th.bing.com/th/id/OIP.bnl3Jk7mXE6dwmdj3CbU7AHaJQ?rs=1&pid=ImgDetMain",
        set: (v) =>
            v === "" ? "https://th.bing.com/th/id/OIP.O0SXnq9wBbj9C3SALsGIewHaE9?rs=1&pid=ImgDetMain" : v,
    },

    price: {
        type: Number,
        required: true,
    },
    location: [String],
    country: {
        type: String,
        required: true,
        default: "India",
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }],

})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;