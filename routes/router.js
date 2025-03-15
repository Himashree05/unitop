import express from "express";
import { LeetCode } from "leetcode-query";
import User from '../models/user.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();
import dotenv from "dotenv";

dotenv.config();

router.get("/",(req,res)=>{
    res.render("home");
});

router.get('/signup',(req,res)=>{
    res.render("signup");
})

router.get('/login',(req,res)=>{
    res.render("login")
})


router.post('/signup', async (req,res) => {
    const {username,leetcodeName,password} = req.body;

    if(!username || !password || !leetcodeName )
    {
        return res.status(400).json({messege : 'all fields are required'});
    }

    try{
        const userExists = await User.findOne({username});
        if(userExists){
            return res.status(400).json({messege: "username already exists"});
        }

        const newUser = new User({username,leetcodeName,password});

        await newUser.save();
        // res.status(201).json({ message: 'User registered successfully' });
        const leetcode = new LeetCode();
        const user = await leetcode.user(leetcodeName)
        if(user)
        {
            res.render("user",{user});
        }
        else
        {
            res.send("username doesnot found please enter the correct username")
        }
    }
    catch(error)
    {
        res.status(500).json({ message: 'Server error', error: error.message });
    
    };
})






router.post("/login", async(req,res)=>{
    const {username, password} = req.body;
    
     if(!username || !password)
     {
        return res.status(400).json({ messege:"username and password are required"})
     }

     try{
          const existingUser = await User.findOne({username});
          if(!existingUser)
          {
            return res.status(404).json({messege:"User not found please sign up first"})
          }


          console.log("Fetched user:", existingUser);


          const isPasswordValid = await bcrypt.compare(password,existingUser.password);

          if(!isPasswordValid)
          {
            return res.status(401).json({messege:"Invalid credentials. please try again"})
          }

          const {leetcodeName} = existingUser;
          const leetcode = new LeetCode();
          const user = await leetcode.user(leetcodeName);
          //jwt token
          const token = jwt.sign({
               userId: existingUser._id,
               email: existingUser.email,
               username: existingUser.username
               
          },
           process.env.JWT_SECRET,
        )
         // res.render("user",{user});
         res.cookie('token',token)
         res.render("user",{user})
         //res.send('logged in');
     }
     catch(error)
     {
        console.error("login error : ",error.message);
        res.status(500).json({ messege:" server error please try agin sometime later"})
     }
});

export default router;