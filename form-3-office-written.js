/* Original Form 3 Office Administration Section Two papers.
  Q1-Q4: 10 marks each, following the uploaded 45-mark examination.
  The exam has ambiguous term definitions and business size examples; these
  papers use clarified wording and do not silently auto-grade written work.
*/
(function(){'use strict';
const options=[
 {organisation:'Babonneau Community Services Office',staff:'staffing changes after a new branch opens',setting:'a reception area with a computer, printer and filing cabinet'},
 {organisation:'Castries Customer Support Office',staff:'workers reassigned after a department is reorganised',setting:'an office with a meeting area, desks and digital records'},
 {organisation:'Gros Islet Small Business Centre',staff:'employees moved to serve a new group of customers',setting:'a small office with phones, a filing system and workstations'}
];
const definitions=[
 ['Time Management','using time effectively to complete tasks'],
 ['Effective Communication','speaking and writing clearly'],
 ['Literacy Skills','reading and writing competently'],
 ['Numeracy','working accurately with numbers'],
 ['Computer Literacy','using computers and office software competently'],
 ['Problem Solving/Analytical Skills','identifying problems, evaluating information and proposing solutions']
];
const relations=[
 'Appreciate the pressure a supervisor may be under',
 'Resolve routine problems before escalating appropriately to a supervisor',
 'Respect the supervisor’s position and legitimate instructions',
 'Remember that helping the client is part of your work',
 'Greet and address clients promptly and courteously',
 'Be approachable and friendly with colleagues',
 'Treat colleagues fairly and respectfully',
 'Be reliable and cooperative with colleagues',
 'Offer appropriate help to colleagues'
];
const departments=[
 ['Records Management Office','looks after documents and filing'],
 ['Human Resource Management Office','supports recruitment, selection and staffing'],
 ['Accounts Office','processes money received and payments'],
 ['Procurement and Stock Control Office','purchases supplies and monitors stock'],
 ['Customer Service Office','handles customer enquiries']
];
const papers=options.map((v,index)=>({id:'structured-'+(index+1),title:'Office Administration Structured Paper '+(index+1),questions:[
 {section:'2',topic:'skills',marks:10,stem:'Question 1 (10 marks). (a) Match SIX desired office worker skills with their definitions, writing each letter next to its correct skill (6 marks). (b) Define the term OFFICE (2 marks). (c) Define employee DEPLOYMENT (2 marks).',reference:'skills'},
 {section:'2',topic:'equipment',marks:10,stem:'Question 2 (10 marks). Draw a useful office layout for '+v.organisation+'. Your drawing must include and clearly LABEL TEN suitable office items. You may use the coloured drawing canvas, type an item-by-item description, or upload a photograph of your own drawing. Allocate one mark for each appropriate, labelled item.',reference:'drawing'},
 {section:'2',topic:'relationships',marks:10,stem:'Question 3 (10 marks). (a) For the NINE statements in the relationship table, write Supervisor, Colleagues or Clients as appropriate (3 marks, one mark for every three correct classifications). (b) Identify FOUR main functions of an office (4 marks). (c) Give a suitable example of each: a sole trader, a partnership and a large business. Explain that type of ownership does not by itself determine size (3 marks).',reference:'relationships'},
 {section:'2',topic:'departments',marks:10,stem:'Question 4 (10 marks). (a) Match the FIVE office departments to their functions using the table shown (5 marks). (b) Complete the production flow diagram with FIVE labels (5 marks): Material, Labour and Capital enter as inputs, pass through Production, and result in Goods and Services as outputs. The terms Inputs, Production and Outputs are shown as category headings.',reference:'production'}
 ],skills:definitions,relations,departments,caseStudy:v.staff}));
window.BSS_OFFICE_WRITTEN=papers;
})();