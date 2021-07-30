const express = require('express');
const pool = require('../utilities/sql_conn');

var router = express.Router();

const validation = require('../utilities').validation;
let isStringProvided = validation.isStringProvided;


// get method to get details of the contract
router.get("/:SowID?", (request, response, next)=>{

     console.log(request.query);

    //validate the header parameters
    if(request.query.SowID == undefined){
        response.status(400).send({
            message:"Missing required information"
        })
    }
    else{
        next();
    }
}, (request, response, next)=>{

    //sql statement 
    let query = 'SELECT * FROM RESOURCES WHERE sowid=$1'
    let value = [request.query.SowID]

    pool.query(query, value)
    .then(result => {

        if(result.rowCount == 0){
            console.log("no results");
            response.status(404). send({
                message:"No resources involved with this contracts"
            })
        }
        else{
           //go to find all resources with the given sow id
           next();
        }

    }).catch(error => {
        
        console.log(error);
    })

}, (request, response)=>{

    //sql statement
    let query = 
        'SELECT e.employeeid, e.fullname, r.startdate, r.enddate, r.percentage, r.payrate '+
        'FROM employee AS e INNER JOIN resources AS r ON e.employeeid = r.employeeid WhERE r.sowid = $1';
    let value = [request.query.SowID];

    pool.query(query, value)
    .then(result => {

        if(result.rowCount == 0){
            response.status(404).send({
                message:"No records found"
            })
        }
        else{

            response.status(200).send({
                'SowID':request.query.SowID,
                rows: result.rows
            })
        }
    })
    .catch(error =>{
        response.status(400).send({
            message:'SQL Error',
            error : error
        })
    })
})

// "return" the router
module.exports = router