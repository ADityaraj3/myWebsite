import User from "../models/User.js";

// Read

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    // Using the "map" function on the "user.friends" array to create an array of promises.
    // Each promise represents fetching a friend's information by their ID using "User.findById".
    // "Promise.all" waits for all these promises to resolve, resulting in an array of friend documents.
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
    // Using the "map" function on the array of friend documents to create a new array of formatted friend information.
    // Each friend document is destructured to select specific properties (like _id, firstName, etc.).
    // The formatted information is returned as an object for each friend.
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Update

export const addRemoveFriends = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend =await User.findById(friendId);

    if (user.friends.includes(friendId)) {
        // Check if the friendId is already in the user's friends list.
        user.friends = user.friends.filter((id) => id !== friendId);
        // If it is, remove the friendId from the user's friends list.
        friend.friends = user.friends.filter((id) => id !== id);
        // Remove the user's ID from the friend's friends list.
      } else {
        user.friends.push(friendId);
        // If the friendId is not in the user's friends list, add it.
        friend.friends.push(id);
        // Also, add the user's ID to the friend's friends list.
      }
    await user.save();
    await friend.save();

    const friends = await Promise.all(
        user.friends.map((id) => User.findById(id))
      );
      const formattedFriends = friends.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return { _id, firstName, lastName, occupation, location, picturePath };
        }
      );

      res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
