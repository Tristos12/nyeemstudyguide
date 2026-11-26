/* Form 3 TCF papers aligned to C8 and D28 marks. Four original diagram-matching activities and six written responses. */
(function(){'use strict';
const actions=[
 {key:'fabric',label:'Guiding fabric while it is stitched',desc:'A pair of hands guides fabric under the presser foot, keeping fingers safely away from the needle.'},
 {key:'needle',label:'Threading the needle',desc:'The upper thread passes through the eye of the machine needle while the machine is switched off.'},
 {key:'oil',label:'Oiling the machine',desc:'A small drop of suitable machine oil is placed at a manufacturer-approved lubrication point.'},
 {key:'bobbin',label:'Positioning the bobbin into the bobbin case',desc:'A lower-thread bobbin is placed correctly inside the bobbin case.'},
 {key:'wind',label:'Filling the bobbin',desc:'The empty bobbin sits on the bobbin-winder spindle as thread winds onto it.'},
 {key:'tension',label:'Threading the tension unit',desc:'Upper thread passes into the tension-disc assembly along the correct threading path.'}
];
const orderSteps=[
 'Remove temporary basting and press the stitched seam open',
 'With right sides together, match fabric edges and pin them',
 'Pin and baste inside the seam allowance',
 'Remove pins and machine-stitch along the seam line',
 'Apply a seam finish and press again'
];
const variants=[
 {garments:['jeans leg seam','pyjama pants side seam','cotton uniform shirt side seam','lightweight chiffon blouse shoulder seam'],parts:['presser foot lever','bobbin winder','reverse stitch lever/button','hand wheel']},
 {garments:['denim work trousers side seam','lightweight summer dress side seam','cotton uniform skirt side seam','sheer blouse shoulder seam'],parts:['hand wheel','reverse stitch lever/button','bobbin winder','presser foot lever']},
 {garments:['heavy denim shorts side seam','lightweight sleepwear side seam','woven cotton school shirt side seam','delicate chiffon blouse seam'],parts:['bobbin winder','presser foot lever','hand wheel','reverse stitch lever/button']}
];
const papers=variants.map((variant,index)=>{
 const selected=[0,1,2,3].map((offset)=>(index*2+offset)%6);
 const questions=[];
 selected.forEach((item,j)=>{
  const action=actions[item];
  questions.push({section:'C',topic:'procedures',marks:2,visual:action.key,stem:'Study the unlabeled sewing-machine activity diagram marked Picture '+('ABCD'[j])+'. Identify the machine-operation action it represents. Choose from: guiding fabric while stitching; threading the needle; oiling the machine; positioning the bobbin in its case; filling the bobbin; threading the tension unit. Briefly explain one visual clue.'})
 });
 questions.push({section:'D',topic:'seams',marks:2,stem:'What is the main function of a seam? Give a clear answer based on garment construction.'});
 questions.push({section:'D',topic:'seams',marks:4,stem:'Name TWO seams that are self-neatened and explain briefly how each neaten its raw edges.'});
 questions.push({section:'D',topic:'applications',marks:8,stem:'For EACH garment, name a suitable seam and state ONE reason for your choice: '+variant.garments.map((g,i)=>('('+('abcd'[i])+') '+g)).join('; ')+'. Award 2 marks per garment.'});
 questions.push({section:'D',topic:'machine',marks:8,stem:'State the function of EACH of these four sewing-machine parts: '+variant.parts.map((p,i)=>('('+('iv'[0]||i)+') '+p)).join('; ')+'. Give a clear function for each (2 marks each).'});
 questions.push({section:'D',topic:'applications',marks:1,stem:'Name ONE seam suitable for an outerwear garment, and write its name accurately.'});
 questions.push({section:'D',topic:'procedures',marks:5,stem:'Arrange these five steps in the CORRECT order for making an OPEN SEAM. Write an ordered list of the step numbers 1–5 and the action descriptions: '+orderSteps.map((p,i)=>'['+(i+1)+'] '+p).join('; ')+'.'});
 return {id:'structured-'+(index+1),title:'TCF Structured Paper '+(index+1),questions,actions:selected.map(i=>actions[i])};
});
const trueFalse=[
 ['An open seam is commonly called a plain seam.',true,'An open seam is a plain seam.'],
 ['Zigzag stitching can neaten the edges of an open seam.',true,'Zigzag is a suitable edge finish on many fabrics.'],
 ['A presser foot should remain raised during normal machine stitching.',false,'The foot should normally be lowered before stitching.'],
 ['Pinking shears and regular cutting shears always produce identical edges.',false,'Pinking shears cut zigzag edges.'],
 ['A lockstitch machine generally uses both top and bobbin threads.',true,'A lockstitch machine forms stitches using upper and lower threads.'],
 ['A double-stitched seam can be useful for stronger garment construction.',true,'Double stitching can improve strength in suitable fabric constructions.'],
 ['French seams can enclose raw seam edges.',true,'A French seam encloses raw edges.'],
 ['One should ignore the manufacturer’s manual when oiling a machine.',false,'Some machines require specific lubrication and some do not require user oiling.'],
 ['A sewing machine should be kept clean and covered appropriately when idle.',true,'Cleaning and suitable covering support maintenance.'],
 ['Backstitching at seam ends helps prevent stitches from unraveling.',true,'Backstitching helps lock seam ends.'],
 ['A tracing wheel is mainly a pressing tool.',false,'A tracing wheel is used for transferring pattern markings.'],
 ['A tailor’s ham assists pressing curved garment areas.',true,'A tailor’s ham supports curved garment sections.'],
 ['A bobbin winder holds a spool of thread on the spool pin during sewing.',false,'The bobbin winder winds thread onto a bobbin; the spool pin holds the spool.'],
 ['A French seam often works well with lightweight fabrics.',true,'French seams are frequently used with lightweight delicate fabrics.'],
 ['One should machine-stitch while parts are visibly loose.',false,'Loose parts can present safety hazards.']
];
window.BSS_TCF_WRITTEN=papers;
window.BSS_TCF_TRUE_FALSE=trueFalse.map(([stem,answer,explanation])=>({topic:'seams',stem,options:['True','False'],answer:answer?0:1,explanation}));
window.BSS_TCF_ACTIONS=actions;
})();