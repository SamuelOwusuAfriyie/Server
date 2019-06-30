const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const path = require('path');
//import routers
const postsRouter = require("./routes/post.js");
const postItemsRouter = require("./routes/postItems.js");

//connect mongoose
mongoose.connect("mongodb://localhost/postdb", {useMongoClient: true});
mongoose.Promise = global.Promise;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use(cookieParser())
app.use(express.static('../kumasi-kejetia/build'));
app.use("/post", postsRouter);
app.use("/postItems", postItemsRouter);
// app.get('**',(req, res)=>{
//     res.sendFile(path.resolve(__dirname,"../", 'kumasi-kejetia', 'build', 'index.html'))
// })
app.use(express.static('public'))
app.use(express.static('public/uploads'))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('../kumasi-kejetia/build'));
  // app.get(' ** ', (req, res) => {
  //   res.sendFile(path.resolve(__dirname, "../", 'kumasi-kejetia', 'build', 'index.html'))
  // })
}

let port = process.env.Port || 9000;
app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
