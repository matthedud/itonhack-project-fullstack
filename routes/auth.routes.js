import mongoose from "mongoose"
import { Router } from "express"

import User from "../models/User.model.js"

import isLoggedOut from "../middleware/isLoggedOut.js"
import isLoggedIn from "../middleware/isLoggedIn.js"

import bcryptjs from "bcryptjs"

const saltRounds = 10;
const router = new Router();

//////// SIGN UP /////////
router.get("/signup", isLoggedOut, (req, res) => res.render("auth/signup"));

router.post("/signup", isLoggedOut, async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.render("auth/signup", {
        errorMessage:
          "All fields are mandatory. Please provide your username, email and password.",
      });
      return;
    } else {
      const userNameExist = await User.findOne({ username });
      if (userNameExist) {
        res.render("auth/signup", {
          errorMessage: "Oups this username already exists :(",
        });
      } else {
        const salt = await bcryptjs.genSalt(saltRounds);
        const hashedPassword = await bcryptjs.hash(password, salt);
        await User.create({
          username,
          email,
          password: hashedPassword,
        });
        req.session.user = userNameExist;
        res.redirect("/user/userProfile");
      }
    }
  } catch (error) {
    console.log(error);
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(500).render("auth/signup", { errorMessage: error.message });
    } else {
      next(error);
    }
  }
});

//////// LOG IN /////////
router.get("/login", isLoggedOut, (req, res) => res.render("auth/login"));

router.post("/login", isLoggedOut, async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.render("auth/login", {
        errorMessage: "Please enter both, username and password to login.",
      });
      return;
    } else {
      const userNameExist = await User.findOne({ username: username });
      if (!userNameExist) {
        res.render("auth/login", {
          errorMessage: "Oups this username doesn't exist :(",
        });
      } else {
        const correctPassword = await bcryptjs.compare(
          password,
          userNameExist.password
        );
        if (correctPassword) {
          req.session.user = userNameExist;
          res.redirect("/user/userProfile");
        } else {
          res.render("auth/login", {
            errorMessage: "Oups wrong password :(",
          });
        }
      }
    }
  } catch (error) {
    next(error);
  }
});

// router.get("/userProfile", (req, res) => {
//   res.render("users/user-profile", { user: req.session.user });
// });

router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

export default router;
