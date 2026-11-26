/* Form 3 PE revision: five 60-question practices, aligned to BSS Term 1 paper. */
(function(){
'use strict';
const topics={fitness:'Fitness and Energy',health:'Hydration, Flexibility and Safety',body:'Body Systems and Growth',sports:'Sports and National Associations',governance:'Sport Organisations and Leadership',participation:'Value of Physical Education',clubs:'Sports Club Roles and Qualities',planning:'Sports Club Activities and Campaigns'};
const sections=Object.keys(topics),counts=[8,8,8,8,7,7,7,7];
const facts={
fitness:[
['The ability to take part in activities while having energy left for other tasks is best described as what?','Physical fitness','Dehydration','Puberty','A joint','Fitness is the ability to meet physical demands and still have energy available.'],
['Which quality best describes the ability of muscles to produce force?','Muscular strength','Dehydration','Height','Body shape','Muscular strength refers to the force muscles can produce.'],
['Which ability allows exercise to continue for a sustained period?','Cardiorespiratory endurance','Flexibility alone','Body mass index','A short sprint only','Cardiorespiratory endurance supports longer periods of aerobic effort.'],
['A student gradually increases exercise duration over several weeks. What is being developed?','Endurance','Dehydration','A joint','Puberty','Regular gradual activity can improve endurance.'],
['What is a safe way to improve physical fitness?','Regular varied activity with rest','Avoid drinking water','Train hard despite injury','Skip all warm-ups','Safe improvement includes appropriate progression and recovery.'],
['A warm-up before sport mainly prepares what?','Body and mind for activity','The scoreboard','A government budget','A medical diagnosis','Warm-ups gradually prepare movement and attention for exertion.'],
['Why should exercise intensity increase gradually?','To allow the body to adapt','To guarantee no sweating','To prevent all muscle use','To remove rest breaks','Progressive training reduces unnecessary overload.'],
['Which example best shows fitness for everyday life?','Climbing stairs without excessive fatigue','Refusing any movement','Losing all water through sweat','Measuring height only','Fitness supports functional activities in daily life.'],
['Which is a component of health-related fitness?','Flexibility','National flag','Hair colour','Team name','Flexibility is a component of health-related physical fitness.'],
['Why is recovery time included in training?','It supports adaptation and reduces overuse','It removes the need for exercise','It permanently eliminates sweating','It replaces hydration','Rest supports adaptation and recovery.']
],
health:[
['Losing too much body water, often through sweating, causes what?','Dehydration','Concussion','Hypothermia','A joint','Dehydration happens when the body loses more fluid than is replaced.'],
['Which action helps prevent dehydration during physical activity?','Drink fluids appropriately','Avoid all liquids','Wear too many layers in heat','Ignore thirst','Drinking fluids helps replace water lost during activity.'],
['Without regular movement and appropriate stretching, muscles may become what?','Tight','Longer automatically','Bones','Organs','Muscles may feel tight and movement range can be reduced.'],
['Which activity is most appropriate for improving flexibility?','Controlled stretching','Only sitting for hours','Skipping warm-ups','Avoiding movement','Controlled stretching can support flexibility.'],
['What should an athlete do if dizzy or unwell in the heat?','Stop and seek assistance','Keep sprinting','Avoid shade','Ignore symptoms','Stop exercise and seek help when heat-related symptoms occur.'],
['Why is a cool-down useful after vigorous activity?','It allows a gradual return to rest','It replaces sleep','It guarantees no injuries','It prevents breathing','A cool-down gradually reduces activity.'],
['Which is a warning sign that additional fluid or rest may be needed?','Dizziness during exercise','An ordinary team name','New trainers','A short exercise plan','Dizziness during activity warrants stopping and checking wellbeing.'],
['How does flexibility help some sporting movements?','It supports a useful joint range of motion','It eliminates all fatigue','It changes a person’s age','It always increases height','Flexibility supports movement through an appropriate range.'],
['Why should stretches not be forced into sharp pain?','Pain can signal risk of injury','Sharp pain improves technique','Pain is always required','Stretching has no limits','Avoid pushing into sharp pain or injury.'],
['Which routine is generally safer before a sporting session?','Warm up, practise, cool down','Begin at maximum effort without preparation','Avoid drinking water','Train despite feeling faint','A planned warm-up and cool-down support safer participation.']
],
body:[
['Where two or more bones meet is called a what?','Joint','Muscle','Nerve','Skin','A joint is the location where bones meet.'],
['The rib cage primarily protects which organs?','Heart and lungs','Brain and eyes','Stomach and toes','Hands and feet','The ribs help protect the heart and lungs.'],
['What does BMI stand for?','Body Mass Index','Body Motion Interval','Basic Muscle Indicator','Body Movement Intake','BMI stands for Body Mass Index.'],
['Which two measurements are used to calculate BMI?','Mass and height','Heart rate and shoe size','Age and surname','Arm length and eye colour','BMI uses body mass and height squared.'],
['What does puberty involve?','Physical and hormonal changes during maturation','The end of all physical growth at a fixed age','A sporting injury','A type of muscle','Puberty is a period of physical maturation involving hormonal changes.'],
['Do all adolescents complete puberty at the same exact age?','No, timing varies among individuals','Yes, at age 13 for everyone','Yes, at age 16 for everyone','Yes, at age 20 for everyone','The timing and pace of puberty vary significantly.'],
['Which statement describes body diversity in sport?','Athletes vary in size and shape','All athletes have identical dimensions','Body shape determines a single suitable sport','All participants grow at one rate','People have different body shapes and sizes.'],
['Which factor can influence changes during adolescence?','Individual developmental timing','Only a student’s team colour','Only shoe brand','Only home address','Puberty and growth differ from person to person.'],
['What does the skeleton provide?','Support and protection','All breathing without lungs','All digestion without organs','A national sporting association','The skeleton supports the body and protects organs.'],
['Which structure connects bones to other bones at joints?','Ligaments','Hair','Lungs','Blood vessels only','Ligaments connect bones to bones and help stabilise joints.']
],
sports:[
['Which sport has a strong traditional association with the West Indies?','Cricket','Ice hockey','Sumo','Nordic skiing','Cricket is deeply associated with the West Indies.'],
['Which sport is strongly associated with New Zealand through the All Blacks?','Rugby union','Table tennis','Baseball','Cricket only','The All Blacks are New Zealand’s national rugby union team.'],
['Which sport is historically associated with Japan as a traditional discipline?','Sumo wrestling','Netball','Ice hockey','Rounders','Sumo is a traditional Japanese sport.'],
['Which sport is widely associated with India at international competition level?','Cricket','American football','Ice hockey','Handball only','Cricket is a major sport associated with India.'],
['Which sport is strongly associated with the United States through the NBA?','Basketball','Sumo','Netball','Rugby sevens only','The NBA is a major professional basketball league in the United States.'],
['What is an appropriate response to a question asking for TWO sports per country?','Give two distinct suitable sports','Repeat the same sport twice','Name two countries instead','Give two players only','Provide two separate sports associated with each named country.'],
['Which pair of sports is associated with the United States?','Basketball and American football','Sumo and kabaddi only','Netball and sumo only','Curling and sumo only','Basketball and American football are strongly associated with the United States.'],
['Which pair is associated with New Zealand?','Rugby union and cricket','Sumo and baseball only','American football and sumo only','Kabaddi and ice hockey only','Rugby union and cricket have significant traditions in New Zealand.'],
['Which pair is strongly associated with Japan?','Sumo and judo','Netball and American football only','Cricket and lacrosse only','Ice hockey and kabaddi only','Sumo and judo have strong Japanese cultural and sporting links.'],
['Why can different sports be associated with one nation?','Sporting traditions and participation vary','Each country may only play one sport','Every nation has identical sporting history','Sport associations never change','Sports have social, historical and cultural connections.']
],
governance:[
['What does a local sporting governing body mainly do?','Organise and develop a sport nationally','Set the laws of every country','Replace all school clubs','Only sell uniforms','National associations organise and develop a sport within a country.'],
['What is a regional sports organisation generally responsible for?','Coordinating sport among countries in a region','Coaching one classroom only','Issuing birth certificates','Managing national elections','Regional bodies coordinate competitions and development across an area.'],
['What does an international sport governing body do?','Oversee rules and competitions internationally','Only manage one school field','Replace every local coach','Organise a single lunch period','International bodies coordinate governance across countries.'],
['Which organisation governs world football?','FIFA','ICC','World Athletics','FIBA','FIFA is the international governing body for association football.'],
['Which international body governs basketball?','FIBA','FIFA','World Athletics','ICC','FIBA is the international basketball federation.'],
['Which international body governs cricket?','International Cricket Council','FIFA','FIBA','World Athletics','The ICC is the international governing body for cricket.'],
['Which global governing body is associated with athletics?','World Athletics','FIFA','FIBA','World Netball','World Athletics oversees international athletics.'],
['Why should sporting associations establish safety policies?','To protect participants and support fair competition','To remove all rules','To prevent participation','To replace all coaching','Policies support athlete wellbeing and fair competition.'],
['Which statement best distinguishes local, regional and international sport bodies?','Their geographic scope differs','They all govern only one school','They have identical responsibilities in every detail','They all operate at the same geographic level','The main distinction is the scale at which they operate.']
],
participation:[
['Which is a physical benefit of taking part in PE?','Improved health-related fitness','Guaranteed exemption from all illness','Elimination of sleep','Automatic increase in height','Regular activity can support fitness.'],
['Which is a social benefit of team sport?','Cooperation with others','Avoiding every teammate','Refusing to communicate','Ignoring agreed rules','Team activities can develop cooperation.'],
['Which emotional skill may PE help students develop?','Confidence and self-control','Permanent immunity to stress','No need for rest','Only memorisation','Positive participation can support confidence and self-regulation.'],
['Why is fair play valued in school sport?','It encourages respect and honesty','It guarantees winning','It removes all competition','It allows cheating','Fair play involves respect for rules and opponents.'],
['How may PE support lifelong health?','It can encourage active habits','It replaces all healthcare','It prevents every possible injury','It makes nutrition irrelevant','Active habits can support longer-term wellbeing.'],
['Which is a leadership benefit of school sport?','Practising responsibility and decision-making','Avoiding all tasks','Refusing feedback','Ignoring others','Sports and club activities can build responsibility.'],
['Why is it useful for students of different abilities to participate?','It supports inclusion and belonging','Only elite athletes benefit','It removes the need for adaptations','Every student must perform identically','Inclusive sport creates opportunities for varied abilities.'],
['Which set gives three appropriate reasons to take part in PE?','Fitness, teamwork and wellbeing','Dehydration, fatigue and exclusion','Only medals, fame and money','Avoiding learning, friendships and rest','PE can support physical, social and emotional development.'],
['Which attitude is helpful for someone learning a new sporting skill?','Practice patiently and accept feedback','Quit after the first mistake','Ignore safety guidance','Blame every teammate','Constructive practice and feedback support skill development.']
],
clubs:[
['Which Sports Club officer usually leads meetings?','President','Treasurer','Equipment manager','Referee only','A president generally leads meetings and represents the club.'],
['Who commonly assists the president and can act in their absence?','Vice President','Spectator','Goalkeeper','Timekeeper only','A vice president helps support club leadership.'],
['Which club role normally keeps minutes and records?','Secretary','Treasurer','Captain only','Coach only','The secretary handles minutes, correspondence and records.'],
['Which position is commonly responsible for funds and financial records?','Treasurer','Secretary','PRO','Referee','A treasurer manages financial records and reports.'],
['Which officer helps publicise club activities and announcements?','Public Relations Officer','Treasurer','Timekeeper','Goalkeeper','A PRO communicates and promotes club information.'],
['Which quality is most suitable for a club leader?','Reliability','Dishonesty','Unfairness','Avoiding responsibility','Reliable leaders can be trusted to complete agreed tasks.'],
['Why should a club leader listen to different student views?','To make more inclusive decisions','To ignore suggestions','To favour only friends','To avoid consultation','Listening supports fair participation.'],
['Which quality is especially useful when disagreements occur?','Respectful communication','Shouting over everyone','Refusing compromise','Avoiding all meetings','Communication helps resolve disagreements.'],
['Which action demonstrates accountability?','Reporting honestly on promises and results','Hiding spending','Changing rules secretly','Claiming credit for others','Accountable leaders report decisions and actions.']
],
planning:[
['What should an election speech introduce first?','The candidate and desired role','An unrelated celebrity','Only the weather','A list of exam dates','A persuasive speech should identify the candidate and role.'],
['Why include relevant skills and qualities in a campaign speech?','To show suitability for the position','To avoid explaining any plans','To replace the conclusion','To guarantee everyone votes','Qualities help voters judge leadership suitability.'],
['Which proposal is appropriate for a school Sports Club?','An inclusive inter-house activity programme','Ban all students from sports','Cancel safety rules','Use funds without permission','A good proposal benefits members and respects safety.'],
['How should campaign promises be described?','Clear, realistic and achievable','Secret and impossible to measure','Unrelated to sport','Based only on popularity','Realistic promises support accountability.'],
['What makes a strong closing statement?','A respectful request for voter support','An insult directed at classmates','No mention of the election','An unrelated formula','A conclusion should summarise and invite support respectfully.'],
['Why is an activity calendar useful for a sports club?','It helps organise dates, people and resources','It removes the need for planning','It guarantees no cancellations','It replaces student input','Calendars clarify responsibilities and schedules.'],
['Which activity could improve participation for learners with different abilities?','Offer adapted activities and varied roles','Require everyone to run identical times','Exclude students who need support','Cancel all games','Adaptations help more students take part meaningfully.'],
['What should a club treasurer check before approving spending?','Budget and authorised procedures','Only the poster colour','Only a sports celebrity','Whether the weather is sunny','Responsible spending requires budgets and approval.'],
['A speech asks for FIVE improvements. What should a student write?','Five separate, realistic proposals','The same idea five times','Only one vague promise','Five unrelated song titles','Each requested point should be distinct and relevant.']
]
};
const prefixes=['','In a PE classroom discussion, ','During a school sports activity, ','While preparing for an inter-house event, ','During a revision challenge, '];
function question(topic,index,version,slot){
 const row=facts[topic][index],options=[row[1],row[2],row[3],row[4]],shift=(version+slot+sections.indexOf(topic))%4;
 const rotated=options.slice(shift).concat(options.slice(0,shift));
 return {topic,stem:prefixes[version]+row[0],options:rotated,answer:rotated.indexOf(row[1]),explanation:row[5]}
}
const papers=Array.from({length:5},(_,version)=>sections.flatMap((topic,i)=>
 Array.from({length:counts[i]},(_,slot)=>question(topic,(slot+version)%facts[topic].length,version,slot))
));
window.BSS_PE={topics,sections,counts,papers};
})();