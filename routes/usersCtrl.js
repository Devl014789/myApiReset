//import 
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let models = require('../models');

//constante
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const passwordRegex = /^(?=.*\d).{4,8}$/

//Routes
module.exports = {
    register: (req, res) => {

        //parameters
        let firstname =req.body.firstname;
        let lastname =req.body.lastname;
        let username =req.body.username;
        let email =req.body.email;
        let password =req.body.password;

        if(firstname == null || lastname == null || username == null || email == null || password == null) {
            return res.status(400).json({ 'error': 'Champs non remplie'});
        }

        if(username.length >= 13 || username.length <= 4){
            return res.status(400).json({ 'error': 'Charactere pas assez dans username'});
        }

        if(!emailRegex.test(email)) {
            return res.status(401).json({ 'error': 'Password invalide'})
        }

        if(!passwordRegex.test(password)){
            return res.status(401).json({ 'error': 'Password invalide'})
        }

        //verify 
        models.User.findOne({
            attributes: ['email'],
            where: { email: email }
        })
        .then((userFound) => {
            if (!userFound) {
                bcrypt.hash(password, 5, (err, bcryptedPassword) => {
                    let newUser = models.User.create({
                        firstname: firstname,
                        lastname: lastname,
                        username: username,
                        email: email,
                        password: bcryptedPassword
                    })
                    .then((newUser) => {
                        return res.status(201).json({
                            message:'User successfully created', 'userid': newUser.id
                            
                        })
                    })
                    .catch((err) => {
                        return res.status(500).json({ 'error': 'cannot add user'})
                    });
                })
            }else {
                return res.status(400).json({ 'error': 'user already exist'});
            }
        })
    },
    userUpdate: (req, res) => {
        //parameters
        let firstname =req.body.firstname;
        let lastname =req.body.lastname;
        let username =req.body.username;
        let email =req.body.email;
        let password =req.body.password;

        if(firstname == null || lastname == null || username == null || email == null || password == null) {
            return res.status(400).json({ 'error': 'Champs non remplie'});
        }


        //verify 
        models.User.findOne({
            attributes: ['email'],
            where: { email: email }
        })
        .then((userFound) => {
            if (userFound) {
                bcrypt.hash(password, 5, (err, bcryptedPassword) => {
                    let userModified = models.User.update({
                        firstname: firstname,
                        lastname: lastname,
                        username: username,
                        email: email,
                        password: bcryptedPassword
                    })
                    .then((userModified) => {
                        return res.status(200).json({
                            message:'User successfully modified', 'userid': userModified.id
                            
                        })
                    })
                    .catch((err) => {
                        return res.status(400).json({ 'error': 'An error occured'})
                    });
                })
            }else {
                return res.status(404).json({ 'error': 'user was not found'});
            }
        })
    }
}