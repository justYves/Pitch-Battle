
// Base note
var notes = ["C", "C#", "D", "D#", "E","F","F#", "G", "G#", "A", "A#", "B"];
var keys = [3,4,5];
var push = false;
var range =[];

keys.forEach(function(key){
  notes.forEach(function(note){
    if(note+key==="A3") push = true;
    if(push) range.push(note+key);
    if(note+key==="F5") push =false;
  });
});

function getRandNote(){
  return range[Math.floor(Math.random() * range.length)];
}

module.exports = getRandNote;