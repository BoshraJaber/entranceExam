// including - importing libraries
const express = require('express');
const superAgent = require('superagent');
const pg = require('pg');
const cors = require('cors');
const methodOverride = require('method-override');

// setup and configuration
require('dotenv').config();
const app = express();
app.use(cors());
app.use(methodOverride('_method'));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
const client = new pg.Client(process.env.DATABASE_URL);   // on your machine
// const client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); // for heroku

PORT=process.env.PORT;
//routes
app.get('/',handleHomePage);
app.post('/getCountryResult', handleCountryResult)
app.get('/AllCountries', handleAllCountriesData)

//handlers
function handleHomePage(req,res){
    let url='https://api.covid19api.com/world/total';
    superAgent.get(url).then(data=>{
        res.render('index',{result: data.body})
    })
}
function handleCountryResult(req,res){
    let countryArr = [];
    let county = req.body.country;
    let from = req.body.from;
    let to = req.body.to;
    let url=`https://api.covid19api.com/country/${county}/status/confirmed?from=${from}T00:00:00Z&to=${to}T00:00:00Z`;
    // console.log(url);
    superAgent.get(url).then( data=>{
        data.body.map(element=>{
            countryArr.push(new Country(element))
        })
        res.render('result',{result: countryArr})
    })
}
function handleAllCountriesData(req,res){
    let countryArr=[]
    let url='https://api.covid19api.com/summary';
    superAgent.get(url).then(data=>{
        data.body.Countries.map(element=>{
            countryArr.push(new AllCountries(element))
        })
        res.render('AllCountries',{result: countryArr})
    })
}

//constructor
function Country(data){
    this.country = data.Country
    this.date= data.Date;
    this.cases= data.Cases
}
function AllCountries(data){
this.country= data.Country;
this.totalConfirmedCases = data.TotalConfirmed;
this.totalDeathsCases = data.TotalDeaths;
this.totalRecoveredCases = data.TotalRecovered;
this.date = data.Date;
}




client.connect().then( ()=>{
    app.listen(PORT, ()=>{
        console.log('App is listening on port', PORT);
    })
}).catch( error=>{
    console.log('Error connecting to database'+error);
})