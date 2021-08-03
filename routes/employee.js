//express is the framework we're going to use to handle requests
const express = require('express')
const pool = require('../utilities/sql_conn')

//retrieve the router object from express
var router = express.Router()

const validation = require('../utilities').validation
let isStringProvided = validation.isStringProvided

//end point to search for employee details
router.get("/search/:name?", (request, response, next) =>{

    // console.log("in here " + request.query.id);

    if(request.query.name == undefined){
        response.status(400).send({
            message:"Missing Required Information"
        })
    }
    else{
        next()
    }
}, (request, response) =>{

    var select = 'SELECT fullname, employeeid FROM EMPLOYEE WHERE LOWER(fullname) LIKE LOWER($1);';
    var value = ['%'+request.query.name+'%'];

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

// get method to get details of the contract
router.get("/:employeeID?", (request, response, next)=>{

    console.log(request.query);

    //validate the header parameters
    if(request.query.employeeID == undefined){
        response.status(400).send({
            message:"Missing required information"
        })
    }
    else if(isNaN(request.query.employeeID)){
        response.status(400).send({
            message: "Malformed parameter. employeeID must be a number"
        })
    }
    else{
        next();
    }
}, (request, response)=>{

    //sql statement 
    let query = 'SELECT * FROM EMPLOYEE WHERE EmployeeID=$1'
    let value = [request.query.employeeID]

    pool.query(query, value)
    .then(result => {

        if(result.rowCount == 0){
            console.log("no results");
            response.status(404). send({
                message:"No contract found"
            })
        }
        else{
            // console.log(result);
            console.log(result.rows[0].fullname);

            //return date formate is yyyy-mm-dd
            var date = (result.rows[0].joiningdate);

            response.status(200).send({
                    'EmployeeID': result.rows[0].employeeid,
                    'FullName': result.rows[0].fullname,
                    'DeputeBranch': result.rows[0].deputebranch,
                    'EmployeeDP': result.rows[0].employeedp,
                    'DeputeGEO': result.rows[0].deputegeo,
                    'PersonType': result.rows[0].persontype,
                    'ParentIOU': result.rows[0].parentiou,
                    'WorkGEO': result.rows[0].workgeo,
                    'WorkLocation': result.rows[0].worklocation,
                    'EmployeeBaseCountry': result.rows[0].employeebasecountry,
                    'SeniorJunior': result.rows[0].seniorjunior,
                    'PayRate': result.rows[0].payrate,
                    'EmployeeStatus': result.rows[0].employeestatus,
                    'JoiningDate': date,
                    'ReleaseDate': result.rows[0].releasedate,
                    'IndiaNONindia': result.rows[0].indianonindia,
                    'ManagementPerson': result.rows[0].managementperson
                })
        }

    }).catch(error => {
        response.status(400).send({
            message:'SQL Error',
            error : error
        })
    })

})

//post route
router.post("/", (request, response, next)=>{

    console.log("in post event");

    //validate body elements
    if(!request.body.EmployeeID && !request.body.FullName && !request.body.PayRate
         && !request.body.JoiningDate){
             response.status(400).send({
                 message:"Missing required information."
             })
    }
    else{
        next()
    }
}, (request, response)=>{

    var insert =   `INSERT INTO EMPLOYEE (employeeid, fullname, deputebranch, employeedp, deputegeo, persontype, parentiou, workgeo, worklocation, employeebasecountry, seniorjunior, payrate, employeestatus, joiningdate, releasedate, indianonindia, managementperson)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
                    ON CONFLICT (employeeid) DO UPDATE SET
                    fullname=$2, deputebranch=$3, employeedp=$4, deputegeo=$5, persontype=$6, parentiou=$7, workgeo=$8, worklocation=$9, employeebasecountry=$10, seniorjunior=$11, payrate=$12, employeestatus=$13, joiningdate=$14, releasedate=$15, indianonindia=$16, managementperson=$17
                    RETURNING *`
             
    var values = [request.body.EmployeeID, request.body.FullName, request.body.DeputeBranch, request.body.EmployeeDP, request.body.DeputeGEO, request.body.PersonType, request.body.ParentIOU, request.body.WorkGEO, request.body.WorkLocation, 
                    request.body.EmployeeBaseCountry, request.body.SeniorJunior, request.body.PayRate, request.body.EmployeeStatus, request.body.JoiningDate, request.body.ReleaseDate, request.body.IndiaNONindia, request.body.ManagementPerson]

    pool.query(insert, values)
    .then(result => {
        response.status(200).send({
            success: true,
            message:"inserted successfully"
        })
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