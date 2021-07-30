//express is the framework we're going to use to handle requests
const express = require('express')
const pool = require('../utilities/sql_conn')

//retrieve the router object from express
var router = express.Router()

const validation = require('../utilities').validation
let isStringProvided = validation.isStringProvided

//postgres stores date in yyyy-mm-dd format and we passed in mm-dd-yyyy format

//date should be in yyyy-mm-dd format
//get all contracts that are about to expired before the passed date
router.get("/expires/:date?", (request, response, next)=>{

    console.log("here");
    console.log(request.query);

    //validate the header parameters
    if(request.query.date == undefined){
        response.status(400).send({
            message:"Missing required information"
        })
    }
    else{
        next();
    }
}, (request, response)=>{

    console.log("date : " + request.query.date);

    let query = 'SELECT * FROM CONTRACTS WHERE $1::date-ENDDATE>=0';
    let value = [request.query.date];

    pool.query(query, value)
    .then(result =>{

        response.status(200).send({
            'total':result.rowCount,
            'rows':result.rows
        })

    })
    .catch(error=>{
        response.status(400).send({
            message:'SQL error',
            error: error
        })
    })
});


// get method to get details of the contract
router.get("/:sowID?", (request, response, next)=>{

    console.log(request.query);

    //validate the header parameters
    if(request.query.sowID == undefined){
        response.status(400).send({
            message:"Missing required information"
        })
    }
    else{
        next();
    }
}, (request, response)=>{

    //sql statement 
    let query = 'SELECT * FROM CONTRACTS WHERE SowID=$1'
    let value = [request.query.sowID]

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
            console.log(result.rows[0].sowname);

            //return date formate is yyyy-mm-dd
            var date = (result.rows[0].startdate);

            response.status(200).send({
                    'SowID': result.rows[0].sowid,
                    'SowName': result.rows[0].sowname,
                    'ProjectType': result.rows[0].projecttype,
                    'StartDate': date,
                    'EndDate': result.rows[0].enddate,
                    'CssCMS': result.rows[0].csscms,
                    'ContractID': result.rows[0].contractid,
                    'ContractValue': result.rows[0].contractvalue,
                    'CrmStage': result.rows[0].crmstage,
                    'CrmID': result.rows[0].crmid,
                    'TcsOwner': result.rows[0].tcsowner,
                    'BscOwner': result.rows[0].bscowner,
                    'SowSS': result.rows[0].sowss,
                    'PoNumber': result.rows[0].ponumber,
                    'PoValue': result.rows[0].povalue,
                    'Remarks': result.rows[0].remarks
                })
        }

    }).catch(error => {
        
        console.log(error);
    })

});



// "return" the router
module.exports = router