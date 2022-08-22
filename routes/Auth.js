const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const JWT_SECRET = 'soukhin_mix_mint';

//***||***\\ Route 1: Create a User using: POST "api/auth/createuser".No login required 
router.post(
    "/createuser",
    [
        body('username' , 'Enter a valid name').isLength({min: 3 }),
        body('email', 'Enter a valid email').isEmail(),
        body('password', 'Password must be atleast 5 characters').isLength({min:5})
    ],
    async (req,res)=>{
        let success = false;
        //if there are errors, return Bad request and the errors 
        const errors = validationResult(req); 
        if(!errors.isEmpty ()){
            return res.status(400).json({success , errors: errors.arrey()});
        }
        try{
            //Check whether the user with this email exists already 
            let user = await User.findOne({success,email:req.body.email});
            if(user){
                return res.state(400).json({success, error: "Sorry a user with this email already exists"});
            }
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password , salt);
            user = await User.create({
                username:req.body.username,
                password: secPass,
                email:req.body.email
            })
            const data = {
                user: {
                    id : user.id
                }
            }
            const authtoken = jwt.sign(data , JWT_SECRET);
            success=true;
            res.json({success , authtoken});
        } catch(error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        }
    }
);

module.exports = router 