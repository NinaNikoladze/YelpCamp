const Campground = require('../model/campground');
const {cloudinary} = require('cloudinary')
const maptilerClient = require('@maptiler/client');
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
const express = require('express');
const app = express()



module.exports.home = (req,res) => {
    res.render('views/home2')
}

module.exports.index = async (req,res) => {
 const campgrounds = await Campground.find({});
 res.render('campgrounds/index', {campgrounds})
}

module.exports.new = (req,res) => {
 res.render('campgrounds/new') }


module.exports.createForm = async(req,res,next) => {
 const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });

 if (!geoData.features?.length) {
        req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
        return res.redirect('/campgrounds/new');
    }
 const campground = new Campground(req.body.campground);
    campground.geometry = geoData.features[0].geometry;
    campground.location = geoData.features[0].place_name;
    campground.images = req.files.map(image => ({url:image.path, filename: image.filename}))
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.findCampground = async(req,res,next) => {
    const {id} = req.params;
const campground = await Campground.findById(req.params.id).populate({path:'review', 
    populate:{
        path:'author'
    }
}).populate('author');
if(!campground) {
req.flash('error', 'Sorry, campground is not found');
return res.redirect('/campgrounds')
}
res.render('campgrounds/details', {campground})
 console.log(campground.images)
}

module.exports.renderEditForm = async (req,res) => {
    const {id} = req.params;
   const campground = await Campground.findById(id)
   if(!campground) {
req.flash('error', 'Sorry, campground is not found');
return res.redirect('/campgrounds')
}
 res.render('campgrounds/edit', {campground})
}
 

module.exports.editCampground = async (req,res) => {
const {id} = req.params;
  const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    if (!geoData.features?.length) {
        req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
        return res.redirect(`/campgrounds/${id}/edit`);
    }

const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
 campground.geometry = geoData.features[0].geometry;
    campground.location = geoData.features[0].place_name;
const imgs = req.files.map(image => ({
url:image.path, filename: image.filename
}))
campground.images.push(...imgs)
await campground.save()
req.flash('success', 'Successfully updated campground!')
res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async(req,res) => {
    const {id} = req.params;
await Campground.findByIdAndDelete(id);
req.flash('success', 'Successfully deleted a campground!')
    res.redirect('/campgrounds')
}