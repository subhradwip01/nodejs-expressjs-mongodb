const bcrypt = require("bcryptjs");

const User = require("../models/user");

const crypto = require("crypto");

const { validationResult } = require("express-validator/check");

exports.getLogin = (req, res, next) => {
  // const isLoggedIn=req.get("Cookie").split("=")[1].trim();
  let messageE = req.flash("error");
  let message = null;
  if (messageE.length > 0) {
    message = messageE[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  // setting up the cookie for the loggied in user
  // res.setHeader("Set-Cookie","isLoggedIn=true; HttpOnly");
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid Email or Password");
        return res.redirect("/login");
      }
      return bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            req.flash("error", "Invalid Password");
            return res.redirect("/login");
          }
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save((e) => {
            console.log(e);
            res.redirect("/");
          });
        })
        .catch((err) => {
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let messageE = req.flash("error");
  let message = null;
  if (messageE.length > 0) {
    message = messageE[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: message,
    email:null,
    password:null
  });
};
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.cpassword;
  const error=validationResult(req);
  console.log(error)
  if(!error.isEmpty()){
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Login",
      isAuthenticated: req.session.isLoggedIn,
      errorMessage: error.array()[0].msg,
      email:email,
      password:password,
    })
  }

      bcrypt
        .hash(password, 12)
        .then((hashPassword) => {
          const user = new User({
            email: email,
            password: hashPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        }).catch(e=>{
          console.log(e)
        });
};

exports.getReset = (req, res, next) => {
  let messageE = req.flash("error");
  let message = null;
  if (messageE.length > 0) {
    message = messageE[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset",
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;
  console.log(email);
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account found with this email");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save().then((result) => {
          // send reset link via mail by using any mail server
          console.log(`http://localhost:3000/reset/${token}`);
          res.redirect("/reset");
        });
      })
      .catch((e) => {
        console.log(e);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.redirect("/get404");
      }
      let messageE = req.flash("error");
      let message = null;
      if (messageE.length > 0) {
        message = messageE[0];
      } else {
        message = null;
      }
      return res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        isAuthenticated: req.session.isLoggedIn,
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.postNewPassword = (req, res, next) => {
  const userId = req.body.userId;
  console.log(userId);
  const password = req.body.password;
  const passwordToken = req.body.passwordToken;
  console.log(passwordToken);
  User.findOne({
    _id: userId,
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        console.log(user);
        return res.redirect("/get404");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          user.password = hashedPassword;
          user.resetToken = null;
          user.resetTokenExpiration = null;
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
        });
    })

    .catch((e) => {
      console.log(e);
    });
};
