/* Original French reading-comprehension passages and 15-mark written question sets. */
(function(){
'use strict';
const prompts=[
 {title:'Le cahier de Camille',passage:'Camille : Bonjour, Hugo ! Je cherche mon cahier bleu. Il n’est pas sur mon pupitre.\nHugo : Regarde dans ton sac à dos !\nCamille : Non, il n’est pas dans mon sac. Il y a seulement un stylo et une règle.\nHugo : Est-ce qu’il est sous la chaise ?\nCamille : Non. Ma trousse rouge est sous la chaise.\nHugo : Regarde à côté du tableau, près de la porte !\nCamille : Ah oui ! Voici mon cahier bleu. Merci, Hugo !\nHugo : De rien !',answers:[
 ['What item is Camille looking for?',1,'her blue exercise book'],
 ['Where does Hugo first suggest that Camille should look?',2,'in her backpack'],
 ['Which TWO items does Camille say are inside her backpack?',2,'a pen and a ruler'],
 ['Where is Camille’s red pencil case?',2,'under the chair'],
 ['What colour is Camille’s missing item?',2,'blue'],
 ['Where does Hugo finally suggest looking? Answer in a complete sentence.',3,'next to the board, near the door'],
 ['Where does Camille eventually find her exercise book? Answer in a complete sentence.',3,'next to the board near the door']
 ]},
 {title:'La trousse de Malik',passage:'Malik : Salut, Anaïs ! Où est ma trousse verte ?\nAnaïs : Elle est sur ton bureau ?\nMalik : Non, mon livre est sur le bureau, mais ma trousse n’est pas là.\nAnaïs : Regarde derrière la porte !\nMalik : Non, il y a un sac noir derrière la porte.\nAnaïs : Est-ce qu’elle est dans ton sac à dos ?\nMalik : Non, mon crayon et ma gomme sont dans mon sac.\nAnaïs : Mais regarde ! Elle est sous la table, près de la fenêtre.\nMalik : Oui, merci beaucoup !',answers:[
 ['What school item is Malik searching for?',1,'his pencil case'],
 ['Where does Anaïs first suggest looking?',2,'on his desk'],
 ['What item is actually on the desk?',2,'his book'],
 ['What is behind the door?',2,'a black bag'],
 ['Name TWO objects Malik says are in his backpack.',2,'a pencil and an eraser'],
 ['Where does Anaïs finally see the pencil case?',3,'under the table near the window'],
 ['What colour is the missing pencil case, and how does Malik respond after finding it?',3,'green; he says thank you very much']
 ]},
 {title:'Avant le cours',passage:'Sarah : Bonjour, Louis ! Tu as mon stylo ?\nLouis : Non, mais il y a un stylo bleu à côté du livre.\nSarah : Ce n’est pas mon stylo. Mon stylo est noir.\nLouis : Regarde dans ta trousse !\nSarah : Ma trousse est dans mon sac. Mais le stylo n’est pas là.\nLouis : Est-ce qu’il est devant le tableau ?\nSarah : Non. Il y a une règle devant le tableau.\nLouis : Ah ! Ton stylo est sous ton cahier rouge sur le pupitre.\nSarah : Merci ! Maintenant, je peux commencer mon travail.',answers:[
 ['What is Sarah looking for?',1,'her pen'],
 ['What colour is the pen beside the book?',2,'blue'],
 ['What colour is Sarah’s own pen?',2,'black'],
 ['Where is Sarah’s pencil case?',2,'in her bag'],
 ['Which object is in front of the board?',2,'a ruler'],
 ['Where does Louis eventually find the pen?',3,'under her red exercise book on the desk'],
 ['Why is Sarah pleased to find her pen?',3,'she can now begin her work']
 ]}
];
window.BSS_FRENCH_WRITTEN=prompts.map((p,i)=>({
 id:'structured-'+(i+1),title:'Reading Comprehension '+(i+1)+' · '+p.title,
 passageTitle:p.title,passage:p.passage,
 questions:p.answers.map(([stem,marks,guide])=>({stem,marks,guide}))
}));
})();