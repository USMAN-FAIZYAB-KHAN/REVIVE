import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express()



app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://time-bound-digital-access-vault-nine.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
app.use(express.static("public"))
app.use(cookieParser());


//Routes




export { app }