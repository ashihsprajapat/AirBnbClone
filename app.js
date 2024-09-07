const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/review");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, ("views")))
app.use(express.urlencoded({ extended: true }));//middlewares
app.use(methodOverride('_method'));//middlewares
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));//middlewares
app.use(express.json());

app.listen(port, () => {
    console.log("App is listening on port ", port);
})

const url = "mongodb://127.0.0.1:27017/wanderlust";
async function main() {
    await mongoose.connect(url);
}
main()
    .then(() => {
        console.log("Connect to dataBase");
    })
    .catch((err) => {
        console.log(err);
    })
//home rout
app.get("/", (req, res) => {
    res.send("ok ");
})

//add new  rout
app.post("/listings", wrapAsync(async (req, res) => {
    if (!newListing) {
        throw new ExpressError(400, "sed valid listngs");
    }
    const newListing = new Listing({
        ...req.body.listing,
        location: Array.isArray(req.body.listing.location) ? req.body.listing.location : [req.body.listing.location]
    });
    if (!newListing.title) {
        throw new ExpressError(400, "title is missing");
    }

    if (!newListing.description) {
        throw new ExpressError(400, "description is missing");
    }
    if (!newListing.price) {
        throw new ExpressError(400, "price is missing");
    }
    if (!newListing.location) {
        throw new ExpressError(400, "location is missing");
    }
    if (!newListing.country) {
        throw new ExpressError(400, "country is missing");
    }

    await newListing.save();
    res.redirect(`/listings/${newListing._id}`);

}));


//index rout
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});

    res.render("listing/index.ejs", { allListings });
}))
//new rout
app.get("/listings/new", (req, res) => {
    res.render("listing/new.ejs");
})

//edit rout
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
}))
//update rout
app.put("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const { listing } = req.body;

    // Validate that listing is present
    if (!listing) {
        throw new ExpressError(400, "listing is not find");
    }

    // Ensure location is always an array
    const updatedListing = {
        ...listing,
        location: Array.isArray(listing.location) ? listing.location : [listing.location]
    };


    // Find and update the listing
    const updatedDocument = await Listing.findByIdAndUpdate(id, updatedListing, { new: true });

    // Check if the document was found and updated
    if (updatedDocument) {
        res.redirect(`/listings/${id}`);
    } else {
        res.status(404).send("Listing not found");
    }

}));

//delete rout
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    //  console.log(deleteListing);
    res.redirect("/listings")
}))

//show rout as read operations
app.get("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);
    res.render("listing/show.ejs", { list });
}))

app.all("*", wrapAsync((req, res, next) => {
    next(new ExpressError(404, "this page not found"));
}));
app.use((err, req, res, next) => {
    let { status = 407, message = "something went wrong" } = err;
    // res.status(status).send(message);;
    res.render("listing/error.ejs", { message });
})

//review post rout
app.post("/listing/:id/reviews", async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).send('Listing not found');
    }
    let newReview = new Review({
        comment: req.body.review.comment,
        rating: req.body.review.rating,
        createAt: req.body.review.createAt
    });
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("listing is save");
    res.send("Review is added");
})
console.log("closing");
