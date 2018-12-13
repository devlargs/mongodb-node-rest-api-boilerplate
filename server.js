const express = require("express");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const debug = require("debug")("myapp:server");
const http = require("http");
const cors = require("cors");

const index = require("./routes/index");
const api = require("./routes/api");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(bodyParser.json({ parameterLimit: 10000, limit: 1024 * 1024 * 50 }));
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 10000, limit: 1024 * 1024 * 50 }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.options("*", cors());

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
})

app.use("/", index);
app.use("/api", api);

app.use((_, _, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string"
    ? "Pipe " + port
    : "Port " + port;

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

const  onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string"
    ? "pipe " + addr
    : "port " + addr.port;
  debug("Listening on " + bind);
}


const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

const port = normalizePort(process.env.PORT || "1234");
app.set("port", port);
const server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);