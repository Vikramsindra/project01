const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapasync = require("../util/wrapasync.js");
const { isLoggedIn, isOwner, validateListing } = require("../midleware.js");
const {
    index,
    renderNewForm,
    createListing,
    editForm,
    editListing,
    deleteListing,
    showListing,
    catergoryselection,
    search
} = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router
    .route("/")
    .get(wrapasync(index))
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapasync(createListing));



router.get("/new", isLoggedIn, renderNewForm);
router.get("/category",catergoryselection);
router.get("/search",search);
router
    .route("/:id")
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapasync(editListing))
    .delete(isLoggedIn, isOwner, wrapasync(deleteListing))
    .get(wrapasync(showListing));

router.get("/:id/edit", isLoggedIn, isOwner, wrapasync(editForm));

module.exports = router;
