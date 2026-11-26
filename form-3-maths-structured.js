/* Three original Form 3 mathematics constructed-response exam variants.
 * 30 written marks: Section B 20, Section C 10.
 * Responses require teacher review. Not automatically marked.
 */
(function(){
 const variants=[
 {name:'Structured Exam 1',multiplication:'3.24 × 2.5 × 4.8',second:'120 × 0.45²',fractionA:'(2 1/2 − 1 1/4) ÷ (5/8)',fractionB:'(3/4 + 5/6) × (12/19)',asset:18000,loss:25,profit:30,first:6,step:6,target:126},
 {name:'Structured Exam 2',multiplication:'4.25 × 1.8 × 3.6',second:'175 × 0.24²',fractionA:'(3 1/3 − 1 5/6) ÷ (3/4)',fractionB:'(7/8 + 1/2) × (8/11)',asset:24000,loss:35,profit:40,first:7,step:5,target:127},
 {name:'Structured Exam 3',multiplication:'5.12 × 2.4 × 1.75',second:'240 × 0.35²',fractionA:'(4 1/4 − 2 2/3) ÷ (5/6)',fractionB:'(3/5 + 7/10) × (10/13)',asset:16500,loss:20,profit:45,first:9,step:4,target:125}
 ];
 const papers=variants.map((v,i)=>({
 id:'structured-'+(i+1),name:v.name,sectionB:[
 {marks:3,stem:'Calculate '+v.multiplication+'. Show your working. Give (a) the exact value, (b) the result to 3 decimal places, and (c) the result to 4 significant figures.'},
 {marks:3,stem:'Evaluate '+v.second+'. Show the exact answer, then round it to 2 decimal places and 3 significant figures.'},
 {marks:4,stem:'Evaluate the following fraction expression exactly, showing each step: '+v.fractionA+'. Express the answer in simplest form.'},
 {marks:4,stem:'Evaluate '+v.fractionB+'. Show how you converted mixed or unlike fractions and simplified the exact result.'},
 {marks:3,stem:'A second-hand vehicle originally cost $'+v.asset+'. Its owner sold it at a loss of '+v.loss+'%. Calculate the first selling price and show the percentage calculation.'},
 {marks:3,stem:'The new owner sold that vehicle for a profit of '+v.profit+'% on the price they paid. Calculate the second selling price and explain why the profit is based on the new purchase price.'}
 ],sectionC:[
 {marks:2,stem:'A matchstick pattern has '+v.first+' sticks in Figure 1 and increases by '+v.step+' sticks for each new figure. Draw or describe Figure 4, including the number of matchsticks.'},
 {marks:4,stem:'Complete a table for Figure 5 and Figure 6 of this pattern. For each, give a general-expression substitution and the total number of matchsticks.'},
 {marks:2,stem:'Write an algebraic rule for the number of matchsticks in Figure n and explain how the rule follows from the pattern.'},
 {marks:2,stem:'Which figure uses '+v.target+' matchsticks? Form and solve an equation using your rule.'}
 ]}));
 window.BSS_MATH_STRUCTURED=papers;
})();