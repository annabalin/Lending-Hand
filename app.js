/*
  app.js -- This creates an Express webserver
*/

// First we load in all of the packages we need for the server...

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const debug = require("debug")("personalapp:server");
var i = 0;
let eventFeed = [];
let user = [];
var zipper;
let zips = [];
const User = require("./models/User");
const Events = require("./models/Events");
var num_events = 0;
// connect to a database

const mongoose = require("mongoose");
const mongodb_URI = process.env.MONGODB_URI; // was 'mongodb://localhost/hsad'
mongoose.connect(mongodb_URI, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("we are connected!!!");
});

const isLoggedIn = (req, res, next) => {
  if (res.locals.loggedIn) {
    next();
  } else res.redirect("/register");
};

// Now we create the server
const app = express();

// Here we specify that we will be using EJS as our view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Here we process the requests so they are easy to handle
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Here we specify that static files will be in the public folder
app.use(express.static(path.join(__dirname, "public")));

// Here we enable session handling ..
app.use(
  session({
    secret: "zzbbyanana789sdfad",
    resave: false,
    saveUninitialized: false
  })
);

app.use(bodyParser.urlencoded({ extended: false }));

const auth = require("./routes/auth");
app.use(auth);
// here we start handling routes
app.get("/", async (req, res, next) => {
  console.log("indexing");
  // If your site is on Cloudflare, then you can use '/cdn-cgi/trace' instead

  res.render("index", { title: "Lending Hand" });
});

/*app.use("/zzz", async (req, res, next) => {
  res.send("hello")})*/
/*app.get("/cancel", (req, res) => {
  res.render("demo");
});*/

app.get("/demo2", (req, res) => {
  res.render("demo");
});
app.get("/testing", (req, res) => {
  res.render("testing");
});
app.get("/viewUserPage/:userId", isLoggedIn, async (req, res, next) => {
  try {
    let userId = req.params.userId;
    let userinfolocal = await User.findOne({ username: userId });
    res.locals.userinfo = await User.findOne({ username: userId });

    if (userinfolocal != null && userinfolocal.username === userId) {
      res.render("externalprofile");
    } else {
      res.redirect("/user-info");
    }
    //    console.log(User.findOne({username: userId}))
  } catch (error) {
    next(error);
  }
});
app.get("/moderatorview", async (req, res, next) => {
  try {
    res.locals.events = await Events.find().sort({ date: 1 });
    res.render("moderatorview");
  } catch (error) {
    next(error);
  }
});
app.get("/reportSearch", async (req, res, next) => {
  try {
    res.locals.events = await Events.find().sort({ reported: 1 });
    res.render("reportSearch");
  } catch (error) {
    next(error);
  }
});
app.post("/deleteAUser", async (req, res, next) => {
  try {
    let usertodelete = req.body.deluser;
    if (
      usertodelete === "5f106e3d4f6f1f2d355f20fb" ||
      usertodelete === "5f075797a87c4a3967960b27" ||
      usertodelete === "5f088f91e0b9122d91d4bac5" ||
      usertodelete === "5f08c55e95292512aacb6606" ||
      usertodelete === "5f0dd6b60235ad4df6e54fe2" ||
      usertodelete === "5f0c7e02f0e8975ab02b7e64" ||
      usertodelete === "5f0c7e02f0e8975ab02b7e64" ||
      usertodelete === "5f07590598b1743ebe6c8df3" ||
      usertodelete === "5f075797a87c4a3967960b27" ||
      usertodelete === "5f08bdb70800b57675618df2" ||
      usertodelete === "5f0758e298b1743ebe6c8df2" ||
      usertodelete === "5f0c6ecdf91a4412e588c4af" ||
      usertodelete === "5f0c6ecdf91a4412e588c4af"
    ) {
      console.log("Error: Cannot delete moderators")
      res.redirect("/moderatorview");
    } else {
      await User.deleteOne({ username: usertodelete }, function(err) {
        if (err) console.log(err);
        console.log("Successful user deletion");
        res.redirect("/moderatorview");
      });
    }
    // maybe res.redirect?
  } catch (error) {
    next(error);
  }
  // "/searchpage".a = req.body.findzip;
});
app.post("/lookupAUser", async (req, res, next) => {
  try {
    res.redirect("viewUserPage/" + req.body.lookup); // maybe res.redirect?
  } catch (error) {
    next(error);
  }
  // "/searchpage".a = req.body.findzip;
});
app.get ("/aboutMarko", (req, res)=>{
  res.render("aboutMarko")
});
app.get ("/aboutSebastian", (req, res)=>{
  res.render("aboutSebastian")
})
app.get("/about", (req, res) => {
  res.render("about");
  
});
app.use("/user-info", async (req, res) => {
  res.locals.eventlist = await Events.find();
  /*
  for( var h = 0; h < res.locals.user.eventslist.length; h++){
        var event = await Events.findOne({_id: res.locals.user.eventslist[h]})
        res.locals.eventlist.concat(event)
      }*/
  res.locals.eventlist = JSON.stringify(
    res.locals.eventlist.map(x => ({ date: x.date, name: x.nameEvent }))
  );
  res.render("user-info");
});
app.get("/glitchbug", (req, res) => {
  res.render("demo");
});
/* THIS WAS NOT HERE ORIGINALLY, it was stuff I added to try to get it to work. Don't uncomment it. 
app.post("/register", (req,res) => {
var user = $('#my-profile').serializeJSON();
  res.locals.myname = user.myname
  res.locals.myage = user.myage
  res.locals.myzip = user.myzip
  res.locals.myemail = user.myemail
})
*/
app.post("/updatepImage", async (req, res, next) => {
  try {
    let UpdateUser = await User.findOne({ _id: req.body.user_id }); //= req.body.profileImage
    UpdateUser.pImage = req.body.profileImage;
    console.log(UpdateUser.pImage);

    await UpdateUser.save();
    res.render("user-info"); // maybe res.redirect?
  } catch (error) {
    next(error);
  }
  // "/searchpage".a = req.body.findzip;
});
app.post("/backgroundPicker", async (req, res, next) => {
  try {
    let UpdateUser = await User.findOne({ _id: req.body.user_id }); //= req.body.profileImage
    UpdateUser.background = req.body.favcolor;

    await UpdateUser.save();
    res.render("user-info"); // maybe res.redirect?
  } catch (error) {
    next(error);
  }
  // "/searchpage".a = req.body.findzip;
});

