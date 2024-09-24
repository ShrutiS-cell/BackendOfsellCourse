import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/course_app").then(()=>{
    console.log("mongo db connected")
}).catch((e)=>{
    console.log(e)
})

const courseSchema = mongoose.Schema({
    name:String,
    describtion:String,
    price:Number

})

export const Course=mongoose.model("Course",courseSchema)

const teacherSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    phno:Number,
    publishedcourses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }]
})

export const Teacher = mongoose.model("Teacher",teacherSchema)


const studentSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    phno:Number,
    perchesedcourses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }]
})


export const Student = mongoose.model("Student",teacherSchema)  