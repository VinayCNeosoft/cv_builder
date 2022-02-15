const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const nodemailer = require("nodemailer");
const cred = require("../env");
const jwt = require("jsonwebtoken");
const jwtSecret = "abcdefghijklmnopqrstuvwxyzzyxwvu";
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const createInvoice = require("../helper/invoiceGen");
const sendmail = require("../helper/sendmail");

//define model
const userModel = require("../models/userSchema");
const tokenModel = require("../models/tokenSchema");
const pdfModel = require("../models/pdfSchema");

//define storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../profile_pic"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + file.originalname.match(/\..*$/)[0]
    );
  },
});

//
const multi_upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error("Only .png, .jpg and .jpeg format allowed!");
      err.name = "ExtensionError";
      return cb(err);
    }
  },
}).array("profileImg", 1);

//authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; //split the token
  if (token === null) {
    res.json({ success: true, message: "Token not Found" });
  } else {
    jwt.verify(token, jwtSecret, (err) => {
      if (err) {
        res.json({ success: false, message: "Token incorrect" });
      } else {
        console.log("Token Match");
        next();
      }
    });
  }
}

//create route
router.post("/register", (req, res) => {
  multi_upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res
        .status(500)
        .send({ error: { message: `Multer uploading error1: ${err.message}` } })
        .end();
      return;
    } else if (err) {
      if (err.name == "ExtensionError") {
        res.json({ err: err.name });
      } else {
        console.log(err.message);
        res
          .status(500)
          .send({
            error: { message: `unknown uploading error: ${err.message}` },
          })
          .end();
      }
      return;
    }
    console.log(req.files);
    console.log(req.body);
    const url =
      req.protocol + "://" + req.get("host") + "/" + req.files[0].filename;
    console.log(url);
    console.log(req.body);
    let ufname = req.body.first_name;
    let ulname = req.body.last_name;
    let uemail = req.body.email;
    let logo = url;
    userModel.findOne({ email: req.body.email }, function (err, user) {
      // Make sure user doesn't already exist
      if (user)
        return res.status(400).send({
          msg: "The email address you have entered is already associated with another account.",
        });
    });
    //create and save the user
    user = new userModel({
      fname: req.body.first_name,
      lname: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      logo: url,
    });
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(req.body.password, salt, function (err, hash) {
        if (err) throw err;
        user.password = hash;
        user.save(function (err) {
          if (err) {
            return res.json({
              success: false,
              status_code: 500,
              message: err.message,
            });
          }

          // Create a verification token for this user
          var token = new tokenModel({
            _userId: user._id,
            token: crypto.randomBytes(16).toString("hex"),
          });
          // Save the verification token
          token.save(function (err) {
            if (err) {
              res.json({
                success: false,
                status_code: 500,
                message: err.message,
              });
            }
            // Send the email
            var transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: cred.email,
                pass: cred.password,
              },
            });
            var mailOptions = {
              from: cred.email,
              to: user.email,
              subject: "Account Verification Token",
              text:
                "Hello," +
                "Please verify your account by clicking the link: http://localhost:3000/verify_email",
              //text: 'Hello,' + 'Please verify your account by clicking the link: http://' + req.headers.host + '/confirmation/' + token.token + ''
            };
            transporter.sendMail(mailOptions, function (err) {
              if (err) {
                return res.json({
                  success: false,
                  status_code: 500,
                  message: err.message,
                });
              } else {
                return res.json({
                  success: true,
                  status_code: 200,
                  message: "A verification email has been sent to " + uemail,
                });
              }
            });
          });
          res.json({
            success: true,
            status_code: 200,
            message: `${ufname} ${ulname} Registered Successfully`,
            email_verification_token: token.token,
          });
        });
      });
    });
    //})
  });
});

router.post("/login", (req, res) => {
  console.log(req.body);
  //check for existing user
  const { email, password } = req.body;
  userModel.findOne({ email }).then((user) => {
    if (!user)
      return res.json({
        success: false,
        status: 400,
        err: 1,
        message: "User does not exist ! If you are New USER register first.",
      });

    // Validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch)
        return res.json({
          success: false,
          status: 400,
          message: "Invalid Password",
        });
      // Make sure the user has been verified
      if (!user.isVerified)
        return res.json({
          success: false,
          status: 401,
          type: "not-verified",
          message:
            "Your account has not been verified yet ! Please Verify first and Try again !",
        });
      else {
        let payload = {
          uid: email,
        };
        console.log(user);
        const token = jwt.sign(payload, jwtSecret, { expiresIn: 3600 });
        res.json({
          success: true,
          status_code: 200,
          message: `${email} have logged In`,
          token: token,
          user,
        });
      }
    });
  });
});

