/* Form 3 Biology: three original structured 50-mark papers and four 70-mark mock combinations. */
(function(){
'use strict';
const variants=[
 {title:'Paper 1 · The School Science Club',scenario:'a school science club investigates life on the school grounds',example:'mangrove',plant:'leaf',animal:'human cheek cell',systems:['heart, blood and blood vessels','stomach, oesophagus and intestines'],groups:['frog','iguana','Saint Lucia parrot'],adaptation:'root hair cell',second:'red blood cell'},
 {title:'Paper 2 · A Coastal Biology Survey',scenario:'a team monitors plants and animals near a Saint Lucian beach',example:'sea turtle',plant:'seagrass',animal:'fish',systems:['brain, spinal cord and nerves','ovaries, testes and uterus'],groups:['dolphin','sea turtle','flying fish'],adaptation:'nerve cell',second:'palisade mesophyll cell'},
 {title:'Paper 3 · The Community Science Exhibition',scenario:'Form 3 learners prepare a biology exhibition for families',example:'tree frog',plant:'flowering plant',animal:'butterfly',systems:['heart, blood and blood vessels','brain, spinal cord and nerves'],groups:['bat','toad','hummingbird'],adaptation:'sperm cell',second:'ciliated epithelial cell'}
];
const papers=variants.map((v,i)=>({
 id:'structured-'+(i+1),title:v.title,questions:[
 {marks:2,topic:'branches',stem:'The context is that '+v.scenario+'. Define Biology and state one reason why it is useful in this investigation.'},
 {marks:7,topic:'branches',stem:'Match each branch to a correct description: Genetics, Microbiology, Marine Biology, Zoology, Taxonomy, Botany and Ecology. Give the meaning of each branch. Present your answers as seven labelled lines.'},
 {marks:7,topic:'living',stem:'Write the complete names of the seven life processes represented by MRS GREN. For ONE of the processes, include an example involving '+v.example+'.'},
 {marks:8,topic:'special',stem:'DRAW and LABEL TWO different specialised cells: a '+v.adaptation+' and a '+v.second+'. Name two features that help each cell perform its function. State the function of each. You may draw using the coloured pens or upload a labelled diagram.'},
 {marks:8,topic:'cells',stem:'Compare a typical plant cell and animal cell. DRAW and LABEL the cell membrane, nucleus, cytoplasm, cell wall, chloroplast and vacuole where appropriate. Identify TWO structures normally associated with plant cells and give the function of TWO cell structures.'},
 {marks:6,topic:'organisation',stem:'Define tissue (2 marks) and organ (2 marks). Use a suitable example to explain how cells form tissues and tissues form organs (2 marks).'},
 {marks:6,topic:'systems',stem:'Identify the organ systems containing: (a) '+v.systems[0]+'; (b) '+v.systems[1]+' (2 marks). Explain TWO functions of either named system and describe how at least two organs cooperate (4 marks).'},
 {marks:6,topic:'vertebrates',stem:'Classify each of these vertebrates and justify your choices: '+v.groups.join(', ')+'. Identify one distinctive characteristic of each animal’s vertebrate group (6 marks).'}
 ]}));
window.BSS_BIOLOGY_WRITTEN=papers;
})();