require("dotenv").config();
var express = require("express");
var http = require("http");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
var mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const helmet = require("helmet");
const User = require("./models/User");
var passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const localStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const postRouter = require("./routes/posts");
const messageRouter = require("./routes/message");

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.create({
          username,
          password,
        });
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
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true,
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (req, accessToken, refreshToken, profile, done) {
      User.findOrCreate(
        { googleId: profile.id, username: profile.id },
        function (err, user) {
          return done(err, user);
        }
      );
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user._id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, (err, user) => {
    console.log(user);
    done(err, user);
  });
});
// var mongodb = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.g2wlz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
var mongodb = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0-shard-00-00.g2wlz.mongodb.net:27017,cluster0-shard-00-01.g2wlz.mongodb.net:27017,cluster0-shard-00-02.g2wlz.mongodb.net:27017/?ssl=true&replicaSet=atlas-tjc03g-shard-0&authSource=admin&retryWrites=true&w=majority`;

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
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.disable("x-powered-by");
app.use(multerMid.single("file"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);
app.use("/message", messageRouter);
app.use(function (req, res) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "developement" ? err : {};
  console.log(error);
  res.status(err.status || 500);
});
var http = http.Server(app);
var io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  //join a conversation
  const { chatId } = socket.handshake.query;
  // console.log("CHATID", chatId);
  // console.log("SOCKETID",socket.id);
  socket.join(chatId);
  // socket.on("newChatMessage", (data) => {
  //   io.in(chatId).emit("newChatMessage", data);
  // });
  //private message
  socket.on("newChatMessage", (userId, data) => {
    console.log("here", data);
    socket.to(userId).emit("newChatMessage", data);
  });

  //leave if user closes socket
  socket.on("disconnect", () => {
    socket.leave(chatId);
  });
});
// app.listen(3001, () => console.log("connected on 3001"));
http.listen(process.env.PORT || 3001, () => console.log("connected on 3001"));
