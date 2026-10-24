require('dotenv').config();
const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);
const mongoose = require('mongoose');
const Campground = require('../model/campground')
const cities = require('./cities')
const {places, descriptors}= require('./seedHelpers')

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
});


const sample = array => array[Math.floor(Math.random()*array.length)];


const seedDB = async() => {
await Campground.deleteMany({});
for(let i=0;i<50; i++) {
    const random1000 = Math.floor(Math.random() *1000);
     const randNumber = Math.floor(Math.random()*20)+10;
const camp = new Campground({
    author:'6add06ab8b9279345df2ac04',
    location:`${cities[random1000].city}, ${cities[random1000].state}`,
    title: `${sample(descriptors)} ${sample(places)}`,
    images:[
  {
    url: 'https://res.cloudinary.com/sbw5mdve/image/upload/v1792499342/YelpCamp/o3t9puwvgutlvti3yipr.avif',
    filename: 'YelpCamp/ujmjxuoawhtl0ewicxsl',
  },
  {
    url: 'https://res.cloudinary.com/sbw5mdve/image/upload/v1792488882/YelpCamp/tizpmayt8pztlfxlr6s7.avif',
    filename: 'YelpCamp/tizpmayt8pztlfxlr6s7',
  }
],
 geometry: {
                type: "Point",
                coordinates:[
                  cities[random1000].longitude,
                  cities[random1000].latitude
                ]
            },

    description:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla in tempora reprehenderit cupiditate totam? Numquam excepturi a itaque reiciendis molestiae iure corporis est, soluta id, debitis fugit nulla iusto ea?",
    price: randNumber
})
await camp.save()
}
}

seedDB().then(() => {
mongoose.connection.close()
})