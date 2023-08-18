import Post from "../models/Posts.js";
import User from "../models/User.js";

//create

export const createPost = async(req,res) =>{
    try{
        const {userId,description,picturePath}=req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description: description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: [],
        })
        await newPost.save();

        const post = await Post.find(); // grabbing all the posts.

        res.status(201).json(post);
    }catch(err){
        res.status(409).json({message:err.message});
    }
}


//read

export const getFeedPosts = async(req,res) => {
    try{
        const post = await Post.find();
        res.status(200).json(post);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}

export const getUserPosts = async(req,res) =>{
    try{
        const {userId} = req.params;
        const post = await Post.find({userId});
        res.status(200).json(post);
    }catch(err){
        res.status(404).json({message:err.message});
    }
}


//update

export const likePost = async (req, res) => {
    try {
      const { id } = req.params;  // Destructuring assignment to extract "id" from request parameters.
      const { userId } = req.body;  // Destructuring assignment to extract "userId" from request body.
  
      const post = await Post.findById(id);
      // Using "Post.findById" to retrieve the post document based on the provided "id".
  
      const isLiked = post.likes.get(userId);
      // Using the "get" method to check if the provided "userId" is present in the "likes" Map of the post.
  
      if (isLiked) {
        post.likes.delete(userId);
        // If the "userId" is found in "likes" Map, delete the entry indicating that the user "unliked" the post.
      } else {
        post.likes.set(userId, true);
        // If the "userId" is not found in "likes" Map, add an entry to indicate that the user "liked" the post.
      }
  
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        {
          likes: post.likes,
          new: true,
        }
      );
      // Using "Post.findByIdAndUpdate" to update the post document with the updated "likes" Map.
      // The "new: true" option ensures that the updated post document is returned.
  
      res.status(200).json(updatedPost);
      // Sending a JSON response with the updated post document, which now includes the modified "likes" field.
    } catch (err) {
      res.status(404).json({ message: err.message });
      // If an error occurs during any step above, a 404 status response is sent with an error message in JSON format.
    }
  };
  