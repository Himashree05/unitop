import express from "express";
import User from "../models/user.js";  // Import the User model
import auth from "../middleware/auth.js";  // Import your authentication middleware
import { LeetCode } from "leetcode-query";  // Import LeetCode API
const router = express.Router();

// Function to fetch LeetCode rank based on LeetCode username
const getLeetcodeRank = async (leetcodeName) => {
  try {
    const leetcode = new LeetCode();
    const userProfile = await leetcode.user(leetcodeName);
    
    // Log the full user profile data to check if rank is present
    //console.log("LeetCode User Profile:", userProfile);
    
    return userProfile.matchedUser.profile.ranking;
  } catch (error) {
    console.error('Error fetching rank for', leetcodeName, ':', error);
    return 'Error';  // Return 'Error' if there's an issue with the API call
  }
};

// GET route to display rankings
router.get("/", async (req, res) => {
  try {
    // Get all users from the database
    const users = await User.find();  // Get all users from the User model
    console.log("Users fetched from database:", users);  // Log users to check data
    
    // Fetch LeetCode rank for each user
    const rankings = [];
    for (let user of users) {
      console.log(`Fetching rank for ${user.username} with LeetCode username ${user.leetcodeName}`);
      const rank = await getLeetcodeRank(user.leetcodeName);  // Fetch rank from LeetCode
      console.log(rank);
      console.log(user.username)
      rankings.push({
        userName: user.username,  // Assuming `username` is a field in your model
        globalRanking: rank,  // Use the rank fetched from LeetCode
        leetcodeUsername: user.leetcodeName,  // Use the stored LeetCode username
      });
    }

    // Sort users by global ranking (ascending)
    rankings.sort((a, b) => {
      // Check if the rankings are numbers or strings like 'N/A'
      const aRank = a.globalRanking === 'N/A' ? Infinity : a.globalRanking;
      const bRank = b.globalRanking === 'N/A' ? Infinity : b.globalRanking;
      return aRank - bRank;
    });

    // Render the ranking page with sorted rankings
    res.render('ranking', { rankings });
  } catch (err) {
    console.error('Error fetching rankings:', err);
    res.status(500).send("Server Error");
  }
});

export default router;
