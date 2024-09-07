const mongoose=require("mongoose");
const initData=require("../init/data.js");
const Listing=require("../models/listing.js");

const url="mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(url);
}
main()
.then(()=>{
    console.log("Connect to dataBase");
})
.catch((err)=>{
    console.log(err);
})

const initdata=async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data is saved");

}
initdata();