app.post("/findByZip", async (req, res, next) => {
  try {
    res.locals.events = await Events.find().sort({ date: 1 });
    console.log("findByZip start");
    if (req.body.clearsearch === "on") {
      console.log("clearing");
      zips.length = 0;
    }
    zips = zips.concat(req.body);
    console.log(req.body);
    console.log("doing this");
    for (i = 0; i < zips.length; i++) {
      console.log(zips[i]);
    }

    res.locals.zipp = zips;
    res.render("searchpage");
  } catch (error) {
    next(error);
  }
  // "/searchpage".a = req.body.findzip;
});

function getZipper() {
  return zipper;
}
app.get("/createevent", (req, res) => {
  res.render("createevent");
});

app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/aboutBraedon", (req, res) => {
  res.render("aboutBraedon");
});
app.get("/viewLinkUserPage", (req, res) => {
  res.render("register");
});
app.get("/aboutAnna", (req, res) => {
  res.render("aboutAnna");
});
app.get("/aboutRebecca", (req, res) => {
  res.render("aboutRebecca");
});

app.get ("/aboutBrian", (req, res)=>{
  res.render("aboutBrian")
})
app.get ("/aboutBen", (req, res)=>{
  res.render("aboutBen")
})
app.get("/braedonBio", (req, res) => {
  location.replace = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  res.render("about");
});
//const userZips = require(".models/userZips")
app.get("/searchpage", async (req, res, next) => {
  try {
    res.locals.events = await Events.find().sort({ date: 1 });
    res.locals.postings = Events;
    res.locals.zipp = zips;
    res.render("searchpage");
  } catch (error) {
    next(error);
  }
});

app.get("/showformdata", (request, response) => {
  const data = request.body;
  response.json(data);
});

