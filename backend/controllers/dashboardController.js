const User = require("../models/user");

exports.allUsers = async (req, res) => {
    try {
        const users = await User.find();  // Fetch all users from the database
        res.status(200).json({ users });  // Return users as a JSON response
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users.' });
    }
};
