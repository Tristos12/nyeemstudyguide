/* Grade 9 mathematics detailed instructional units, based on the school's Term 1 assessment topics. */
window.BSS_MATH_LESSONS=[
{key:'fractions',title:'Fractions and Mixed Numbers',goals:['Identify proper, improper and mixed fractions.','Convert mixed numbers and improper fractions.','Explain the size of a fraction.'],steps:[
['Understand the vocabulary','A proper fraction has a numerator smaller than its denominator. An improper fraction has a numerator equal to or larger than its denominator. A mixed number contains a whole number and a proper fraction. “Prime fraction” is not one of these conventional classifications.'],
['Mixed to improper','To change 4 3/5 into an improper fraction, calculate (4 × 5 + 3)/5 = 23/5. Keep the denominator unchanged.'],
['Improper to mixed','Divide numerator by denominator: 23 ÷ 5 = 4 remainder 3, so 23/5 = 4 3/5.'],
['Test your answer','Convert back to the original form. A fraction such as 23/5 must be greater than 4 but smaller than 5.']],example:'5 2/7 = (5 × 7 + 2)/7 = 37/7.',check:'Convert 29/6 to a mixed number and 3 4/9 to an improper fraction.'},
{key:'operations',title:'Operations with Fractions',goals:['Find common denominators when adding and subtracting.','Multiply and divide fractions accurately.','Simplify exact answers.'],steps:[
['Adding and subtracting','For 2/3 + 1/4, use denominator 12: 8/12 + 3/12 = 11/12. Never simply add numerator to numerator and denominator to denominator.'],
['Multiplication','For 3/5 × 10/9, multiply top and bottom to get 30/45, then reduce by 15 to 2/3.'],
['Division','For 5/6 ÷ 2/3, change division to multiplication by the reciprocal: 5/6 × 3/2 = 15/12 = 5/4.'],
['Mixed expressions','Convert mixed numbers first. Use brackets and multiplication before addition or subtraction. Show steps for constructed responses.']],example:'1 1/2 + 2/3 = 3/2 + 2/3 = 9/6 + 4/6 = 13/6 = 2 1/6.',check:'Evaluate 3/4 + 5/8, 2/3 × 9/10, and 5/6 ÷ 2/3.'},
{key:'decimals',title:'Decimals and Rounding',goals:['Locate place values after the decimal point.','Round accurately to 2 or 3 decimal places.','Use rounding in practical calculations.'],steps:[
['Identify place values','Digits after the decimal are tenths, hundredths, thousandths and ten-thousandths. In 5.3466, the first three decimal digits are 346.'],
['Apply the rounding rule','For 5.3466 to 3 decimal places, inspect the fourth decimal digit (6). Raise the third from 6 to 7, giving 5.347.'],
['Avoid common errors','A question asking for 2 decimal places must show two decimal digits, even if a trailing zero is needed. 2.0847 becomes 2.08, not 2.1.'],
['Estimate for reasonableness','When dividing the cost of a packet among its contents, estimate and then use the calculator for accuracy.']],example:'8.7395 to 2 d.p. is 8.74. To 3 d.p., it is 8.740.',check:'Round 12.8956 to two decimal places and 4.8764 to three decimal places.'},
{key:'significant',title:'Significant Figures',goals:['Identify significant digits.','Handle leading and trailing zeros.','Round measurements correctly.'],steps:[
['Start counting at the first non-zero digit','In 0.003250, the zeros before 3 are placeholders. The significant digits are 3, 2, 5 and the final zero, so the number has 4 significant figures.'],
['Zeros within a number count','1004 contains four significant figures because the zeros lie between non-zero digits.'],
['Round to the required precision','2747 to 3 significant figures gives 2750. The first three digits are 2, 7, 4; the fourth digit is 7 and forces rounding.'],
['Explain precision','The number of significant figures measures how precisely a value is stated. Always interpret trailing zeros in context.']],example:'0.04627 to 2 significant figures is 0.046.',check:'How many significant figures are in 0.3250? Round 56842 to three significant figures.'},
{key:'standard',title:'Standard Form and Powers of Ten',goals:['Read powers of ten correctly.','Convert ordinary numbers into scientific notation.','Convert small and large quantities accurately.'],steps:[
['Understand the format','Scientific notation uses a × 10^n where 1 ≤ a < 10 and n is an integer.'],
['Large numbers','4.2 × 10^3 means 4.2 × 1000 = 4200. Move the decimal point three places right.'],
['Small numbers','0.0000004 is 4 × 10^-7. Seven moves to the right produce the coefficient 4, so the exponent is negative.'],
['Check magnitude','A positive exponent usually means a large value; a negative exponent describes a value between 0 and 1 when the coefficient is from 1 to 10.']],example:'0.000083 = 8.3 × 10^-5.',check:'Convert 6.7 × 10^4 to ordinary form; express 0.00052 in standard form.'},
{key:'consumer',title:'Consumer Arithmetic: VAT, Discounts and Profit',goals:['Calculate percentages of amounts.','Find VAT-inclusive and discounted prices.','Distinguish cost price from selling price.'],steps:[
['Convert a percentage to a decimal','15% = 0.15. A 15% tax on $200 is 0.15 × $200 = $30. Total including tax is $230.'],
['Discounts','For a $760 tablet discounted to $608, the reduction is $152. Discount rate is $152 ÷ $760 × 100 = 20%.'],
['Profit and loss','Selling at a loss of 40% means receiving 60% of cost. A subsequent profit of 50% is calculated from the new owner’s purchase cost, not the original cost.'],
['Check the question carefully','“How much is the discount?” asks for the reduction, whereas “selling price” asks for the price after discount.']],example:'A car costs $20,600. At 40% loss it sells for $12,360. A buyer selling at 50% profit receives $18,540.',check:'Calculate the VAT rate when a $4.00 item costs $4.50 including VAT.'},
{key:'data',title:'Pictograms and Data Interpretation',goals:['Interpret a symbol key.','Use full and partial icons.','Compare totals and explain results.'],steps:[
['Read the key first','If one symbol represents four goals, three complete symbols represent twelve goals.'],
['Understand partial symbols','A half-symbol represents two goals when the key is four. A quarter-symbol represents one goal.'],
['Find totals','Count full symbols and partial symbols separately before adding. If the key is four, 3¾ symbols represent 15 goals.'],
['Explain the data','A pictogram is a representation of data, not a precise illustration of the events. Do not count symbols as single goals unless the key says so.']],example:'With 1 symbol = 4 goals, 2½ symbols = 10 goals.',check:'If one icon means six books, how many books do four and a half icons represent?'},
{key:'patterns',title:'Patterns and Matchstick Reasoning',goals:['Identify a constant change.','Write and use a term rule.','Work backwards to find the figure number.'],steps:[
['Count the change','If Figure 1 has five matchsticks and each new figure adds five, the terms are 5, 10, 15, 20, ... .'],
['Write a general term','The rule is nth term = 5n. For a more general arithmetic pattern, nth term = first term + (n − 1) × difference.'],
['Draw the next figure','Continue the shape according to the actual diagram, showing the number of additional dots and segments. Describe the reasoning in words.'],
['Solve in reverse','If the term is 145 in the five-times pattern, solve 5n = 145 to get n = 29.']],example:'A pattern starts at 7 and adds 4: nth term = 7 + 4(n − 1) = 4n + 3.',check:'For the sequence 8, 13, 18, ... find the 12th term and the rule.'},
{key:'computation',title:'Computation, Calculator Skills and Estimation',goals:['Apply correct operation order.','Check exact answers using estimation.','Use calculators without losing mathematical reasoning.'],steps:[
['Use operation order','Complete brackets first, then powers, multiplication and division from left to right, then addition and subtraction.'],
['Multiply and estimate','For 3.43 × 1.9 × 4.6, first estimate 3.5 × 2 × 5 = 35, then calculate accurately; the true result should be near this value.'],
['Exact versus approximate','An exact result is the calculated value before rounding. An approximate result follows a requested decimal-place or significant-figure rule.'],
['Show working','Write the expression, intermediate steps, units and final rounding. A calculator result without working may not earn full constructed-response marks.']],example:'24 ÷ (7 − 3) × 2² − 5 = 24 ÷ 4 × 4 − 5 = 19.',check:'Evaluate 18 + 4 × 7 and round 7.3364 to three decimal places.'},
{key:'proportion',title:'Ratio, Proportion and Unit Rates',goals:['Find and use a unit rate.','Recognise direct proportion.','Solve price and quantity problems.'],steps:[
['Find the unit amount','If 18 cards cost $2.99, the unit cost is $2.99 ÷ 18 ≈ $0.17. Decide whether the question needs an estimate or an exact amount.'],
['Scale proportionally','If 8 notebooks cost $32, each costs $4. Therefore 13 cost $52 at the same rate.'],
['Check the assumptions','Direct proportion requires a constant rate. A special bulk discount would change the unit price, so read the context carefully.'],
['Avoid reversed ratios','Identify which number is price, which is quantity, and whether you need cost per item or items per dollar.']],example:'12 bottles cost $30. One bottle costs $2.50; 7 cost $17.50.',check:'If 15 notebooks cost $45, find the cost of 23 notebooks at the same rate.'}
];