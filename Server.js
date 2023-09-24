import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import connectDB from "./DataBase/db.js";
import cors from "cors";
import authRoutes from "./Routes/authRoute.js"
//configure env
dotenv.config();

//databse config
connectDB();

//rest object
const app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
//middelwares
app.use(cors({origin: true, credentials: true}));
app.use(express.json());
// app.use(bodyParser.urlencoded({extended:false}))
// app.use(bodyParser.json())
//rest api
app.get("/", (req, res) => {
    res.send("<h1>Welcome to Amazon-ecommerce app</h1>");
});
//routes
app.use("/api/v1/auth", authRoutes);
//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
    console.log(
        `Server Running on  ${PORT}`.bgCyan
            .white
    );
});
