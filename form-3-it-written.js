/* Original school-style Form 3 IT structured papers: five questions, 6 marks each. */
(function(){'use strict';
const cases=[
 {student:'Maya',document:'research report',source:'an approved website statistic',flyer:'sports festival flyer',events:'five sports events',sprite:'cat',message:'Welcome to my project!',x:120,y:-80,steps:10},
 {student:'Jules',document:'environmental research report',source:'a climate information table',flyer:'health week flyer',events:'four health activities',sprite:'butterfly',message:'Hello from Scratch!',x:-100,y:70,steps:20},
 {student:'Elena',document:'school heritage report',source:'a historical quotation',flyer:'school club flyer',events:'six club meetings',sprite:'parrot',message:'Let us learn to code!',x:90,y:120,steps:15}
];
const papers=cases.map((v,i)=>({
 id:'structured-'+(i+1),title:'IT Structured Paper '+(i+1),
 questions:[
 {section:'B',topic:'word',marks:6,stem:'Question 1. '+v.student+' is preparing a '+v.document+' using '+v.source+'. (a) State the main purpose of the Microsoft Word Title Bar AND Status Bar (2 marks). (b) Explain the difference between Save As and Save (2 marks). (c) Explain why the student should cite the website source when using its information (2 marks).'},
 {section:'B',topic:'format',marks:6,stem:'Question 2. A learner creates a '+v.flyer+' featuring '+v.events+'. (a) Suggest TWO character-formatting changes that would emphasise the heading (2 marks). (b) Identify the list-formatting tool and explain how Square or Tight text wrapping improves placement of an image (2 marks). (c) State the keyboard shortcut for Undo and explain when to use it (2 marks).'},
 {section:'B',topic:'scratch',marks:6,stem:'Question 3. Study the labelled Scratch workspace diagram. (a) Identify the central Code workspace, Stage and Blocks palette (3 marks). (b) Give the official term for the Stage background (1 mark). (c) State the usual category colour and function for Events blocks and Motion blocks (2 marks).',visual:'workspace'},
 {section:'B',topic:'coords',marks:6,stem:'Question 4. Study the Scratch coordinate grid. (a) Give x and y at the Stage centre (2 marks). (b) Identify the axis controlling horizontal movement, and state the minimum and maximum y values (2 marks). (c) Write the exact Motion block for placing a sprite immediately at x = '+v.x+', y = '+v.y+' (2 marks).',visual:'coordinates',x:v.x,y:v.y},
 {section:'B',topic:'scripts',marks:6,stem:'Question 5. The '+v.sprite+' sprite must start when Green Flag is clicked, move to the centre of the Stage (0,0), say "'+v.message+'" for 2 seconds and then move '+v.steps+' steps. (a) Number these FOUR shuffled Scratch blocks from 1 to 4 in the correct script order: [ ] move '+v.steps+' steps; [ ] say "'+v.message+'" for 2 seconds; [ ] when green flag clicked; [ ] go to x: 0 y: 0 (4 marks). (b) Explain why the green flag event block is at the top (1 mark). Explain how to increase the movement to '+(v.steps+40)+' steps (1 mark).',visual:'script'}
 ]}));
window.BSS_IT_WRITTEN=papers;
})();