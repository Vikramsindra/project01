const mongoose =  require('mongoose');
const Listing = require('../models/listing.js');
let data = require('./data.js');

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

};

main()
.then((res) => console.log('connection established'))
.catch((err)=> console.log(err));

const initDB = async () =>{
  await   Listing.deleteMany({});
  data = data.map((obj) =>( { ...obj,owner:"68cf27ad1456d4645a3ffe5d"}));
  await Listing.insertMany(data);
  console.log('data was initialized');
};

initDB();
