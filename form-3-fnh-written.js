/* Original 84-mark written Form 3 Food, Nutrition & Health papers.
   Section B 51 marks; Section C 33 marks. Source exam's Section A labels 40 marks but prints 39 items.
   School-style mocks use 40 original objective items to achieve consistent 124-mark total.
*/
(function(){'use strict';
const contexts=[
{meat:'chicken and vegetable stew',group:'Teenager',topic:'Vegetarian',fnh:'teenage athlete'},
{meat:'stewed fish with root vegetables',group:'School Child',topic:'Convalescent',fnh:'school-aged learner'},
{meat:'lean beef and provision stew',group:'Elderly',topic:'Vegetarian',fnh:'older adult'}
];
const questions=(v,i)=>[
{section:'B',topic:'stew',marks:3,stem:'Define stewing. Include the use of liquid, low or gentle heat and the cooking vessel.'},
{section:'B',topic:'stew',marks:3,stem:'Outline THREE benefits of using stewing as a cooking method. Give a different benefit for each mark.'},
{section:'B',topic:'stew',marks:2,stem:'State TWO disadvantages of stewing. Consider time, texture or nutrient losses.'},
{section:'B',topic:'stew',marks:4,stem:'You are entering a school cookery competition. Describe how you would safely prepare, cook and attractively serve '+v.meat+' using the stewing method.'},
{section:'B',topic:'pressure',marks:5,stem:'Study the pressure-cooker diagram. Name FIVE labelled or visible parts. Include appropriate parts such as lid, pressure-control valve, sealing gasket, handles and cooking pot.',visual:'pressure'},
{section:'B',topic:'pressure',marks:3,stem:'State ONE function for EACH of THREE pressure-cooker parts you identified. Number your responses.'},
{section:'B',topic:'pressure',marks:2,stem:'Explain ONE essential safety precaution when using a pressure cooker and why it matters.'},
{section:'B',topic:'diet',marks:4,stem:'Explain FOUR reasons why food and nutrient needs vary from person to person, using growth, age, activity and health examples.'},
{section:'B',topic:'nutrients',marks:4,stem:'A 14-year-old is advised to consume iron-rich foods together with sources of vitamin C. Explain why iron and vitamin C are useful and suggest suitable food sources.'},
{section:'B',topic:'diet',marks:10,stem:'Prepare a short, well-organised presentation for Form 5 students on '+v.topic+' dietary needs. Define the term, describe the main nutritional considerations, suggest suitable meals and explain two practical planning points.'},
{section:'B',topic:'diet',marks:1,stem:'Select ONE group to plan a light breakfast menu for: Elderly, Teenager, School Child or Toddler. Clearly name the group selected. You may choose '+v.group+' or another.'},
{section:'B',topic:'diet',marks:4,stem:'Write a balanced light breakfast menu suitable for the group you selected. Include portions or food groups and an appropriate drink.'},
{section:'B',topic:'diet',marks:1,stem:'Give the usual age range for the group selected, noting that definitions can vary across sources.'},
{section:'B',topic:'diet',marks:5,stem:'Recommend suitable foods for the group selected and explain WHY they support that group’s needs. Avoid assuming everyone in the group has exactly the same needs.'},
{section:'C',topic:'cakes',marks:5,stem:'Name FIVE typical cake ingredients. Examples can be selected from flour, fat, sugar, eggs and raising agent, as appropriate to the cake method.'},
{section:'C',topic:'cakes',marks:10,stem:'Choose TWO of the five cake ingredients you named and explain the role each plays in cake making, giving specific detail and examples.'},
{section:'C',topic:'cakes',marks:12,stem:'Complete a cake-method table with FOUR different methods of cake making, and give TWO suitable examples of cake made by each method. Include creaming, melting, rubbing-in and whisking or another syllabus-approved method as appropriate.'},
{section:'C',topic:'faults',marks:6,stem:'Study the THREE cake fault illustrations. Give ONE plausible cause and ONE preventative action for EACH: (a) sunken centre; (b) burnt, peaked top; (c) fruit sinking to the base.',visual:'cakes'}
];
const papers=contexts.map((v,i)=>({id:'structured-'+(i+1),title:'Food, Nutrition & Health Structured Paper '+(i+1),questions:questions(v,i)}));
window.BSS_FNH_WRITTEN=papers;
})();