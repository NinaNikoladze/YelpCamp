const express = require('express');
const router = express.Router();
const wrapAsync = require('../utilities/wrapAsync');
const Campground = require('../model/campground')
const {isLoggedIn, validateSchema, isAuthor} = require('../middleware')
const campgrounds = require('../controllers/campgrounds');
const multer  = require('multer')
const {storage} = require('../cloudinary');
const campground = require('../model/campground');
const upload = multer({ storage })

router.get('/', wrapAsync(campgrounds.index))

router.get('/new', isLoggedIn, campgrounds.new)

router.post('/', isLoggedIn, validateSchema, upload.array('image'),  wrapAsync(campgrounds.createForm))

router.get('/:id', wrapAsync(campgrounds.findCampground))


router.get('/:id/edit', isLoggedIn, isAuthor,  wrapAsync(campgrounds.renderEditForm))

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateSchema, wrapAsync(campgrounds.editCampground))

router.delete('/:id', isLoggedIn, isAuthor, wrapAsync(campgrounds.deleteCampground))

module.exports = router;