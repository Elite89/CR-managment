//express is the framework we're going to use to handle requests
const express = require('express')
const pool = require('../utilities/sql_conn')

//retrieve the router object from express
var router = express.Router()

const validation = require('../utilities').validation
let isStringProvided = validation.isStringProvided

//end point to search for projects details
router.get("/search/:id?", (request, response, next) =>{

    // console.log("in here " + request.query.id);

    if(request.query.id == undefined){
        response.status(400).send({
            message:"Missing Required Information"
        })
    }
    else{
        next()
    }
}, (request, response) =>{

    var select = 'SELECT sowid FROM CONTRACTS WHERE LOWER(sowid) LIKE LOWER($1)';
    var value = ['%'+request.query.id+'%'];

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

//post route
/**
 * @api {post} /contracts Request to add a contracts.
 * @apiName PostContracts
 * @apiGroup Contracts
 * 
 * @apiDescription Adds contract 
 * 
 * @apiBody {String} SowID the id of the contract
 * @apiBody {String} SowName name of the contract 
 * @apiBody {String} ProjectType type of the contract
 * @apiBody {String} StartDate start date of the contract
 * @apiBody {String} EndDate tentetive end date of the contract
 * @apiBody {String} CssCMS current contract signature status of cms
 * @apiBody {String} ContractID Current contract id
 * @apiBody {Number} ContractValue total contract value in dollars
 * @apiBody {String} CrmStage crm stage of the contract
 * @apiBody {String} CrmID crm ID of the contract
 * @apiBody {Number} TcsOwner employee id of tcs owner for this contract
 * @apiBody {Number} BscOwner employee id of bsc owner for this contract
 * @apiBody {String} SowSS of this contract
 * @apiBody {Number} PoNumber of this contract
 * @apiBody {Number} PoValue Project value of this contract
 * @apiBody {String} Any important remarks (optional)
 * 
 *  
 * @apiSuccess (Success 201) {boolean} success true when contract is added
 * @apiSuccess (Success 201) {String} success Message when contract is added
 * 
 * @apiError (400: Unknown user) {String} message "unknown contact"
 * 
 * @apiError (400: Missing Parameters) {String} message "Missing required information"
 * 
 * @apiError (400: SQL Error) {String} message the reported SQL error details
 *  
 * @apiUse JSONError
 */
router.post("/", (request, response, next)=>{

    console.log(request.body);

    console.log("in post event");

    //validate body elements
    if(!request.body.SowID && !request.body.SowName && !request.body.ProjectType
         && !request.body.StartDate && !request.body.EndDate){
             response.status(400).send({
                 message:"Missing required information."
             })
    }
    else{
        next()
    }
}, (request, response)=>{

    var insert =   `INSERT INTO Contracts (sowid, sowname, projecttype, startdate, enddate, csscms, contractid, contractvalue, crmstage, crmid, tcsowner, bscowner, sowss, ponumber, povalue, remarks)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
                    ON CONFLICT (sowid) DO UPDATE SET
                    sowname=$2, projecttype=$3, startdate=$4, enddate=$5, csscms=$6, contractid=$7, contractvalue=$8, crmstage=$9, crmid=$10, tcsowner=$11, bscowner=$12, sowss=$13, ponumber=$14, povalue=$15, remarks=$16
                    RETURNING *`
             
    var values = [request.body.SowID, request.body.SowName, request.body.ProjectType, request.body.StartDate, request.body.EndDate, request.body.CssCMS, request.body.ContractID, request.body.ContractValue, request.body.CrmStage, 
                    request.body.CrmID, request.body.TcsOwner, request.body.BscOwner, request.body.SowSS, request.body.PoNumber, request.body.PoValue, request.body.Remarks]

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