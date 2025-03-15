import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import connectDb from "./config/db.js"
import router from "./routes/router.js";
import  dotenv from "dotenv"
import rankingRouter from './routes/ranking.js';
import cookieParser from "cookie-parser";
dotenv.config()
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser())
app.use('/',router);
app.use('/ranking',rankingRouter)

app.listen(4000,()=>{
    console.log("server is listening on port 4000")
    console.log("follow the link http://localhost:4000")
})