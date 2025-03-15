
import mongoose from "mongoose";


 const connection = mongoose.connect('mongodb://0.0.0.0/leetcode-scrapper').then(()=>{
    console.log("database is connected")
})

export default connection;