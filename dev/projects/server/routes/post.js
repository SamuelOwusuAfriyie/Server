const {Router} = require("express");
const Post = require("../models/post.js");
const nodemailer = require('nodemailer');
const multer = require('multer');

const postsRouter = Router();

postsRouter.route("/").get((req, res) => {
  Post.find(req.query, (err, data) => {
    if (err) {
      res.status(500).send({message: "Error on server", error: err});
    } else if (data === null) {
      res.status(404).send({message: "Error, did not find any items to match your query"});
    } else {
      res.status(200).send({message: "Success, here is your data", data});
    }
  });
})







postsRouter.route("/").post((req, res) => {
  let newPost = new Post(req.body);

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail', port: 25, secure: false, // true for 465, false for other ports
      auth: {
        user: 'nightmarketkejetia@gmail.com', // generated ethereal user
        pass: 'kejetiaborgar' // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Kejetia Night Market" <nightmarketkejetia@gmail.com>', // sender address
      to: `${req.body.email}`, // list of receivers
      subject: 'Kejetia Night Market Comfirm Email', // Subject line
      text: `${req.body.id}`, // plain text body
      html: `<h2>Hi ${req.body.firstName}</h2><br/><h4>your confirmation code is  ${req.body.id}</h4> <br/><p> thank you</p>` // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  });
  newPost.save((err, data) => {
    if (err) {
      res.status(400).send({message: "Error", error: err});
      return;
    } else {
      res.status(200).send({message: "Success, post was made", data: data});
      return;
    }
  });
})



















var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, ' ./../uploads')
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+'.jpg')
  }
})

var upload = multer({storage: storage}).single('profileImage');




postsRouter.post('/items', function(req, res) {


  upload(req, res, function(err) {
    if(err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
res.send({message: "Multer error occurred when uploading", data: err})
    } else if (err) {
      // An unknown error occurred when uploading.
      res.send({message: "unknown error occurred when uploading", data: err})
    }

    // Everything went fine.

  })
})

postsRouter.route("/item").post((req, res) => {
  let newPost = new Post(req.body);
  newPost.save((err, data) => {
    if (err) {
      res.status(400).send({message: "Error", error: err});
      return;
    } else {
      res.status(200).send({message: "Success, post was made", data: data});


      return;
    }
  });
})








postsRouter.route("/setcookies").post((req , res)=>{

if(req.body.logout ){
  res.clearCookie('auth').send({message: 'Unauthorized'});

}else if (req.body._id){
  Post.findOne(req.body,(err , data)=>{
    //setting cookies
    let response = data;

    req.cookies.auth = data;
    //setting cookie
    res.cookie('auth', data,{expire: 360000 + Date.now()}).send({message:'authorized' , data});

  })
  } else {

      if(!req.cookies.auth){
        res.send(200,{message: 'Unauthorized'})
      }else if(req.cookies.auth){

        console.log('am here',req.cookies.auth);
        const info =req.cookies.auth
        res.send({message:'authorized',data:info});
      }else {
        res.status(200).send({message:'else'})
      }
  }
})



postsRouter.route("/:id").get((req, res) => {
  let id = req.params.id;
  Post.findOne({
    "_id": id
  }, (err, data) => {
    if (err) {
      res.status(500).send({message: "Error in server", error: err});
    } else if (data === null) {
      res.status(404).send({message: `Error, no item with id of ${id} was found`});
    } else {
      res.status(200).send({message: `Success, item with id of ${id} was found`, data});
    }
  });
}).delete((req, res) => {
  let id = req.params.id;
  Post.findByIdAndRemove({
    "_id": id
  }, (err, data) => {
    if (err) {
      res.status(500).send({message: "Error in server", error: err});
    } else if (data === null) {
      res.status(404).send({message: `Error, no item with id of ${id} was found`});
    } else {
      res.status(200).send({message: `Success item with id of ${id} was deleted`, data});
    }
  });// code Comfirmation route
}).put((req, res) => {
  let id = req.params.id;
  Post.findByIdAndUpdate({
    "_id": id
  }, req.body, (err, data) => {
    if (err) {
      res.status(500).send({message: "Error in server", error: err});
    } else if (data === null) {
      res.status(404).send({message: `Error, no item with id of ${id} was found`});
    } else {
      //setting cookies
      let response = data;
      res.cookie('auth' , response);
      //setting cookie
      res.status(200).send({message: `authorized`, data});
    }
  });
})

postsRouter.put("/up/:id", (req, res) => {
  let id = req.params.id;
  Post.findOne({
    "_id": id
  }, (err, data) => {
    if (err) {
      res.status(500).send({message: "Error on server", error: err});
    } else if (data === null) {
      res.status(404).send({message: `Error, no item with id of ${id} was found`});
    } else {
      let {upvotes} = data;
      Post.findByIdAndUpdate({
        "_id": id
      }, {
        $set: {
          upvotes: upvotes + 1
        }
      }, (err, data) => {
        if (err) {
          res.status(500).send({message: "Error on server", error: err});
        } else if (data === null) {
          res.status(404).send({message: `Error, no item with id of ${id} was found`});
        } else {
          res.status(200).send({message: `Success, item with id of ${id} was upvoted`});
        }
      });
    }
  });
});



postsRouter.put("/down/:id", (req, res) => {
  let id = req.params.id;
  Post.findOne({
    "_id": id
  }, (err, data) => {
    if (err) {
      res.status(500).send({message: "Error on server", error: err});
    } else if (data === null) {
      res.status(404).send({message: `Error, no item with id of ${id} was found`});
    } else {
      let {downvotes} = data;
      Post.findByIdAndUpdate({
        "_id": id
      }, {
        $set: {
          downvotes: downvotes + 1
        }
      }, (err, data) => {
        if (err) {
          res.status(500).send({message: "Error on server", error: err});
        } else if (data === null) {
          res.status(404).send({message: `Error, no item with id of ${id} was found`});
        } else {
          res.status(200).send({message: `Success, item with id of ${id} was downvoted`});
        }
      });
    }
  });
});

module.exports = postsRouter;
