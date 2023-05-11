const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const User = require("../model/user");
const { response } = require("../../app");

router.post('/signup',(req,res,next)=>{
   bcrypt.hash(req.body.password,10,(err,hash)=>{
    if(err){
        return res.status(500).json({
            error:err
        })
    }
    else{
        const user= User({
            _id:new mongoose.Types.ObjectId,
            username:req.body.username,
            email:req.body.email,
            password:hash,
            phoneNumber:req.body.phoneNumber,
        });
        user.save().then(result=>{res.status(200).json({
            new_user:result
        })}).catch(err=>{
            res.status(500).json({
                error:err
            })
        })
    }
   })
})


router.post('/login',(req,res,next)=>{
    User.find({
        username:req.body.username
    }).exec()
    .then(user=>{
        if(user.length<1){
            return res.status(401).json({
                msg:'user not exist'
            })
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(!result){
                return res.status(401).json({
                    msg:'password matching failed'
                })
            }
            if(result){
                const token=  jwt.sign({
                    username:user[0].username,
                    email:user[0].email,
                    phoneNumber:user[0].phoneNumber
                },
                'this is dummy text',{
                    expiresIn:'24h'
                }
                );
                res.status(200).json({
                    username:user[0].username,
                    email:user[0].email,
                    phoneNumber:user[0].phoneNumber,
                    token:token
                })
            }
        })
    }).catch(err=>{
        res.status(500).json({
            err:err
        })
    })
})

module.exports = router;