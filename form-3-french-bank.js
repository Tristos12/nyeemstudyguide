/* Form 3 French, Term 1 revision. Original questions based on the uploaded school examination:
 * classroom situations, rules, prepositions, objects and short dialogues.
 * 5 practices x 60 questions; 10 questions per skill per paper.
 */
(function(){
'use strict';
const topics={
requests:'Asking Permission and Making Requests',
responses:'Classroom Responses and Apologies',
rules:'Classroom Rules and Expectations',
objects:'School Objects and Vocabulary',
positions:'Prepositions and Locations',
reading:'Understanding Short Dialogues'
};
const sections=Object.keys(topics);
const rows={
requests:[
['You need to use the bathroom. What do you ask politely?','Puis-je aller aux toilettes, s’il vous plaît ?','Je suis en retard.','Le cahier est rouge.','Taisez-vous !','Puis-je asks permission; aux toilettes identifies the bathroom.'],
['You need to borrow a pen from a classmate. What do you say?','Prête-moi un stylo, s’il te plaît.','Je ne comprends pas.','Ouvrez vos livres.','Il est sous la table.','Prête-moi means lend me; stylo means pen.'],
['You want permission to enter the classroom. What do you ask?','Puis-je entrer, s’il vous plaît ?','Où est mon livre ?','Je suis malade.','Mon sac est bleu.','Puis-je entrer means May I enter.'],
['You want a classmate to give you an eraser. What is suitable?','Prête-moi une gomme, s’il te plaît.','Désolé, Madame.','Il faut écouter.','Je suis absent.','Une gomme is an eraser.'],
['You wish to ask the teacher to repeat something. What do you say?','Pouvez-vous répéter, s’il vous plaît ?','La porte est ouverte.','Il est derrière moi.','J’ai un crayon rouge.','Pouvez-vous répéter is a polite request to repeat.'],
['You need to ask a friend for a ruler. Choose the most suitable sentence.','Prête-moi une règle, s’il te plaît.','Entrez dans la classe.','Je suis en retard.','Je ne sais pas.','Une règle is a ruler.'],
['You cannot hear the teacher and politely request louder speech.','Parlez plus fort, s’il vous plaît.','Fermez la fenêtre !','Où est la porte ?','Mon sac est sur la table.','Parlez plus fort requests that someone speak louder.'],
['You would like the teacher to explain again. Which sentence fits?','Pouvez-vous expliquer encore une fois ?','Il faut être à l’heure.','Je n’ai pas de stylo.','La trousse est verte.','Expliquer encore une fois means explain once again.'],
['You want to borrow a notebook. Which request is best?','Prête-moi un cahier, s’il te plaît.','Je suis désolé.','Il y a deux portes.','C’est mon pupitre.','Un cahier is an exercise book or notebook.'],
['You need to ask for help with a difficult exercise.','Pouvez-vous m’aider, s’il vous plaît ?','Je suis devant la porte.','J’ai fini mes devoirs.','Il est cinq heures.','Pouvez-vous m’aider means Can you help me.']
],
responses:[
['You do not understand the new explanation. What do you tell the teacher?','Je ne comprends pas.','J’ai terminé.','Il est dans le sac.','Ouvrez la porte.','Je ne comprends pas means I do not understand.'],
['Your teacher calls your name. How may you respond respectfully?','Oui, Madame.','Taisez-vous !','Je n’ai pas de gomme.','C’est une trousse.','Oui, Madame is an appropriate respectful acknowledgement.'],
['You have finished an activity and are ready for correction.','Madame, j’ai fini.','Je suis en retard.','Il est sous la chaise.','Voici la fenêtre.','J’ai fini means I have finished.'],
['You arrive late. Which sentence gives an appropriate apology?','Désolé, Madame, je suis en retard.','Où est mon stylo ?','La porte est derrière moi.','Il faut ranger.','Je suis en retard means I am late; désolé expresses apology.'],
['You forgot your exercise book at home. What do you say?','J’ai oublié mon cahier chez moi.','Je suis devant la porte.','Le crayon est vert.','Ouvrez votre livre.','J’ai oublié means I forgot; chez moi means at home.'],
['You want to thank a friend who found your pen.','Merci beaucoup !','Je suis en retard.','Il est malade.','Taisez-vous !','Merci beaucoup expresses thanks.'],
['Your friend says « Merci ». What can you reply?','De rien !','Je ne comprends pas.','Dans mon sac.','Il faut participer.','De rien means You’re welcome.'],
['You accidentally interrupt your teacher. Choose an apology.','Excusez-moi, Madame.','Je suis sur la table.','Voici mon stylo.','Il y a une porte.','Excusez-moi is a polite apology.'],
['You have not yet finished the assignment. What do you say?','Je n’ai pas encore fini.','J’ai terminé hier.','Entrez, s’il vous plaît.','Il est à côté du sac.','Je n’ai pas encore fini means I have not finished yet.'],
['You do not know where the pencil is. What do you say?','Je ne sais pas.','Voici mon professeur.','Il faut être poli.','La chaise est grande.','Je ne sais pas means I do not know.']
],
rules:[
['A classmate is talking while the teacher explains. Which instruction is appropriate?','Il faut écouter le professeur.','Il faut courir en classe.','Il faut oublier les devoirs.','Il faut casser les chaises.','Écouter le professeur is to listen to the teacher.'],
['Someone regularly arrives after the lesson begins. Which rule applies?','Il faut être à l’heure.','Il faut perdre ses cahiers.','Il faut crier.','Il faut fermer son sac.','Être à l’heure means be on time.'],
['The classroom is untidy after lunch. Which rule should students follow?','Il faut garder la salle de classe bien rangée.','Il faut arriver en retard.','Il faut jeter les livres.','Il faut parler fort.','Bien rangée means tidy or properly arranged.'],
['A learner refuses to join class discussions. Which rule is relevant?','Il faut participer aux cours.','Il faut oublier son nom.','Il faut dormir en classe.','Il faut arriver à midi.','Participer aux cours means to take part in lessons.'],
['Students are being unkind to one another. Which rule should be followed?','Il faut respecter les autres.','Il faut cacher ses cahiers.','Il faut parler pendant le test.','Il faut fermer la porte.','Respecter les autres means respect others.'],
['A learner has not handed in homework. Choose the relevant expectation.','Il faut remettre ses devoirs à temps.','Il faut perdre sa trousse.','Il faut courir dans la salle.','Il faut ignorer le professeur.','Remettre ses devoirs means submit homework.'],
['The prefect needs everyone to stop talking. Which command fits?','Taisez-vous, s’il vous plaît.','Prenez mon crayon.','Je suis en retard.','Où est le livre ?','Taisez-vous asks people to be quiet.'],
['A learner wishes to be courteous. Which expectation fits best?','Il faut être poli envers les autres.','Il faut dessiner sur la porte.','Il faut jeter ses cahiers.','Il faut crier en classe.','Être poli means to be polite.'],
['Pupils should bring essential materials. Which classroom rule applies?','Il faut apporter son matériel scolaire.','Il faut cacher son sac.','Il faut arriver après le cours.','Il faut oublier le tableau.','Matériel scolaire means school supplies.'],
['Everyone should work quietly during a test. Which rule is suitable?','Il faut travailler en silence.','Il faut chanter fort.','Il faut changer de salle.','Il faut laisser ses devoirs.','Travailler en silence means work quietly.']
],
objects:[
['How do you say “pencil” in French?','un crayon','un stylo','une trousse','une porte','Un crayon is a pencil; un stylo is a pen.'],
['Which French word means “pen”?','un stylo','une gomme','un livre','une règle','Un stylo is a pen.'],
['What is the French expression for “schoolbag”?','un sac à dos','un tableau','une prise','un pupitre','Un sac à dos is a backpack.'],
['Which word names a pencil case?','une trousse','une fenêtre','une chaise','un livre','Une trousse is a pencil case.'],
['What does « un cahier » mean?','an exercise book','a door','a desk','an eraser','Un cahier is a notebook or exercise book.'],
['How do you say “ruler” in French?','une règle','une gomme','une porte','une trousse','Une règle is a ruler.'],
['Which French word means “eraser”?','une gomme','un tableau','un livre','une chaise','Une gomme is an eraser.'],
['Which word refers to the classroom board?','le tableau','la trousse','le cahier','le sac','Le tableau is the board.'],
['What is « un pupitre » in the classroom?','a school desk','a pen','a backpack','a clock','Un pupitre is a school desk.'],
['How do you say “book” in French?','un livre','une prise','une porte','un crayon','Un livre is a book.']
],
positions:[
['The pencil is ON the desk. Choose the correct French phrase.','sur le pupitre','sous le pupitre','derrière le pupitre','dans le sac','Sur means on.'],
['The pen is IN the backpack. Which phrase is correct?','dans le sac à dos','sur le tableau','devant la porte','sous la chaise','Dans means in or inside.'],
['The pencil case is NEXT TO the book. What is correct?','à côté du livre','derrière la porte','sous le tableau','dans le livre','À côté de means next to.'],
['The ruler is UNDER the chair. Which phrase fits?','sous la chaise','sur la chaise','devant le tableau','dans la trousse','Sous means under.'],
['The book is BEHIND the door. Which phrase is correct?','derrière la porte','devant le tableau','sur le pupitre','près du sac','Derrière means behind.'],
['The notebook is IN FRONT OF the board. Choose the phrase.','devant le tableau','derrière le tableau','dans le tableau','sous le livre','Devant means in front of.'],
['The eraser is NEAR the window. Choose the phrase.','près de la fenêtre','sous la chaise','derrière le livre','dans la porte','Près de means near.'],
['Marie asks « Où est mon crayon ? ». What is she asking?','Where is my pencil?','Who is my teacher?','How old are you?','What colour is the desk?','Où est means Where is.'],
['What does « Il n’est pas là » mean?','It is not there.','It is very large.','It is on the desk.','It is your homework.','Ne ... pas is a negative structure; là means there.'],
['What does « à côté du sac » mean?','next to the bag','behind the board','under the window','inside the pencil','À côté de means next to.']
],
reading:[
['In « Léa cherche son crayon », what is Léa looking for?','her pencil','her ruler','her pen','her schoolbag','Cherche means looks for, and crayon means pencil.'],
['In « Le livre est sur la table », where is the book?','on the table','under the table','behind the door','in the bag','Sur indicates on top of.'],
['What does « Je ne sais pas » communicate in a dialogue?','The speaker does not know.','The speaker has finished.','The speaker is late.','The speaker is asking permission.','Je ne sais pas means I do not know.'],
['A speaker says « Ma trousse est rouge ». What colour is the pencil case?','red','blue','green','yellow','Rouge means red.'],
['Paul asks « Il est dans ton sac ? ». Where does he suggest looking?','inside the bag','on the desk','behind the door','near the board','Dans ton sac means in your bag.'],
['What does « Mais regarde ! » suggest?','Look!','Be quiet!','Go out!','Write faster!','Regarde is an informal instruction meaning look.'],
['A pupil says « Le stylo est près de la porte ». Where is it?','near the door','under the chair','behind the board','in the drawer','Près de means near.'],
['In « Non, il n’est pas là », what is the speaker doing?','Rejecting a suggested location','Thanking a classmate','Asking to go out','Requesting a pen','Non and ne ... pas express a negative response.'],
['At the end of a conversation, « De rien » is most likely a response to what?','Merci','Je suis en retard','Où est le livre ?','Taisez-vous','De rien commonly replies to Merci.'],
['Which phrase means « Here is the pencil »?','Voici le crayon.','Où est le crayon ?','Je ne sais pas.','Il faut écouter.','Voici introduces something that is being shown or presented.']
]
};
const prefixes=['','During a French lesson, ','In a classroom role-play, ','On a French revision worksheet, ','At the start of an exercise, '];
function create(topic,index,practice){
 const row=rows[topic][index];
 const opts=[row[1],row[2],row[3],row[4]],shift=(index*3+practice*2+sections.indexOf(topic))%4;
 const choices=opts.slice(shift).concat(opts.slice(0,shift));
 return {topic,stem:prefixes[practice]+row[0],options:choices,answer:choices.indexOf(row[1]),explanation:row[5]}
}
const papers=Array.from({length:5},(_,p)=>sections.flatMap(topic=>rows[topic].map((_,i)=>create(topic,i,p))));
window.BSS_FRENCH={topics,sections,papers};
})();