/* Form 3 Principles of Business original 50-mark structured papers.
 * Original exam: Q1 matching 10; Q2 fill blanks 10; Q3 stakeholders 20; Q4 leadership 10.
 */
(function(){'use strict';
const cases=[
 {owner:'Samuella',company:'Island Fresh Juice',product:'bottled fruit juice',materials:'mangoes, pineapples and oranges',equipment:'juicer and refrigerator',marketing:'social media and supermarket visits'},
 {owner:'Jaden',company:'Lucian Cocoa Treats',product:'packaged cocoa snacks',materials:'cocoa, flour and sugar',equipment:'mixing machine and display refrigerator',marketing:'community posters and school fairs'},
 {owner:'Alicia',company:'Morne Craft Works',product:'handmade wooden souvenirs',materials:'local wood, paint and varnish',equipment:'woodworking tools and display shelves',marketing:'online photographs and local craft markets'}
];
const terms=[
 ['CAPITAL','Money or productive resources invested to establish and operate a business'],
 ['PROFIT','The positive difference when business revenue exceeds costs'],
 ['BARTER','The direct exchange of goods or services without money'],
 ['PRINCIPLE','A basic truth, rule or belief that guides decisions'],
 ['ORGANISATION','People working together in a structured way towards a shared objective']
];
const wordBank=['entrepreneur','savings','capital','labour','enterprise','manufacturing','marketing','sales','profit','consumers','rent','government'];
const blanks=[
 ['entrepreneur','The person who identifies the opportunity, organises the company and accepts business risk'],
 ['savings','Personal funds set aside before the business opened'],
 ['capital','Money and equipment required to establish and run the business'],
 ['labour','The human work provided by employees'],
 ['enterprise','An organised business undertaking that produces or sells goods or services'],
 ['manufacturing','The activity of transforming raw materials into a finished product'],
 ['marketing','Efforts to promote the product and reach potential customers'],
 ['sales','Transactions when customers pay for the business products'],
 ['profit','A positive balance after deducting business costs from revenue'],
 ['consumers','People who buy or use the company's finished products']
];
const leaders=[
 ['Autocratic','The leader makes decisions independently, with little group consultation'],
 ['Democratic','The leader discusses choices with workers and invites ideas'],
 ['Charismatic','The leader motivates team members through personal enthusiasm and vision'],
 ['Laissez-faire','The leader trusts experienced staff to organise their tasks with minimal direct supervision'],
 ['Democratic','Team members participate in choosing a new work schedule'],
 ['Autocratic','A supervisor imposes every decision without asking workers'],
 ['Charismatic','A leader inspires workers to share an ambitious company vision'],
 ['Laissez-faire','Staff choose their working methods independently after receiving clear objectives'],
 ['Democratic','Workers vote on a proposal after discussing its advantages'],
 ['Autocratic','The manager expects strict obedience and gives little opportunity for feedback']
];
const papers=cases.map((c,i)=>{
 const passage=c.owner+' starts '+c.company+', a small Saint Lucian business selling '+c.product+'. The company buys '+c.materials+', uses a '+c.equipment+', employs workers and promotes products through '+c.marketing+'. It records sales, costs and customer comments.';
 const questions=[];
 terms.forEach(([term,def],j)=>questions.push({section:'1',topic:'terms',marks:2,stem:'Match the term '+term+' to the correct meaning. The shuffled definitions appear in the reference table. Give the correct letter for '+term+'.',reference:'matching'}));
 blanks.forEach(([answer,clue],j)=>questions.push({section:'2',topic:({entrepreneur:'business',savings:'terms',capital:'terms',labour:'production',enterprise:'business',manufacturing:'production',marketing:'terms',sales:'terms',profit:'terms',consumers:'production'})[answer],marks:1,
 stem:'Business case study: '+passage+' Blank '+(j+1)+' of 10. Choose the most appropriate term from the displayed 12-term word bank. Clue: '+clue+'.',reference:'wordbank'}));
 questions.push({section:'3',topic:'stakeholders',marks:3,stem:'Define stakeholder and explain briefly why the interests of stakeholders matter to '+c.company+'.',reference:'stakeholders'});
 questions.push({section:'3',topic:'stakeholders',marks:7,stem:'Classify SEVEN suitable stakeholders of '+c.company+' as internal or external using the two-column table. Include staff, owners, customers, suppliers, lenders, government and the community as relevant.',reference:'stakeholders'});
 questions.push({section:'3',topic:'stakeholders',marks:2,stem:'Which external stakeholder collects business taxes? Explain its role.',reference:'stakeholders'});
 questions.push({section:'3',topic:'stakeholders',marks:2,stem:'Identify a stakeholder who supplies raw materials or services to the business. Explain what they provide.',reference:'stakeholders'});
 questions.push({section:'3',topic:'stakeholders',marks:4,stem:'Describe TWO ways employees could benefit if '+c.company+' grows and succeeds. Explain each benefit.',reference:'stakeholders'});
 questions.push({section:'3',topic:'stakeholders',marks:2,stem:'Explain ONE possible effect on the local community if '+c.company+' closes.',reference:'stakeholders'});
 leaders.forEach(([label,behaviour],j)=>questions.push({section:'4',topic:'leadership',marks:1,stem:'Identify the leadership style described: '+behaviour+'. Choose Autocratic, Democratic, Charismatic or Laissez-faire.'}));
 return {id:'structured-'+(i+1),title:'Principles of Business Structured Paper '+(i+1),passage,matching:terms.map(([term,definition],j)=>({term,definition,letter:'ABCDE'[(j+i*2)%5]})),wordBank,questions};
});
window.BSS_POB_WRITTEN=papers;
})();