//verify mail
router.post("/email_Verification/:email", (req, res) => {
  console.log(req.body);
  console.log(req.params.email);

  tokenModel.findOne({ token: req.body.eToken }, function (err, token) {
    if (!token) {
      return res.json({
        success: false,
        status_code: 400,
        type: "not-verified",
        message: `We were unable to find a valid token. Your token may have expired ! try to resend it and Try again.`,
      });
    }

    // If we found a token, find a matching user
    userModel.findOne(
      { _id: token._userId, email: req.params.email },
      function (err, user) {
        if (!user)
          return res.json({
            success: false,
            status_code: 400,
            type: "not-verified",
            message: "We were unable to find a user for this token.",
          });
        if (user.isVerified)
          return res.json({
            success: false,
            status_code: 400,
            type: "already-verified",
            message: `${req.params.email} has already been verified.Try Login !`,
          });
        // Verify and save the user
        user.isVerified = true;
        user.save(function (err) {
          if (err) {
            return res.json({
              success: false,
              status_code: 500,
              message: err.message,
            });
          }
          res.json({
            success: true,
            status_code: 200,
            message: "The account has been verified. Please log in.",
          });
        });
      }
    );
  });
});

//verify email state
router.get("/verifyState/:email", (req, res) => {
  console.log(req.params.email);
  console.log("Fetching Email Verification State....");
  userModel.findOne({ email: req.params.email }, (err, data) => {
    console.log(data.isVerified);
    state = data.isVerified;
    if (err) throw err;
    //res.send(data)
    else res.json({ success: true, state });
  });
});

//resend verify mail
router.post("/email_Verification", (req, res) => {
  console.log(req.body.email);
  uemail = req.body.email;
  userModel.findOne({ email: req.body.email }, function (err, user) {
    if (!user)
      return res.json({
        success: false,
        status_code: 400,
        type: "not-verified",
        message: "We were unable to find a user for this token.",
      });
    if (user.isVerified)
      return res.json({
        success: false,
        status_code: 400,
        type: "already-verified",
        message: `${req.body.email} has already been verified.Try Login !`,
      });
    const newToken = crypto.randomBytes(16).toString("hex");
    tokenModel.updateOne(
      { _userId: user._id },
      {
        $set: {
          token: newToken,
        },
      },
      (err) => {
        if (err) throw err;
        else {
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: cred.email,
              pass: cred.password,
            },
          });
          var mailOptions = {
            from: cred.email,
            to: user.email,
            subject: "Account Verification Token",
            text:
              "Hello," +
              "Please verify your account by clicking the link: http://localhost:3000/verify_email",
            //text: 'Hello,' + 'Please verify your account by clicking the link: http://' + req.headers.host + '/confirmation/' + token.token + ''
          };
          transporter.sendMail(mailOptions, function (err) {
            if (err) {
              return res.json({
                success: false,
                status_code: 500,
                message: err.message,
              });
            } else {
              return res.json({
                success: true,
                status_code: 200,
                message: "A verification email has been sent to " + uemail,
              });
            }
          });
          res.json({
            success: true,
            status_code: 200,
            message: `A verification email has been sent to ` + uemail,
            email_verification_token: newToken,
          });
          console.log("New Token value updated");
        }
      }
    );
  });
});

//forget Password
router.post("/forgetpassword", (req, res) => {
  //console.log(req.body.email)
  let rmail = req.body.email;
  console.log(rmail);
  if (req.body === "") {
    res.json({ success: false, status_code: 400, message: "Email Required" });
  }
  userModel.findOne({ email: rmail }).then((user) => {
    if (user === null) {
      console.error("email not in database");
      res.json({
        success: false,
        status_code: 403,
        message: "email not in DB",
      });
    } else {
      function generateOTP() {
        var minm = 100000;
        var maxm = 999999;
        return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
      }
      let otp = generateOTP();
      console.log(otp);
      userModel.updateOne(
        { email: rmail },
        {
          $set: {
            resetPasswordToken: otp,
          },
        },
        (err) => {
          if (err) throw err;
          else {
            res.json({
              success: true,
              status_code: 200,
              message: `Successfully sent OTP to ${rmail}`,
              otp: otp,
            });
            console.log("Otp stored in db");
          }
        }
      );
      sendmail(otp, rmail);
    }
  });
});

