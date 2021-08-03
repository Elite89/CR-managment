const express = require('express');
const pool = require('../utilities/sql_conn');

var router = express.Router();

const validation = require('../utilities').validation;
let isStringProvided = validation.isStringProvided;

//get available resources after certain date
router.get("/available/:date?", (request, response, next)=>{

    // console.log(request.query);

    //validate the header parameters
    if(request.query.date == undefined){
        response.status(400).send({
            message:"Missing required information"
        })
    }
    else{
        next();
    }
}, (request, response) =>{

    var query = 'SELECT * FROM RESOURCES WHERE $1::date - ENDDATE <= 0;'
    var value = [request.query.date];

    pool.query(query, value)
    .then(result => {

        response.status(200).send({
            'total':result.rowCount,
            'rows':result.rows
        })

    })
    .catch(err =>{
        response.status(400).send({
            message:'SQL Error',
            error: err
        })
    })
})

router.post("/", (request, response, next)=>{

    //validate body parameter
    if(request.body.SowID == undefined || request.body.EmployeeID == undefined){
        response.status(400).send({
            message:"Missing required information"
        })
    }
    else{
        next()
    }
}, (request, response)=>{

    var insert = `INSERT INTO RESOURCES (sowid, employeeid, startdate, enddate, percentage, payrate)
                  VALUES ($1, $2, $3, $4, $5, $6)`
                //   ON CONFLICT (sowid, employeeid) DO UPDATE SET
                //   startdate=$3, enddate=$4, percentage=$5, payrate=$6
                //   RETURNING *`

    var values = [request.body.SowID, request.body.EmployeeID, request.body.StartDate, request.body.EndDate, request.body.Percentage, request.body.PayRate]

    pool.query(insert, values)
    .then(result => {
        response.status(200).send({
            success: true,
            message:'Inserted successfully'
        })

    })
    .catch(err =>{
        response.status(400).send({
            message:'SQL Error',
            error: err
        })
    })

})

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