const express = require('express');
const pool = require('../utilities/sql_conn');

var router = express.Router();

const validation = require('../utilities').validation;
let isStringProvided = validation.isStringProvided;

router.get("/all/", (request, response) => {

    // console.log("request to get all");

    var select = 'SELECT DropDownName FROM dropdown;'

    pool.query(select)
    .then(result => {

        response.status(200).send({
            'total':result.rowCount,
            'rows':result.rows
        })

    })
    .catch(err => {
        response.status(400).send({
            message:'SQL error',
            error: err
        })
    })

})

router.post("/", (request, response, next) => {
    
    //validate body elements
    if(!request.body.dropdowntype && !request.body.dropdownname && !request.body.status){
        response.status(400).send({
            message:"Missing required information."
        })
    }
    else{
        next()
    }
}, (request, response, next) =>{

    var insert = `INSERT INTO dropdown(dropdownname, dropdowntype, status) VALUES($1, $2, $3);`
    var val = [request.body.dropdownname, request.body.dropdowntype, request.body.status]

    pool.query(insert, val)
    .then(result => {
        response.status(200).send({
            success: true,
            message:"inserted successfully"
        })
    })
    .catch(err => {
        response.status(400).send({
            message:'SQL error',
            error: err
        })
    })
})

router.get("/:type?", (request, response, next) => {

    
    if(request.query.type == undefined){
        response.status(400).send({
            message:"Missing Required Information"
        })
    }
    else{
        next()
    }
}, (request, response) => {

    var select = 'SELECT DropDownName FROM dropdown WHERE dropdowntype=$1;'
    var val = [request.query.type]

    pool.query(select, val)
    .then(result => {

        response.status(200).send({
            'total':result.rowCount,
            'rows':result.rows
        })

    })
    .catch(err => {
        response.status(400).send({
            message:'SQL error',
            error: err
        })
    })

})




// "return" the router
module.exports = router