//reset password
router.put("/resetpassword", (req, res) => {
  console.log(req.body);
  let otp = req.body.otp;
  let password = req.body.password;
  console.log(otp);
  console.log(password);
  if (req.body === "") {
    res.json({
      success: false,
      status_code: 400,
      message: "Please Fill Data first",
    });
  }
  userModel.findOne({ resetPasswordToken: otp }).then((user) => {
    if (user === null) {
      res.json({
        success: false,
        status_code: 403,
        message: "Invalid OTP please enter valid OTP",
      });
    } else {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
          userModel.updateOne(
            { resetPasswordToken: otp },
            {
              $set: {
                password: hash,
              },
            },
            (err) => {
              if (err) throw err;
              else {
                res.json({
                  success: true,
                  status_code: 200,
                  message: `Password Reset Successfully for ${user.email}`,
                });
                console.log("Otp stored in db");
              }
            }
          );
        });
      });
    }
  });
});

//user profile with token
router.get("/getCustomerProfile/:uid", authenticateToken, (req, res) => {
  console.log(req.params.uid);
  console.log("Customer Data Fetching....");
  userModel.findOne({ email: req.params.uid }, (err, data) => {
    console.log(JSON.stringify(data));
    if (err) throw err;
    //res.send(data)
    else res.json({ success: true, data });
  });
});

//create order or add order
router.post("/addDataToPdf/:uid", async (req, res) => {
  let u = Math.random();
  let d = Date.now();
  console.log(req.params.uid);
  console.log(req.body);
  const { profile, education, experience, project, skill, socialProfile } =
    req.body;
  const myPdf = {
    pdfNumber: d,
    profile: profile,
    education: education,
    experience: experience,
    project: project,
    skill: skill,
    socialProfile: socialProfile,
  };
  createInvoice(
    myPdf,
    `E:/mern_cv_builer/backend/cv/${u}-${req.body.profile.first_name}-cv` +
      ".pdf"
  );
  let rmail = req.body.profile.email;
  /* sendmail(
    `E:/mern_cv_builer/backend/cv/${u}_${req.body.profile.first_name}_cv` +
      ".pdf",
    rmail
  ); */
  let oldUser = await pdfModel.findOne({ email: req.params.uid });
  if (oldUser !== null) {
    const data = await pdfModel.findOneAndUpdate(
      { email: req.params.uid },
      {
        $push: {
          pdfData: myPdf,
        },
      }
    );
    res.json({
      success: true,
      status_code: 200,
      message: "User data Updated Successfully",
    });
  } else {
    pdf = new pdfModel({ email: req.params.uid, pdfData: myPdf });
    pdf.save(function (err) {
      if (err) {
        return res.json({
          success: false,
          status_code: 500,
          message: err.message,
        });
      }
      res.json({
        success: true,
        status_code: 200,
        message: "Cv created   and data stored inside DB",
      });
    });
  }
});

//fetch all PDF Created by user
router.get("/getPdfDetails/:uid", (req, res) => {
  console.log(req.params.uid);
  console.log(`Fetching PDF Data for ${req.params.uid} ...`);
  pdfModel.findOne({ email: req.params.uid }, function (err, pdfData) {
    // Make sure order already exist
    console.log(pdfData);
    if (pdfData) {
      pdfModel.findOne({ email: req.params.uid }, (err, data) => {
        console.log(data.pdfData);
        if (err) throw err;
        //res.send(data)
        else res.json({ success: true, message: "PDF Data Fetched", data });
      });
    } else {
      res.json({ success: false, message: "No pdf found" });
    }
  });
});

////update CV
router.put("/editCv", authenticateToken, async (req, res) => {
  console.log(req.body);
  const { profile, education, experience, project, skill, socialProfile, id } =
    req.body;
  const data = await pdfModel.findOneAndUpdate(
    { "pdfData.pdfNumber": id },
    {
      $set: {
        "pdfData.$.profile": profile,
        "pdfData.$.education": education,
        "pdfData.$.experience": experience,
        "pdfData.$.project": project,
        "pdfData.$.skill": skill,
        "pdfData.$.socialProfile": socialProfile,
      },
    }
  );
  if (data !== {}) {
    res.json({
      success: true,
      status_code: 200,
      message: `CV Updated Successfully`,
    });
    console.log("CV Updated in db");
  } else {
    res.json({ success: false, status_code: 200, message: `CV Not Updated` });
  }
});

module.exports = router;
