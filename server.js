const express = require("express"),
	 	hbs = require("express-handlebars"),
		path = require("path"),
	 	bodyParser = require("body-parser"),
	 	favicon = require("serve-favicon"),
	 	fileUpload = require("express-fileupload");

//// ROUTES

const index = require("./routes/index");

//////////////

const app = express();

app.engine("hbs", hbs({
	extname: "hbs",
	defaultLayout: "layout",
	layoutsDir: path.join(__dirname, "views")}
));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");


app.use(favicon(`${__dirname}/public/img/favicon.png`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(fileUpload());
app.use(express.static(`${__dirname}/public`));

app.use("/", index);



app.listen(process.env.PORT || 3000, () => console.log("Server running on port 3000"));






