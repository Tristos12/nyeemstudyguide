/* Original structured questions based on the uploaded Form 3 Social Studies examination.
Sections 2:16, 3:14, 4:16. A complete school-style revision mock =20+46=66 marks.
*/
(function(){'use strict';
const cases=[
 {family:'Charles',income:3500,costs:[['Rent',900],['Food',850],['Electricity and water',250],['Transportation',400],['School expenses',300],['Telephone and internet',150],['Entertainment',200]],partners:['Abigail','Sam'],children:['Shadae','Kenya'],relationship:'married'},
 {family:'Joseph',income:4200,costs:[['Rent',1100],['Food',980],['Electricity and water',360],['Transportation',480],['School expenses',330],['Telephone and internet',190],['Entertainment',240]],partners:['Renee','Marcus'],children:['Leo','Maya'],relationship:'married'},
 {family:'Pierre',income:3100,costs:[['Rent',780],['Food',740],['Electricity and water',290],['Transportation',380],['School expenses',250],['Telephone and internet',160],['Entertainment',220]],partners:['Nadia','Andre'],children:['Jules','Ari'],relationship:'married'}
];
window.BSS_SOCIAL_WRITTEN=cases.map((c,i)=>{
 const table=c.costs.map(([k,v])=>k+' $'+v).join('; '),balance=c.income-c.costs.reduce((s,x)=>s+x[1],0);
 return {id:'structured-'+(i+1),title:'Social Studies Structured Paper '+(i+1),income:c.income,costs:c.costs,questions:[
 {section:'2',topic:'roles',marks:4,visual:'roles',stem:'Study the family-role illustrations. State TWO traditional expectations assigned to men and TWO traditionally assigned to women. Describe these as historical social expectations, not rules that all families must follow.'},
 {section:'2',topic:'roles',marks:4,stem:'Explain TWO factors contributing to changes in family roles and responsibilities. Give a developed explanation for each factor.'},
 {section:'2',topic:'roles',marks:4,stem:'Discuss TWO effects that changing family roles can have on family life. You may include opportunities or challenges.'},
 {section:'2',topic:'conflict',marks:2,stem:'Suggest ONE realistic way family members can support one another when work and care roles change.'},
 {section:'2',topic:'conflict',marks:2,stem:'Explain WHY your suggested support strategy is likely to help the family.'},
 {section:'3',topic:'budget',marks:1,stem:'The '+c.family+' family earns $'+c.income+' monthly. Their budget is: '+table+'. Which single expense is the largest?'},
 {section:'3',topic:'budget',marks:2,stem:'From the '+c.family+' family budget, identify TWO expenses that are important household NEEDS.'},
 {section:'3',topic:'responsibility',marks:1,stem:'State ONE lawful way a family member could earn extra income.'},
 {section:'3',topic:'budget',marks:2,stem:'Explain ONE reason why preparing a monthly household budget is useful.'},
 {section:'3',topic:'budget',marks:2,stem:'Suggest ONE expense from the '+c.family+' family budget that could be reduced to increase savings, and give a reason.'},
 {section:'3',topic:'responsibility',marks:4,stem:'Suggest TWO practical strategies parents or guardians can use to teach children financial responsibility. Give enough detail for each strategy.'},
 {section:'3',topic:'responsibility',marks:2,stem:'Explain why ONE of your suggested strategies helps children learn financial responsibility.'},
 {section:'4',topic:'unions',marks:3,stem:c.partners[0]+' and '+c.partners[1]+' are married and live with their two children, '+c.children.join(' and ')+'. Identify the union described and name TWO OTHER types of family union found in Caribbean society.'},
 {section:'4',topic:'conflict',marks:2,stem:'Explain ONE reason why a couple might seek a divorce, apart from frequent arguments.'},
 {section:'4',topic:'conflict',marks:2,stem:'State TWO possible effects of divorce or parental separation on children. Avoid assuming every child experiences the same effects.'},
 {section:'4',topic:'unions',marks:2,stem:'Give ONE reason a couple might choose a cohabiting or common-law relationship instead of a formal marriage.'},
 {section:'4',topic:'conflict',marks:4,stem:'Suggest TWO realistic, respectful approaches '+c.partners[0]+' and '+c.partners[1]+' could use to reduce conflict in their household. Explain what they would do.'},
 {section:'4',topic:'conflict',marks:3,stem:'Explain WHY ONE of your conflict-reduction strategies might support the couple and their children. Give a clear reason and practical example.'}
 ]};
});
})();