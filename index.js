const express = require('express')
const app = express()



var parser = require('xml2json');
var fs = require('fs');
var xml = fs.readFileSync('a.eaf', 'utf8');


//var xml = "<foo attr=\"value\">bar</foo>";
//console.log("input -> %s", xml)
 
// xml to json

/* 
// json to xml
var xml = parser.toXml(json);
console.log("back to xml -> %s", xml)*/

app.get('/', (req, res) => {
    var json = JSON.parse(parser.toJson(xml));
//console.log("to json -> %s", json);
    res.json(json)
  })
  
app.get('/compare/dataArr', (req, res) => {
  var compare = fs.readFileSync('dataArr.json');
  var json = JSON.parse(compare);
//console.log("to json -> %s", json);
  res.json(json)
})
app.get('/compare/lineTimeArr', (req, res) => {
  var compare = fs.readFileSync('lineTimeArr.json');
  var json = JSON.parse(compare);
//console.log("to json -> %s", json);
  res.json(json)
})
app.get('/compare/timeArr', (req, res) => {
  var compare = fs.readFileSync('timeArr.json');
  var json = JSON.parse(compare);
//console.log("to json -> %s", json);
  res.json(json)
})
app.get('/compare/timeslotArr', (req, res) => {
  var compare = fs.readFileSync('timeslotArr.json');
  var json = JSON.parse(compare);
//console.log("to json -> %s", json);
  res.json(json)
})
  app.listen(8080, () => {
    console.log(`Example app listening at http://localhost:8080`)
  })