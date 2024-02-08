// const User = require("../User");
// const { hashData } = require("./hashData");

// const createNewUser = async (data) => {
//     try {
//         const { email, password } = data;

//         // Check if the user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             throw new Error("User with the provided email already exists");
//         }

//         // Hash the password before storing it
//         // const hashedPassword = await hashData(password);

//         // Create a new user instance
//         const newUser = new User({
//             email,
//             password,
//             // : hashedPassword,
//         });

//         // Save the new user to the database
//         const createdUser = await newUser.save();
//         return createdUser;
//     } catch (error) {
//         // Handle errors gracefully
//         throw error;
//     }
// };

// module.exports = { createNewUser };
