import express from "express";
import { Student, Course } from "../database/db.js";
import jwt from "jsonwebtoken";
const jwtpassword = "7777";

const studentRouter = express.Router();


const studentMiddleware = (req, res, next) => {
    let authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(402).json({
            msg: "Invalid token"
        });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decode = jwt.verify(token, jwtpassword);
        req.userId = decode.id; 
        next();
    } catch (e) {
        return res.status(403).json({
            msg: "Token is incorrect"
        });
    }
};


studentRouter.post("/signup", async (req, res) => {
    let { name, email, password, phno } = req.body;
    try {
        let student = await Student.findOne({ email });
        if (student) {
            return res.status(400).json({
                msg: "Email already taken"
            });
        } else {
            let std = await Student.create({ name, email, password, phno });
            const token = jwt.sign({
                email: std.email,
                id: std._id
            }, jwtpassword);
            return res.status(200).json({
                msg: "Signup successful",
                token
            });
        }
    } catch (e) {
        return res.status(500).json({
            msg: "Signup failed, something went wrong"
        });
    }
});


studentRouter.post("/signin", async (req, res) => {  
    let { email, password } = req.body;
    try {
        let std = await Student.findOne({ email });
        if (!std) {
            return res.status(404).json({
                msg: "Email does not exist"
            });
        } else if (std.password !== password) {
            return res.status(400).json({
                msg: "Incorrect password"
            });
        } else {
            const token = jwt.sign({
                email: std.email,
                id: std._id
            }, jwtpassword);
            return res.status(200).json({
                msg: "Signin successful",
                token
            });
        }
    } catch (e) {
        return res.status(500).json({
            msg: "Signin failed, something went wrong"
        });
    }
});


studentRouter.post("/purchase", studentMiddleware, async (req, res) => {
    const courseId = req.query.courseId;  
    try {
        const course = await Course.findOne({ _id: courseId });
        if (!course) {
            return res.status(403).json({
                msg: "Course is not valid"
            });
        }

        const userId = req.userId; 
        await Student.updateOne(
            { _id: userId },
            { "$push": { publishedcourses: courseId } }  
        );
        return res.status(200).json({
            msg: "Course purchased successfully"
        });
    } catch (e) {
        return res.status(500).json({
            msg: "Something went wrong during purchase"
        });
    }
});

export default studentRouter;