/* Form 3 Physical Education: original written school-style papers.
 * Section B 25 marks (sports/countries 10, bodies 9, administration 1+2, PE benefits 3)
 * Section C 15 marks (75–100 word Sports Club election speech).
 */
(function(){
'use strict';
const variations=[
 {countries:['USA','New Zealand','Japan','India','West Indies'],sports:['football','basketball','cricket'],role:'President',theme:'inclusive sporting activities'},
 {countries:['West Indies','Japan','USA','India','New Zealand'],sports:['athletics','cricket','football'],role:'Secretary',theme:'improved organisation and attendance'},
 {countries:['India','USA','New Zealand','West Indies','Japan'],sports:['netball','basketball','athletics'],role:'Public Relations Officer',theme:'better communication and participation'}
];
const papers=variations.map((v,index)=>({
 id:'structured-'+(index+1),title:'Physical Education Structured Paper '+(index+1),
 questions:[
 {section:'B',topic:'sports',marks:10,stem:'Name TWO sports meaningfully associated with EACH of these countries or regions: '+v.countries.join(', ')+'. Present your response as a table with Country/Nation, Sport 1 and Sport 2. (2 marks for each country or region.)'},
 {section:'B',topic:'governance',marks:9,stem:'Complete a sport governance table for THREE of these sports: '+v.sports.join(', ')+'. For EACH sport, name an appropriate local (Saint Lucia), regional (Caribbean) and international organisational body. (3 marks per sport.) Check official names before submitting; some sports have different regional structures.'},
 {section:'B',topic:'governance',marks:1,stem:'State ONE responsibility of the government minister or ministry responsible for sport in Saint Lucia. This is a role question, not a request to name the current minister.'},
 {section:'B',topic:'governance',marks:2,stem:'Describe TWO distinct responsibilities of the ministry responsible for sport in Saint Lucia. (1 mark each.)'},
 {section:'B',topic:'participation',marks:3,stem:'Explain THREE different reasons students should participate in Physical Education and sport. Include at least one physical, social or personal benefit. (1 mark per relevant reason.)'},
 {section:'C',topic:'clubs',marks:2,stem:'Write the OPENING of a school Sports Club election speech. Introduce yourself, identify the role of '+v.role+' and explain why you are interested in serving. Your complete speech across Section C should be 75–100 words.'},
 {section:'C',topic:'clubs',marks:5,stem:'For your election speech as '+v.role+', state FIVE distinct personal skills or qualities that would help you lead or serve effectively. (1 mark per quality.)'},
 {section:'C',topic:'planning',marks:5,stem:'For your election speech, explain FIVE specific changes, improvements or activities you would promote if elected. At least one proposal should help '+v.theme+'. (1 mark per suitable proposal.)'},
 {section:'C',topic:'planning',marks:3,stem:'Write a persuasive CLOSING statement asking students to support you. Link the conclusion to your leadership promises, use respectful language and a clear call to vote. (3 marks.)'}
 ]}));
window.BSS_PE_WRITTEN=papers;
})();