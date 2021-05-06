const express = require('express');
const app = express();

var parser = require('xml2json');
var fs = require('fs');
const { Console } = require('console');
var xml = fs.readFileSync('a.eaf', 'utf8');
var options = {
  object: true,
  reversible: false,
  coerce: false,
  sanitize: true,
  trim: true,
  arrayNotation: false,
  alternateTextNode: false
};
//var xml = "<foo attr=\"value\">bar</foo>";
//console.log("input -> %s", xml)

// xml to json

/* 
// json to xml
var xml = parser.toXml(json);
console.log("back to xml -> %s", xml)*/
app.get('/working/dataArr', (req, res) => {
  var jsonxml = parser.toJson(xml,options);
  
  function pull_time_orders(jsonxmlparser){
    var temp_json = jsonxmlparser['ANNOTATION_DOCUMENT']['TIME_ORDER']['TIME_SLOT']
  }
  //console.log(jsonxml['ANNOTATION_DOCUMENT']['TIER'][0]['PARTICIPANT']);
  var tiersjson = jsonxml['ANNOTATION_DOCUMENT']['TIER'];
  var json_objetivo = {};
  for (let i = 0; i < tiersjson.length; i++) {
    var participants = jsonxml['ANNOTATION_DOCUMENT']['TIER'][i]['PARTICIPANT'];
    var lines = jsonxml['ANNOTATION_DOCUMENT']['TIER'][i]['ANNOTATION'];
    var lines_json = {};
    var line_ref={}
    var sort_lines = {}
    for (let x = 0; x < lines.length; x++) {
      line_ref["lines"] =lines
        
        json_objetivo[participants]= line_ref;
      lines_json[participants] = lines;
      console.log(JSON.stringify(line_ref));
    }

    //json_objetivo[participants] = lines_json;

    json_objetivo;
  }
  //console.log(json_objetivo);
  //console.log("to json -> %s", json);
  res.json(json_objetivo);
});

app.get('/working/lineTimeArr', (req, res) => {
  var jsonxml = parser.toJson(xml,options);
  //console.log(jsonxml['ANNOTATION_DOCUMENT']['TIER'][0]['PARTICIPANT']);
  var tiersjson = jsonxml['ANNOTATION_DOCUMENT']['TIER'];
  var json_objetivo = [];
  for (let i = 0; i < tiersjson.length; i++) {
    var participants = jsonxml['ANNOTATION_DOCUMENT']['TIER'][i]['PARTICIPANT'];
    json_objetivo.push(
      jsonxml['ANNOTATION_DOCUMENT']['TIER'][i]['PARTICIPANT'],
    );
    var lines = jsonxml['ANNOTATION_DOCUMENT']['TIER'][i]['ANNOTATION'];
    json_objetivo.push(lines);
  }
  console.log(json_objetivo);
  //console.log("to json -> %s", json);
  res.json(json_objetivo);
});

app.get('/', (req, res) => {
  var jsonxml = parser.toJson(xml,options);
  //console.log("to json -> %s", json);
  res.json(jsonxml);
});

app.get('/compare/dataArr', (req, res) => {
  var compare = fs.readFileSync('dataArr.json');
  var json = JSON.parse(compare);

  //console.log("to json -> %s", json);
  res.json(json);
});

app.get('/compare/lineTimeArr', (req, res) => {
  var compare = fs.readFileSync('lineTimeArr.json');
  var json = JSON.parse(compare);
  //console.log("to json -> %s", json);
  res.json(json);
});

app.get('/compare/timeArr', (req, res) => {
  var compare = fs.readFileSync('timeArr.json');
  var json = JSON.parse(compare);
  //console.log("to json -> %s", json);
  res.json(json);
});

app.get('/compare/timeslotArr', (req, res) => {
  var compare = fs.readFileSync('timeslotArr.json');
  var json = JSON.parse(compare);
  //console.log("to json -> %s", json);
  res.json(json);
});
app.listen(8080, () => {
  console.log(`Example app listening at http://localhost:8080`);
});
