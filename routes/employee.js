//express is the framework we're going to use to handle requests
const express = require('express')
const pool = require('../utilities/sql_conn')

//retrieve the router object from express
var router = express.Router()

const validation = require('../utilities').validation
let isStringProvided = validation.isStringProvided

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

// "return" the router
module.exports = router