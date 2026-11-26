/* Form 3 Music Theory written-response tasks and 50-mark mock components.
 * Term 1 exam section weights: A10 B5 C10 D4 E6 F15.
 * These tasks are original and require teacher marking.
 */
(function(){
'use strict';
const noteTerms=['whole note','half note','quarter note','eighth note','sixteenth note'];
const variants=[
 {notes:'whole, half, quarter, eighth and sixteenth',a:'4/4',pitch:['D4','A5','C6'],quarter:'2 quarter notes and 1 eighth note',names:['whole note','half note']},
 {notes:'half, eighth, whole, sixteenth and quarter',a:'3/4',pitch:['C4','B5','A3'],quarter:'1 half note, 1 eighth note and 1 sixteenth note',names:['half note','eighth note']},
 {notes:'quarter, sixteenth, whole, eighth and half',a:'2/4',pitch:['B3','C6','G5'],quarter:'3 eighth notes and 2 sixteenth notes',names:['quarter note','sixteenth note']}
];
function paper(index){
 const v=variants[index%3],staffIndex=index%5;
 const writing=[
 {section:'A',topic:'values',marks:5,stem:'Complete a table with the number of quarter-note beats in each of these symbols: '+v.notes+'. Give the value of all five notes, assuming one quarter note = one beat.',visual:{type:'note',value:index%2?'half':'whole'}},
 {section:'D',topic:'math',marks:1,stem:'Calculate the total number of beats in '+v.quarter+'. Show your addition.'},
 {section:'D',topic:'math',marks:1,stem:'How many sixteenth notes have exactly the same duration as '+v.names[0]+'? Show the division.'},
 {section:'D',topic:'math',marks:1,stem:'How many eighth notes have the same duration as one '+v.names[1]+'? Show the calculation.'},
 {section:'D',topic:'math',marks:1,stem:'A four-beat bar contains '+(1+index)+' quarter-note beat'+(index?'s':'')+'. How many beats still need to be added? Show the calculation.'},
 {section:'E',topic:'ledger',marks:1,stem:'Name the treble-clef pitch shown on the staff and explain its position.',visual:{type:'staff',pitch:v.pitch[0]}},
 {section:'E',topic:'ledger',marks:1,stem:'Name the note shown above or below the treble staff. Use its letter name and octave.',visual:{type:'staff',pitch:v.pitch[1]}},
 {section:'E',topic:'ledger',marks:1,stem:'Identify the note on the staff and name the nearest ledger line when needed.',visual:{type:'staff',pitch:v.pitch[2]}},
 {section:'F',topic:'excerpt',marks:1,stem:'Look at the four-bar melody and write its time signature.',visual:{type:'excerpt',version:staffIndex}},
 {section:'F',topic:'excerpt',marks:1,stem:'How many bars are shown? Give the total number of bars.',visual:{type:'excerpt',version:staffIndex}},
 {section:'F',topic:'excerpt',marks:2,stem:'Identify the first note of bar 1 and its duration in quarter-note beats.',visual:{type:'excerpt',version:staffIndex}},
 {section:'F',topic:'excerpt',marks:2,stem:'Name the type of rest in bar 3 and say how many beats it lasts.',visual:{type:'excerpt',version:staffIndex}},
 {section:'F',topic:'excerpt',marks:2,stem:'Find the highest note in the melody and explain how you located it on the treble staff.',visual:{type:'excerpt',version:staffIndex}},
 {section:'F',topic:'excerpt',marks:2,stem:'Add the values of all the notes in bar 2. Show the total beats and decide whether the bar is complete.',visual:{type:'excerpt',version:staffIndex}},
 {section:'F',topic:'excerpt',marks:3,stem:'Compare bar 1 and bar 4. Name their first notes, calculate the combined duration of the first two notes in bar 4 and explain how you checked the bar is complete.',visual:{type:'excerpt',version:staffIndex}}
 ];
 return {id:'structured-'+(index+1),title:'Music Theory Structured Paper '+(index+1),questions:writing}
}
window.BSS_MUSIC_WRITTEN=Array.from({length:3},(_,i)=>paper(i));
})();