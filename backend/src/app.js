import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express()



app.use(
  cors({
    origin: [
      "*",
      "http://localhost:3000",
      "http://192.168.1.13:3000",
      "http://localhost:8081"
    ],
    // credentials: true,
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
import userRoutes from "./routes/user.routes.js"

app.use("/api/users", userRoutes)



export { app }