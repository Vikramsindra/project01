const Listing = require("../models/listing");
const NodeGeocoder = require("node-geocoder");

module.exports.index = async (req, res) => {
    let data = await Listing.find();
    res.render('listing/index.ejs', { data });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listing/form.ejs");
};

module.exports.createListing = async (req, res, next) => {
    const geocoder = NodeGeocoder({ provider: 'openstreetmap' });
    let response = await geocoder.geocode(req.body.listing.location);
    let cordinate = [response[0].latitude, response[0].longitude];
    const geoJson = {
        type: "Point",
        coordinates: cordinate,
    };
    
    let url = req.file.path;
    let filename = req.file.filename;
    const newl = new Listing(req.body.listing);
    newl.owner = req.user._id;
    newl.image = { url, filename };
    newl.geometry = geoJson;
    await newl.save();
    req.flash("success", "New listing created");
    res.redirect('/listing');
};

module.exports.editForm = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    if (!data) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listing");
    } else {
        let originalImage = data.image.url;
        originalImage = originalImage.replace("/upload", "/upload/w_250");
        res.render('listing/edit.ejs', { data, originalImage });
    }

};

module.exports.editListing = async (req, res) => {
    let { id } = req.params;

    let data = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        data.image = { url, filename };
        await data.save();
    }
    req.flash("success", "Listing  Updated!");
    res.redirect(`/listing/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;

    let data = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect('/listing');
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");

    // if (!data) throw new ExpressError(404, "Listing not found");
    if (!data) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listing");
    } else {
        res.render('listing/show.ejs', { data });
    }
};

module.exports.catergoryselection= async (req,res) => {
    const {q} = req.query;
    let data  = await Listing.find({category:q});
    if (!data) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listing");
    } else {
        res.render('listing', { data });
    }
}

module.exports.search = async (req,res) => {
    let {loc} = req.query;
    let data = await Listing.find({location:loc});
      res.render('listing', { data });
}
