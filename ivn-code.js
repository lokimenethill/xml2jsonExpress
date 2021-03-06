const fs = require('fs')
const path = require('path');
const parseString = require('xml2js').parseString;
// Nombre del archivo eaf
const FILE_NAME = 'asset01.eaf';
// Nombre del archivo de salida
const JSON_FILE = FILE_NAME + '.json';
fs.readFile(path.join(__dirname, 'eaf', FILE_NAME), 'utf8' ,(err, data)=>{
  if(err){
    console.log(`Error readring file ${FILE_NAME}`);
    return
  }
  parseString(data, (err, result)=>{
    if(err){
      console.log(`Error wehen parsing xml data`);
    }
    let eaf = result;
    // Getting timeslotArr
    let timeslotArr = getTimeSlotArray(result);
    // Getting lineTimeArray
    let lineTimeArray = getLineTimeArray(result);
    // Getting dataArray
    let dataArr = getDataArray(result, timeslotArr, lineTimeArray);
    // Getting tierArr
    let tierArr = getTierArr(result);
    //return;
    const eafjson = JSON.stringify(tierArr, null, 4);
    fs.writeFile(path.join(__dirname,'jsoneaf',JSON_FILE), eafjson, (err)=>{
      if(err){
        console.log(`Error when writing ${JSON_FILE}: ${err.message}`);
        return;
      }
      console.log(`SUCCESS when writing file ${JSON_FILE}`);
    });
  });
})
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function getTimeSlotArray(eaf)
{
  const timeSlots = eaf["ANNOTATION_DOCUMENT"]["TIME_ORDER"][0]["TIME_SLOT"];
  const timeArray = timeSlots.reduce((previous, current, index) => {
    let obj = previous;
    obj[++index + ""] = Number(current["$"]["TIME_VALUE"]);
    return obj;
  }, {});
  return timeArray;
}
function getDataArray(eaf, timeSlotArray, lineTimeArray)
{
  const tiers = eaf["ANNOTATION_DOCUMENT"]["TIER"];
  const dataArray = tiers.reduce((prevTier, currTier, idx) => {
    let tiers = prevTier;
    
    // Checking if tier
    if(!currTier["ANNOTATION"]) return tiers;
    // Getting anotations per tier
    let annotationType = Object.keys(currTier["ANNOTATION"][0])[0];
    let annotations = currTier["ANNOTATION"];
    
    // Forming lines
    let lines = annotations.reduce((prevLine, currLine, index)=>{
      let nLines = prevLine;
      let line = currLine[annotationType][0];
      let lineRef1 = line["$"]["ANNOTATION_ID"]
      let lineRef2 = line["$"]["ANNOTATION_REF"] ? line["$"]["ANNOTATION_REF"] : line["$"]["ANNOTATION_ID"];
      let start = "";
      let stop = "";
      if(line["$"]["TIME_SLOT_REF1"]){
        let timeSlotString = line["$"]["TIME_SLOT_REF1"]; 
        timeSlotString = timeSlotString.replace("ts",""); 
        start = timeSlotArray[timeSlotString]/1000;
        
        timeSlotString = line["$"]["TIME_SLOT_REF2"];
        timeSlotString = timeSlotString.replace("ts","");
        timeSlotString = (Number(timeSlotString) - 1).toString();
        stop = timeSlotArray[timeSlotString]/1000;
      }else{
        lineRef2 = line["$"]["ANNOTATION_REF"];
        let timeObj = lineTimeArray[lineRef2];
        start = Number(timeSlotArray[timeObj.start.toString()])/1000;
        stop = Number(timeSlotArray[timeObj.stop.toString()])/1000;
      }
      
      let timeSlotString = line["$"]["TIME_SLOT_REF1"] || line["$"]["ANNOTATION_REF"];
      timeSlotString = timeSlotString.replace("ts","").replace("a","");
      
      let timeSlot = timeSlotArray[timeSlotString]/1000;
      
      nLines[lineRef1] = {
        "lineref" : lineRef2,
        "start": start,
        "stop": stop,
        "value": line["ANNOTATION_VALUE"][0]
      }
      return nLines;
    },{});
    let display = currTier["ANNOTATION"][0]["REF_ANNOTATION"] ? "top" : "bottom";
    
    // Forming Tier
    tiers[currTier["$"]["TIER_ID"]] = {
      "display" : display,
      "color" : "",
      "lines" : lines,
    };
    return tiers;
  },{});
  return dataArray;
}
function getLineTimeArray(eaf){
  const tiers = eaf["ANNOTATION_DOCUMENT"]["TIER"];
  // Creating Result Object
  let lineTimeArray = {};
  // Iterating over all tiers
  tiers.forEach(tier => {
    if(!tier["ANNOTATION"]) return;
    // Getting Annotations fo Current Tier
    let annotations = tier["ANNOTATION"];
    // Iterating over all annotations of the current tier
    annotations.forEach(annotation => {
      // Getting Annotations type
      let annotationType = Object.keys(annotation)[0];
      if(annotationType === "ALIGNABLE_ANNOTATION"){
        // Getting Annotation ID
        let aid = annotation["ALIGNABLE_ANNOTATION"][0]["$"]["ANNOTATION_ID"];
        let start = Number(annotation["ALIGNABLE_ANNOTATION"][0]["$"]["TIME_SLOT_REF1"].replace("ts",""));
        let stop  = Number(annotation["ALIGNABLE_ANNOTATION"][0]["$"]["TIME_SLOT_REF2"].replace("ts",""));
        // 
        lineTimeArray[aid] = {
          "start": start,
          "stop": stop
        }
      }
    });
  });
  return lineTimeArray;
}
function getTierArr(eaf){
  const tiers = eaf["ANNOTATION_DOCUMENT"]["TIER"];
  let tierArr = {};
  tiers.forEach(tier => {
    // Checking if tier
    if(!tier["ANNOTATION"]) return;
    // Get Participant if not exiist add objects
    let participant = tier["$"]["PARTICIPANT"];
    if(!tierArr[participant]){
      tierArr[participant] = {
        participant,
        tiers: {}
      };
    }
    // Get tierID
    let tierID = tier["$"]["TIER_ID"];
    // Get Code
    let code = "";
    let nameSplit = participant.split(" ");
    nameSplit.forEach(word => {
      code += word[0];
    });
    // Add the tier to the object
    tierArr[participant]["tiers"][tierID] = {
      name : tierID,
      code : code,
      color: getRandomColor()
    }
  });
  return tierArr;
}