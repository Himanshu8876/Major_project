const mongoose = require('mongoose');
const initData = require('./model.js');
const Listing = require('../models/listing.js');

main()
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch((err)=>console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/WonderLust");
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: '66731e0c49db5ed9a50f8738' }));
    console.log(initData.data);
    await Listing.insertMany(initData.data);
    console.log("data fetched successfully");
}

initDB();
