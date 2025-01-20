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

exports.deleteAllUsers = async (req, res) => {
    try {
        const result = await User.deleteMany({});  // Delete all users from the database
        res.status(200).json({
            message: 'All users have been deleted successfully.',
            deletedCount: result.deletedCount,  // Number of deleted documents
        });
    } catch (error) {
        console.error('Error deleting users:', error);
        res.status(500).json({ error: 'An error occurred while deleting users.' });
    }
}
