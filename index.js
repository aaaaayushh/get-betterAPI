require("dotenv").config();
var express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
var mongoose = require("mongoose");
const helmet = require("helmet");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("./models/User");

var passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const authRouter = require("./routes/auth");
passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.create({ username, password });
        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        const validate = await user.isValidPassword(password);
        if (!validate) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user, { message: "Login successful" });
      } catch (err) {
        return done(err);
      }
    }
  )
);
passport.use(
  new JWTstrategy(
    {
      secretOrKey: "secret",
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },

    async (token, done) => {
      try {
        return done(null, user.token);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "124435339268-1ga1pq3hmku8pcfgqrs6bnka86cv6v9r.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/google/callback",
      passReqToCallback: true,
    },
    function (req, accessToken, refreshToken, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
var mongodb = `mongodb+srv://aaaaayush:aayush@cluster0.g2wlz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "mongodb connection error"));

var app = express();
app.use(helmet());
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use(function (req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "developement" ? err : {};
  console.log(error);
  res.status(err.status || 500);
});
app.listen(3000, () => console.log("connected on 3000"));
