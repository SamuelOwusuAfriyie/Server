const {Router} = require("express");
const PostItems = require("../models/postItems.js");
//const nodemailer = require('nodemailer');
const multer = require('multer');
const uuid = require('uuid');

const postItemsRouter = Router();

postItemsRouter.route("/").get((req, res) => {
  PostItems.find(req.query, (err, data) => {
    if (err) {
      res.status(500).send({message: "Error on server", error: err});
    } else if (data === null) {
      res.status(404).send({message: "Error, did not find any items to match your query"});
    } else {
      res.status(200).send({message: "Success, here is your data", data});
    }
  });
})

postItemsRouter.route("/itemInfo").post((req, res) => {
  const itemInfo = req.body;

  let newPostItems = new PostItems(req.body);

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing

  newPostItems.save((err, data) => {
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
    cb(null, ' ./../public/uploads')
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + req.params.uuid + '.jpg')
  }
})

var upload = multer({storage: storage}).single('profileImage');

postItemsRouter.post('/items/:uuid', function(req, res) {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.send({message: "Multer error occurred when uploading", data: err})
    } else if (err) {
      // An unknown error occurred when uploading.
      res.send({message: "unknown error occurred when uploading", data: err})
    } else {
      res.send({message: "uploaded successfully"})
    }

    // Everything went fine.
  })
})
postItemsRouter.route('/countItem').post((req , res)=>{
if(req.body.id === null || req.body.id === undefined){
  let cart = req.cookies.cart
  res.cookie('cart',cart);
  req.cookies.cart = cart
  res.status(200).send({cart});
}else if(req.cookies && req.cookies.cart){
      let cart = [...req.cookies.cart]
      cart.push(req.body.id)
    res.cookie('cart',cart);
    req.cookies.cart = cart
    res.status(200).send({cart});
  }else {
    res.cookie('cart',[req.body.id]);
    res.status(200).send([req.body.id]);
    req.cookies.cart = [req.body.image_id]
  }
})

postItemsRouter.route("/item").post((req, res) => {
  let newPostItems = new PostItems(req.body);
  newPostItems.save((err, data) => {
    if (err) {
      res.status(400).send({message: "Error", error: err});
      return;
    } else {
      res.status(200).send({message: "Success, post was made", data: data});
      return;
    }
  });
})

postItemsRouter.route("/:id").get((req, res) => {
  let id = req.params.id;
  PostItems.findOne({
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
  PostItems.findByIdAndRemove({
    "_id": id
  }, (err, data) => {
    if (err) {
      res.status(500).send({message: "Error in server", error: err});
    } else if (data === null) {
      res.status(404).send({message: `Error, no item with id of ${id} was found`});
    } else {
      res.status(200).send({message: `Success item with id of ${id} was deleted`, data});
    }
  });
}).put((req, res) => {
  let id = req.params.id;
  PostItems.findByIdAndUpdate({
    "_id": id
  }, req.body, (err, data) => {
    if (err) {
      res.status(500).send({message: "Error in server", error: err});
    } else if (data === null) {
      res.status(404).send({message: `Error, no item with id of ${id} was found`});
    } else {
      res.status(200).send({message: `Success, item with id of ${id} was updated`, data});
    }
  });
})

postItemsRouter.put("/up/:id", (req, res) => {
  let id = req.params.id;
  PostItems.findOne({
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

postItemsRouter.put("/down/:id", (req, res) => {
  let id = req.params.id;
  PostItems.findOne({
    "_id": id
  }, (err, data) => {
    if (err) {
      res.status(500).send({message: "Error on server", error: err});
    } else if (data === null) {
      res.status(404).send({message: `Error, no item with id of ${id} was found`});
    } else {
      let {downvotes} = data;
      PostItems.findByIdAndUpdate({
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

//
//
// ////////////////////////////////////////////////////////
//
// nodemailer.createTestAccount((err, account) => {
//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     service: 'gmail', port: 25, secure: false, // true for 465, false for other ports
//     auth: {
//       user: 'greatman662@gmail.com', // generated ethereal user
//       pass: 'bliza4261996' // generated ethereal password
//     },
//     tls: {
//       rejectUnauthorized: false
//     }
//   });
//
//   // setup email data with unicode symbols
//   let mailOptions = {
//     from: '"Kejetia Night Market" <greatman662@gmail.com>', // sender address
//     to: `${req.body.email}`, // list of receivers
//     subject: 'Kejetia Nigth Market Comfirm Email', // Subject line
//     text: `${req.body.id}`, // plain text body
//     html: `<h2>Hi ${req.body.firstName}</h2><br/><h4>your confirmation code is  ${req.body.id}</h4> <br/><p> thank you</p>` // html body
//   };
//
//   // send mail with defined transport object
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return console.log(error);
//     }
//     console.log('Message sent: %s', info.messageId);
//     // Preview only available when sending through an Ethereal account
//     console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//
//     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
//     // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
//   });
// });

///////////////////////////////////////////////////////

module.exports = postItemsRouter;
