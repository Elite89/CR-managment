const express = require('express');
const pool = require('../utilities/sql_conn');

var router = express.Router();

const validation = require('../utilities').validation;
let isStringProvided = validation.isStringProvided;

router.get("/search/:name?", (request, response, next) => {

    // console.log("here");

    if(request.query.name == undefined){
        response.status(400).send({
            message:"Missing Required Information"
        })
    }
    else{
        next()
    }

}, (request, response) =>{

    // INNER JOIN BSCowner as b ON e.employeeid = b.employeeid
    var select = 'SELECT e.fullname, e.employeeid FROM EMPLOYEE as e WHERE LOWER(e.fullname) LIKE LOWER($1);';
    var value = ['%'+request.query.name+'%'];

    // console.log(request.query.name)

    pool.query(select, value)
    .then(result => {

        // console.log(result);

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
    if(!request.body.EmployeeID && !request.body.FullName){
            response.status(400).send({
                message:"Missing required information."
            })
   }
   else{
       next()
   }
}, (request, response, next) =>{

    var query = 'SELECT * FROM EMPLOYEE WHERE employeeid = $1'
    var values = [request.body.EmployeeID]

    pool.query(query, values)
    .then(result => {
        if(result.rowCount < 1){
            response.status(404).send({
                message:'No Employee Found with provided ID'
            })
        }
        else{
            next()
        }
    })
    .catch(err => {
        result.status(400).send({
            message:'SQL Error',
            Error: err
        })
    })
}, (request, response) =>{

    var find  = 'SELECT * FROM BSCowner WHERE employeeid = $1'
    var val1 = [request.body.EmployeeID]

    pool.query(find, val1)
    .then(result =>{

        if(result.rowCount > 0){

            response.status(200).send({
                success: true,
                message:"Employee is already BSC owner"
            })

        }
        else{

            //insert new employee
            var query2 = 'INSERT INTO BSCowner (employeeid) VALUES ($1)'
            var val2 = [request.body.EmployeeID]

            pool.query(query2, val2)
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

        }
        
    })
    .catch(err =>{
        response.status(400).send({
            message:'SQL error',
            error: err
        })
    })

    
})

// "return" the router
module.exports = router