app.get("/eventfeed", async (req, res, next) => {
  try {
    res.locals.events = await Events.find().sort({ date: 1 });
    res.render("eventfeed");
  } catch (error) {
    next(error);
  }
});
app.get("/eventfeedall", async (req, res, next) => {
  try {
    res.locals.events = await Events.find().sort({ date: 1 });
    //res.locals.user
    res.render("eventfeedall");
  } catch (error) {
    next(error);
  }
});
//That was supposed to be there, somewhere else there is an extra close, or a missing open
app.post("/addToFeed", async (req, res, next) => {
  try {
    //var num = await Events.count()
    //console.log(num)
    const zipcode = req.body.zip;
    const nameOfEvent = req.body.eventName;
    const authorPosting = req.body.author;
    const descr = req.body.description;
    console.log("Poster " + authorPosting);
    const newEvent = new Events({
      //id: Math.random()%100000000,
      maxpeople: req.body.maxpeople,
      sTime: req.body.sTime,
      duration: req.body.duration,
      location: req.body.location,
      zip: zipcode,
      authorId: res.locals.user._id,
      nameEvent: nameOfEvent,
      description: descr,
      author: authorPosting,
      date: req.body.eventdate,
      tag: req.body.tag,
      reports: "",
      reported: 0
    });

    await newEvent.save();
    res.redirect("/eventfeedall");
  } catch (error) {
    next(error);
  }
});

app.post("/tester", (req, res, next) => {
  console.log("test");
});
app.get("/deleteEventPost/:postId", isLoggedIn, async (req, res, next) => {
  try {
    const postId = req.params.postId;
    await Events.deleteOne({ _id: postId });
    res.redirect("/eventfeedall");
  } catch (error) {
    next(error);
  }
});
app.get("/editEventPost/:postId", isLoggedIn, async (req, res, next) => {
  try {
    const postId = req.params.postId;
    res.locals.post = await Events.findOne({ _id: postId });
    res.render("editEventPost");
  } catch (error) {
    next(error);
  }
});
app.get("/reportEventPost/:postId", isLoggedIn, async (req, res, next) => {
  try {
    const postId = req.params.postId;
    res.locals.post = await Events.findOne({ _id: postId });
    res.render("reportEventPost");
  } catch (error) {
    next(error);
  }
});
app.get("/findByTag/:postId", isLoggedIn, async (req, res, next) => {
  try {
    const postId = req.params.postId;
    res.locals.tag = postId
    res.locals.events = await Events.find({ tag: postId });
    res.render("tagsearch");
  } catch (error) {
    next(error);
  }
});

app.get("/userssignedup/:postId", isLoggedIn, async (req, res, next) => {
  try {
    const postId = req.params.postId;
    res.locals.post = await Events.findOne({ _id: postId });
    let event = res.locals.post
    let users = [];
    for (var i = 0; i<event.signed_up_people.length; i++){
      let cur_user = await User.findOne({_id: event.signed_up_people[i]})
       users = users.concat(cur_user);
    }
    //event.signed_up_people.forEach( userid =>
     
   // })
    res.locals.users = users
    res.render("userssignedup");
  } catch (error) {
    next(error);
  }
});

app.get("/editUser/:postId", isLoggedIn, async (req, res, next) => {
  try {
    const postId = req.params.postId;
    res.locals.post = await User.findOne({ _id: postId });
    res.render("editUser");
  } catch (error) {
    next(error);
  }
});
app.post("/updateUser/:postId", isLoggedIn, async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await User.findOne({ _id: postId });
    post.name = req.body.realName;
    post.zip = req.body.userZip;
    post.email = req.body.userEmail;
    post.hours = req.body.userHours;

    await post.save();
    res.redirect("/user-info");
  } catch (error) {
    next(error);
  }
});

app.post("/updateEvent/:postId", isLoggedIn, async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Events.findOne({ _id: postId });
    post.nameEvent = req.body.eventName;
    post.eventdate = req.body.eventdate;
    post.sTime = req.body.sTime;
    post.duration = req.body.duration;
    post.location = req.body.location;
    post.zip = req.body.zip;
    post.maxpeople = req.body.maxpeople;
    post.description=req.body.description;
    await post.save();
    res.redirect("/eventfeedall");
  } catch (error) {
    next(error);
  }
});
app.post("/reportEvent/:postId", isLoggedIn, async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const post = await Events.findOne({ _id: postId });
    post.reports = post.reports.concat(req.body.reason + ", ");
    post.reported++;
    
    await post.save();
    res.redirect("/eventfeedall");
  } catch (error) {
    next(error);
  }
});

