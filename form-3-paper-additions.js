/* Supplemental original Form 3 items for five distinct 60-question mixed papers. */
(function(){
'use strict';
const x={vocabulary:[],grammar:[],reading:[]};
const vocab=[
['The journalist described the information as unverifiable. Which word BEST explains "unverifiable" in this context?',['Not supported by evidence','Not yet independently confirmed','Not officially recorded','Widely publicised'],1,'Unverifiable means unable to be independently confirmed.'],
['The committee regarded the finding as tentative. Which option is the MOST accurate interpretation?',['Based on insufficient evidence for a final decision','Likely to be accepted after a vote','Not yet final or firmly established','Unrelated to the original investigation'],2,'Tentative means provisional rather than settled.'],
['The new guidelines were intended to mitigate the problem. What does "mitigate" MOST nearly mean?',['Record the extent of the difficulty','Reduce the seriousness of the problem','Prevent the problem from ever occurring','Explain the history of the organisation'],1,'Mitigate means make something less severe, not necessarily eliminate it.'],
['The principal asked for a succinct account of the incident. What kind of account was requested?',['A brief account containing the essential details','A complete account including every minor event','An account supported by additional witnesses','An account written in chronological order'],0,'Succinct means brief and clear without unnecessary detail.'],
['Her explanation was plausible, although further evidence was needed. What does "plausible" suggest?',['Supported by conclusive evidence','Likely to be true but not yet established','Expressed with complete confidence','Rejected by everyone who heard it'],1,'Plausible means reasonable or believable, not conclusively established.']
];
vocab.forEach(q=>x.vocabulary.push(q));
const grammar=[
['Had the students followed the instructions, they _____ the mistake.',['would avoid','would have avoided','will have avoided','are avoiding'],1,'Past unreal condition requires would have + past participle.'],
['The results of the survey, rather than the opinion of its author, _____ the conclusion.',['supports','support','supporting','has supported'],1,'The plural subject results takes support.'],
['The equipment must be inspected before it _____ for use.',['is approved','will be approved','has approving','approve'],0,'After before, present simple can express a future condition; the equipment receives approval.'],
['By next June, the class _____ the project for an entire year.',['will have been developing','had developed','has developing','develop'],0,'Future perfect continuous expresses an activity continuing to a future point.']
];grammar.forEach(q=>x.grammar.push(q));
const readings=[
{title:'Evaluating an Online Claim',text:'A message circulated among students claiming that the school had cancelled a scheduled field trip. The message contained no date or official source. Several students forwarded it immediately, but Form 3 representative Kira contacted the school office before sharing it. Staff confirmed that the trip would take place, although departure had moved from 8:30 to 9:00 a.m. Kira posted the verified update and encouraged classmates to check announcements before forwarding them. Her approach prevented more students from acting on incorrect information.',
items:[
['Which information in the original message made it difficult to trust?',['It was sent by a student','It lacked a date and an official source','It discussed a planned field trip','It was forwarded before lunchtime'],1,'The absence of a date and reliable source limited credibility.'],
['Which action most clearly shows Kira checked the claim?',['She waited until the day of the trip','She asked classmates whether they believed it','She contacted the school office','She read the message several times'],2,'Contacting the office provided direct verification.'],
['What was the actual change to the field trip?',['Its destination changed','It was cancelled indefinitely','Its departure time was delayed by 30 minutes','It became an overnight visit'],2,'Departure shifted from 8:30 a.m. to 9:00 a.m.'],
['What can be inferred about Kira’s decision?',['She recognised that accuracy matters before sharing information','She believed every forwarded message','She thought school announcements were unnecessary','She wanted classmates to cancel all plans'],0,'Her verification helped prevent the spread of a false claim.'],
['Which main idea BEST summarises the passage?',['Social media should never be used for school communication','Trip schedules cannot be changed once announced','Verifying information prevents the spread of misleading claims','School offices should receive fewer enquiries'],2,'The sequence demonstrates verification and responsible communication.']
]},
{title:'The Community Food Garden',text:'A youth group established a small garden on unused community land. At first, some members wanted to grow only tomatoes because they were popular at local markets. An agricultural officer explained that growing several crops could help the group manage pests and changing weather. The young people agreed to plant leafy vegetables, beans and tomatoes. They recorded rainfall and plant growth weekly. After three months, they noticed that some crops performed better in the dry periods than others. They decided to use their records when planning the next planting season.',
items:[
['Why did the officer recommend growing several crops?',['To make every plant mature on the same day','To reduce risks from pests and changing weather','To avoid recording plant growth','To replace the need for irrigation entirely'],1,'Varied crops can respond differently to pests and conditions.'],
['Which action made it possible to compare crop performance?',['Keeping weekly rainfall and growth records','Selling produce before it was harvested','Selecting crops only by market popularity','Changing the garden location every week'],0,'Records gave evidence for comparing results.'],
['What did the group learn after three months?',['The garden could grow only one crop','All crops reacted identically to dry weather','Different crops responded differently to dry conditions','The agricultural officer had stopped visiting'],2,'Their observations showed variation across crops.'],
['Which statement is an inference rather than a stated fact?',['The group planted beans and tomatoes','The group collected observations weekly','Some crops performed better during dry periods','The group was becoming more evidence-based in its decisions'],3,'Using results to plan suggests evidence-based decision-making; the other details are stated.'],
['What is the main idea of the passage?',['Market demand should be ignored in every farming decision','Careful planning and observation can improve community gardening','A garden can be successful only in the rainy season','Youth groups should avoid agricultural advice'],1,'Crop diversity and observation supported future decisions.']
]}
];
readings.forEach(p=>p.items.forEach(q=>x.reading.push([...q,p.title+'\n\n'+p.text])));
window.FORM3_PAPER_ADDITIONS=x;
})();
