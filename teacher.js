import express, { Router } from "express"
import {Teacher,Course} from "../database/db.js"
import jwt from "jsonwebtoken"
const jwtpassword ="98764"

const teacherRouter = express.Router()

const teachermiddleware=(req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        res.status(403).json({
            msg:"token not found!"
        })
    }
    const token = authHeader.split(" ")[1];
    try{
        const decode=jwt.verify(token,jwtpassword);
        req.userId=decode.id;
        next();
    }catch(e){
        res.status(411).json({
            msg:"token is not valid"
        })

    }

}




teacherRouter.post("/signup",async(req,res)=>{
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let phno=req.body.phno;
    let teacher = await Teacher.findOne({
        email:email
    })
    if (teacher){
        res.send("Email already taken")
    }else{
        let teach = await Teacher.create({
            name:name,
            email:email,
            password:password,
            phno:phno
        })
        const token =jwt.sign({
            email:teach.email,
            id:teach._id
        },jwtpassword);
        res.status(200).json({
            msg:"signup succssfull",
            token:token
        })
    }
})


teacherRouter.get("/signin",async(req,res)=>{
    let email = req.body.email;
    let password = req.body.password;
    let teach = await Teacher.findOne({
        email:email
    })
    if (!teach){
        res.send("Email does not exist")
    }else{
        if(teach.password!=password){
            res.send("incurresct password")
        }else{
            const token =jwt.sign({
                email:teach.email,
                id:teach._id
            },jwtpassword);
            res.status(200).json({
                msg:"signup succssfull",
                token:token
            })

        }
        
    }
})

teacherRouter.post("/publish",teachermiddleware,async(req,res)=>{
    let name = req.body.name;
    let describtion = req.body.decode;
    let price = req.body.price;

    let course=await Course.create({
        name:name,
        describtion:describtion,
        price:price
    })
    let userId=req.userId;
    try{
        await Teacher.updateOne(
            {_id:userId},{
                "$push":{publishedcourses:course._id}
            }
        )
        res.status(200).json({
            msg:"course published sucessfully"
        })
            
    }catch(e){
        res.status(450).json({
            msg:"something went wrong!"
        })
    }
})


export default teacherRouter;


