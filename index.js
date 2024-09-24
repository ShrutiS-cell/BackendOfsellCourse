import express from "express";
import teacherRouter from "./routes/teacher.js";
import studentRouter from "./routes/student.js";
const app = express();
app.use(express.json())

app.use("/teacher",teacherRouter)
app.use("/student",studentRouter)


app.listen(6000,()=>{
    console.log("server started")
})