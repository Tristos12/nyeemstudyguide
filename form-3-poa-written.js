(function(){'use strict';
const cases=[
{owner:'Jordan',company:'a Saint Lucian supermarket',sale:'daily sales receipts',payroll:'weekly payroll sheets',supplier:'payments to suppliers',customer:'cash received from customers'},
{owner:'Amara',company:'a local stationery shop',sale:'counter sales records',payroll:'monthly wage sheets',supplier:'supplier invoice payments',customer:'customer deposits'},
{owner:'Kareem',company:'a small bakery in Castries',sale:'cash sales entries',payroll:'staff payroll records',supplier:'payments to flour suppliers',customer:'receipts from customers'}
];
const tasks=c=>[
'A cashier records '+c.sale,
'An accountant prepares an income statement',
'A payroll clerk prepares '+c.payroll,
'A payables clerk records '+c.supplier,
'An accountant analyses financial statements',
'A receivables clerk records '+c.customer
];
const stakeholders=['Investors','Employees','Managers','Government','Society','Tax collectors','Owners','Suppliers','Customers','Banks'];
const reasons=[
'Owners depend on the business for profit and investment returns',
'Society may benefit from sponsorship and community contributions',
'Suppliers want assurance the business can pay for goods provided',
'Government is interested in tax revenue',
'Customers depend on businesses for reliable goods and services'
];
const tf=[
['Accounting and bookkeeping mean exactly the same thing.','F'],
['Bookkeeping is an important part of the accounting process.','T'],
['Accounting helps business owners make informed financial decisions.','T'],
['Good financial control helps businesses manage money effectively.','T'],
['Accounting information helps determine whether there is a profit or a loss.','T'],
['Good financial control matters only for large businesses.','F'],
['Spending business money without keeping records is poor financial control.','T'],
['Owners use accounting information to monitor performance.','T'],
['Only the owner benefits from accounting information.','F'],
['Investors may use accounting information when deciding whether to invest.','T']
];
const papers=cases.map((c,i)=>({id:'structured-'+(i+1),title:'Principles of Accounts Structured Paper '+(i+1),tasks:tasks(c),stakeholders,reasons,tf,questions:[
{section:'2',topic:'terms',marks:8,stem:'Question 1: Define each of the following terms, giving a clear explanation worth TWO marks per term: (a) Accounting; (b) Loss; (c) Profit; (d) Bookkeeping.'},
{section:'2',topic:'control',marks:6,stem:'Question 2: Complete the SIX numbered blanks in the financial-control flow diagram. Use each term ONCE from this list: Profit; Loss; Trade; Constant Cash Flow; Business; Constant Profit. Study how good and poor financial control can affect a business.',reference:'control'},
{section:'2',topic:'profit',marks:6,stem:'Question 3: State and explain THREE aims of a business. Write a separate aim and explanation for each (2 marks each).'},
{section:'2',topic:'jobs',marks:6,stem:'Question 4: '+c.owner+' works in '+c.company+'. Classify each of the SIX activities in the table as primarily Bookkeeping or Accounting. Use the nature of the activity rather than the job title alone.',reference:'jobs'},
{section:'2',topic:'internal',marks:9,stem:'Question 5: From the TEN stakeholders shown, classify THREE internal users and SIX external users of accounting information. Place each user in the correct column. The term Society refers to the wider community.',reference:'stakeholders'},
{section:'2',topic:'external',marks:5,stem:'Question 6: Match each of the FIVE statements about interests in accounting information to the correct user: Owners, Customers, Society, Suppliers or Government. One mark for each correct match.',reference:'reasons'},
{section:'2',topic:'review',marks:10,stem:'Question 7: Indicate TRUE or FALSE for each of the ten statements about accounting, bookkeeping, profit, financial control and users of information. One mark per statement.',reference:'tf'}
]}));
window.BSS_POA_WRITTEN=papers;
})();