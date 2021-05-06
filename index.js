const express = require('express');
const app = express();
const path = require('path');
const eafTools = require('./helpers/eafTools');
var parser = require('xml2json');
var fs = require('fs');
const { Console } = require('console');

// Reading the file
let eafXml = fs.readFileSync('./originals/a01.eaf', 'utf8');
var eafJs = JSON.parse(parser.toJson(eafXml));

// Adding static files
app.use(express.static(path.join(__dirname,'public')));

app.get('/res/timeslotArr', (req, res) => {
  let timeslotArr = eafTools.getTimeSlotArray(eafJs);
  res.json(timeslotArr);
});

app.get('/res/dataArr', (req, res) => {
  let dataArr = eafTools.getDataArray(eafJs);
  res.json(dataArr);
});

app.get('/res/lineTimeArr', (req, res) => {
  let lineTimeArr = eafTools.getLineTimeArray(eafJs)
  res.json(lineTimeArr);
});

app.get('/res/tierArr', (req, res) => {
  let tierArr = eafTools.getTierArr(eafJs)
  res.json(tierArr);
});

app.get('/', (req, res) => {
  
  eafJs = JSON.parse(parser.toJson(eafXml));
  //console.log("to json -> %s", json);
  res.json(eafJs);
});

app.get('/org/dataArr', (req, res) => {
  let dataArr = require('./originals/dataArr.json')
  res.json(dataArr);
});

app.get('/org/tierArr', (req, res) => {
  let tierArr = require('./originals/tierArr.json')
  res.json(tierArr);
});

app.get('/org/timeslotArr', (req, res) => {
  let timeslotArr = require('./originals/timeslotArr.json')
  res.json(timeslotArr);
});

app.get('/org/lineTimeArr', (req, res) => {
  let lineTimeArr = require('./originals/lintetimeArr.json')
  res.json(lineTimeArr);
});

// Starting Server
const port = 3000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