app.get("/userssignedup/:postId", isLoggedIn, async (req, res, next) => {
  try {
    const postId = req.params.postId;
    res.locals.post = await User.findOne({ _id: postId });

    res.render("userssignedup");
  } catch (error) {
    next(error);
  }
});


app.post("/removeevent", async (req, res, next) => {
  try {
    res.locals.events = await Events.find().sort({ date: 1 });
    await Events.findByIdAndDelete(req.body.event_id, function(err) {
      if (err) console.log(err);
      console.log("Successful deletion");
      res.render("moderatorview");
    });
  } catch (error) {
    next(error);
  }
});
app.post("/givemeyourid", async (req, res, next) => {
  res.locals.user = await user.find();
  console.log(res.body.userID);
  res.render("index");
});

app.post("/sign_up_to_event", async (req, res, next) => {
  //res.locals.isSignUpClicked=true;
  try {
    //ummm... idk? manifestation time: please work :0
    //Pretty please with a cherry on top! And chocolate sprinkles!
    //and fudge I think it's ice cream time vanilla please! chocolate for me!
    let cur_user = res.locals.user._id;
    let event_id = req.body.event_id;
    let event = await Events.findOne({ _id: event_id });
    let user = await User.findOne({ _id: cur_user });
    event.signed_up_people = await event.signed_up_people.concat(cur_user);
    user.userevents = user.userevents.concat(event_id);
    //console.log(cur_user);
    //console.log(user.userevents);
    event.maxpeople = event.maxpeople - 1;
    user.hours = user.hours || 0;
    user.fillhrs = user.fillhrs || 0;
    user.fillhrs = user.fillhrs + event.duration;
    if( user.fillhrs > user.hours){
      user.fillhrs = user.hours;
    }
    await event.save();
    await user.save();
    res.redirect(req.body.caller);
  } catch (error) {
    next(error);
  }
});
//

app.get("/deleteAll", isLoggedIn, async (req, res, next) => {
  try {
    await Events.deleteMany({}); // here we can delete all the posts
    res.redirect("/moderatorview");
  } catch (error) {
    next(error);
  }
});

app.post("/cancel", async (req, res, next) => {

  try {
    console.log("completing action cancel");
    let cur_user = res.locals.user._id;
    let event_id = req.body.event_id;
    let event = await Events.findOne({ _id: event_id });
    console.log(event.signed_up_people.length);
    console.log(cur_user);

    event.signed_up_people = event.signed_up_people.filter(
      people => people != cur_user
    );
    console.log("deleted");
    console.log(event.signed_up_people.length);
    event.maxpeople = event.maxpeople + 1;
    res.locals.user.fillhrs = res.locals.user.fillhrs - event.duration;
    if( res.locals.user.fillhrs <= 0){
      res.locals.user.fillhrs = 0
    }
    //do delete arrayname[arrayindex];\
    await event.save();
    res.redirect(req.body.caller);
  } catch (error) {
    console.log("catching error");
    next(error);
  }
});

// const isSignUpClicked = (req,res,next) => {
//if (res.locals.isSignUpClicked) {

// }
//}

//event name, event date, starttime, endtime, location, zip, maxpeople, recurevent, description, number, email, password
//there is one event called test event currently
/*let eventPosts = [
  {eventname: 'test', eventdate: '2014-01-01T23:28:56.782Z', starttime: '2:30', endtime: '5:30', location: 'testville', zip: '123456', maxpeople: '25', 
  recurevent: 'yes', description: 'a test event', number: '1234567890', email: '1234@testmail.com', password: 'badpass'}
]
app.post("/addToFeed", (req,res) => {
  req.body.username = res.locals.username
  eventFeed = eventFeed.concat(req.body)
  eventPosts = eventPosts.concat(req.body)
  res.locals.postings = eventPosts 
  res.render("eventfeed")
  //res.json(forumPosts)
})
*/
// Don't change anything below here ...

// here we catch 404 errors and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// this processes any errors generated by the previous routes
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//Here we set the port to use
const port = "5000";
app.set("port", port);

// and now we startup the server listening on that port
const http = require("http");
const server = http.createServer(app);

server.listen(port);

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

server.on("error", onError);

server.on("listening", onListening);

module.exports = app;
