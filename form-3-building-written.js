(function(){'use strict';
const variants=[
{project:'a dining table used by a large family',safety:'Student A wears safety goggles; Student B runs carrying a chisel; Student C leaves timber offcuts on the floor.',injury:'A learner accidentally cuts a finger while using a sharp tool.',length:75,available:700},
{project:'strong classroom bookshelves',safety:'Student A wears required goggles; Student B leaves a saw on the walkway; Student C plays near moving workshop equipment.',injury:'A classmate receives a small cut while preparing a timber joint.',length:85,available:790},
{project:'a durable wooden door frame',safety:'Student A checks protective equipment; Student B runs with a hand tool; Student C leaves scraps in the passage.',injury:'A learner's hand is injured while handling timber.',length:95,available:850}
];
const papers=variants.map((v,i)=>{
const x=i*2,measure=[5+x,8+x,120+10*i,250+10*i,45+5*i,360+20*i,v.length,v.available];
return {id:'structured-'+(i+1),title:'Building Technology Structured Paper '+(i+1),questions:[
{section:'A',topic:'firstaid',marks:5,stem:'Question 1. (i) Define first aid (2 marks). (ii) State THREE suitable items in a first aid kit (3 marks).'},
{section:'A',topic:'safety',marks:5,stem:'Question 2. (i) Explain what health and safety means in a Building Technology workshop (2 marks). (ii) State THREE workshop safety rules (3 marks).'},
{section:'A',topic:'timber',marks:4,stem:'Question 3. (i) Define wood (2 marks). (ii) Define timber as used in building or furniture production (2 marks).'},
{section:'A',topic:'tree',marks:6,stem:'Question 4. Study the cross-section of a tree. Name the part that (i) protects against damage (ii) produces new wood cells (iii) transports water and minerals (iv) is at the centre (v) shows annual growth (vi) is often valued for durable quality timber. 1 mark each.',visual:'tree'},
{section:'B',topic:'uses',marks:6,stem:'Question 5. Give THREE uses of wood (3 marks) and THREE uses of timber in manufactured products or construction (3 marks).'},
{section:'B',topic:'heartwood',marks:8,stem:'Question 6. (i) Define heartwood (2 marks). (ii) Give THREE reasons heartwood is often useful for durable furniture or construction (3 marks). (iii) Explain why sapwood may be less durable in some species and conditions (3 marks).'},
{section:'B',topic:'firstaid',marks:6,stem:'Question 7. Scenario: '+v.injury+' (i) State TWO safe actions to help the learner (2 marks). (ii) Explain why accidents must be reported promptly (2 marks). (iii) Explain the importance of appropriate PPE (2 marks).'},
{section:'C',topic:'measure',marks:10,stem:'Question 8. SHOW YOUR WORKING. (A) Convert (i) '+measure[0]+' cm to mm (1 mark), (ii) '+measure[1]+' cm to mm (1 mark), (iii) '+measure[2]+' mm to cm (1 mark), (iv) '+measure[3]+' mm to cm (1 mark). (B) Convert '+measure[4]+' cm to mm (2 marks), convert '+measure[5]+' mm to cm (2 marks), and calculate how many MORE millimetres are needed for '+v.length+' cm of timber if the available piece is '+v.available+' mm (2 marks). Remember 1 cm = 10 mm.',visual:'ruler'},
{section:'C',topic:'heartwood',marks:6,stem:'Question 9. A carpenter is making '+v.project+'. Heartwood is generally more resistant to decay while sapwood may be younger and more vulnerable in some species. (i) Which tree part should be selected for suitable durable timber (1 mark)? (ii) Give TWO reasons (2 marks). (iii) Name TWO other products made from quality timber (2 marks). (iv) Explain why durability matters (1 mark).'},
{section:'C',topic:'safety',marks:4,stem:'Question 10. Workshop scenario: '+v.safety+' (i) Identify the student following a safety rule (1 mark). (ii) Identify TWO unsafe actions (2 marks). (iii) State ONE possible accident (1 mark).'}
]};});
window.BSS_BUILD_WRITTEN=papers;
})();