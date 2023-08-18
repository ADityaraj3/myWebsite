import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helment from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { register,login } from "./controllers/auth.js";
import { error } from "console";
import bcrypt from "bcrypt";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { createPost } from "./controllers/posts.js";    
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Posts.js";
import { users,posts } from "./data/index.js";
// Configurations

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* 

-- These lines are used to determine the current file's __filename and its corresponding directory __dirname using the 
    fileURLToPath function and the path module from Node.js.
-- import.meta.url gives you the URL of the current module, which is then converted to a filesystem path using fileURLToPath.
-- path.dirname() extracts the directory part from the full file path.

*/

dotenv.config();
/*

-- This line uses the dotenv package to load environment variables from a .env file into process.env.
-- Environment variables are often used to store sensitive information like API keys, database connection strings, etc., 
    without hardcoding them directly into the code.

 */
const app = express();

/*

This line creates an instance of the Express.js web application framework.
Express.js is a popular Node.js framework used for building web applications and APIs.

*/
app.use(express.json());

/*

This line adds middleware to parse incoming JSON requests.
It allows your application to handle JSON data in request bodies.

*/

app.use(helment());
app.use(helment.crossOriginResourcePolicy({ policy: "cross-origin" }));

/*

These lines add security middleware using the helmet package.
helmet is used to set various HTTP headers to improve security by mitigating common security vulnerabilities.
The second line sets the Cross-Origin Embedder Policy header, which helps prevent cross-origin embedding of your site.

*/

app.use(morgan("common"));

/*

This line adds middleware to log incoming requests and responses using the morgan package.
It helps you monitor and debug your application's HTTP traffic.

*/

app.use(bodyParser.json({limit:"30mb",extended:true}));

/*

This line adds middleware using the body-parser package to parse JSON request bodies.
It allows you to limit the size of the request body to 30MB and enables the extended mode to support complex data structures.

*/

app.use(cors());

/*

This line adds middleware to handle Cross-Origin Resource Sharing (CORS) using the cors package.
CORS is a security feature that controls which domains can make requests to your server.

*/

app.use("/assets",express.static(path.join(__dirname,'public/assets')));

/*

This line serves static files from the public/assets directory under the /assets URL path.
It allows you to serve files like images, stylesheets, and JavaScript files to the client.

*/

// File Storage

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"public/assets");
    },
    filename:function(req,file,cb){
        cb(null,file.originalname);
    },
});
 
const upload = multer({storage});

// Routes with files

app.post("/auth/register", upload.single("picture"), register);
// We are gonna hit "/auth/register" route and then we will upload our picture locally in our public/assets folder this is a middleware
// as it occurs before our logic and after we set up the hit point... register in just the logic of endpoint
app.post("/posts",verifyToken,upload.single("picture"), createPost);


// Routes

app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/posts",postRoutes);
// Mongoose Setup

const PORT = process.env.PORT    ; 
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
}).then(() => {
    app.listen(PORT, () => {
        console.log(`Server Port : ${PORT}`);
    });
    // Add data one time
    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((error) => {
    console.log(`${error} did not connect`);
});