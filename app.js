const createError = require("http-errors");
const express = require("express");
const favicon = require('serve-favicon');
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const handlebars = require("express-handlebars");
const indexRouter = require("./routes/index");

// import our db
const db = require('./config/db');
const app = express();
const cors = require('cors');
var flash = require('express-flash');

// sessions
var sessions = require('express-session');
var mysqlSession = require('express-mysql-session')(sessions);

// sessions set up 
var mysqlSessionStore = new mysqlSession (
  {
    /* Using default options empty object */
  }
  ,require('./config/db')
)
// use sessions
app.use(sessions({
  key: "csid",
  secret: "secret word",
  store: mysqlSessionStore,
  resave: false,
  saveUninitialized: true
}));


app.use((req,res, next) => {
  console.log(req.session)
  // console.log();
  if (req.session.username){
    res.locals.logged = true;
  }
  next();
})

// flash
app.use(flash());


// handle bars setup
app.engine(
  "hbs",
  handlebars({
    layoutsDir: path.join(__dirname, "views/layouts"), //where to look for layouts
    partialsDir: path.join(__dirname, "views/partials"), // where to look for partials
    extname: ".hbs", //expected file extension for handlebars files
    defaultLayout: "layout", //default layout for app, general template for all pages in app
    helpers: {}, //adding new helpers to handlebars for extra functionality
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");


app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())

// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use("/public", express.static(path.join(__dirname, "public")));


// connect to our routes 
app.use(require('./routes/')) 

/**
 * Catch all route, if we get to here then the 
 * resource requested could not be found.
 */
app.use((req,res,next) => {
  next(createError(404, `The route ${req.method} : ${req.url} does not exist.`));
})
  

/**
 * Error Handler, used to render the error html file
 * with relevant error information.
 */
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});



// live port
const port = 3001;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})


module.exports = app;
