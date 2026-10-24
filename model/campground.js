const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')
const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema({
    title: {
        type:String,
        required:true
    },
    images: [{
        url:String,
        filename:String
}],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates: {
            type:[Number],
            required:true
        }
    },
    author: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    review: [{ 
    type:mongoose.Schema.Types.ObjectId,
    ref:'Review'
    }]
}, opts)


CampgroundSchema.virtual('properties.popUpMarkup').get(function (){
    return `<div><strong> <a href='/campgrounds/${this.id}'>${this.title}</a></strong></div>  <div>${this.description.substring(0,20)}</div>`

})


module.exports = mongoose.model('Campground', CampgroundSchema);


