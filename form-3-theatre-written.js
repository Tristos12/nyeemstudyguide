(function(){'use strict';
const stories=[
{title:'Ti Bolom',text:'Ti Bolom, sometimes called the Little Man or Little Devil, is a Saint Lucian folktale. In the story, a supernatural being imitates the crying of a baby to lure an unsuspecting person closer. The person risks being caught and taken into the devil’s service.',character:'Ti Bolom',objective:'lure unsuspecting people',setting:'a dark lane at night'},
{title:'The Whisper by the River',text:'At dusk, a mysterious figure makes the sound of someone asking for help near a river. A young villager approaches, but remembers a warning from an elder and hesitates. The figure wants to draw the villager nearer, while the villager must decide whether to proceed.',character:'mysterious figure',objective:'draw the villager nearer',setting:'a riverbank at dusk'},
{title:'The Shadow at the Old House',text:'On a rainy evening a shadowy stranger calls softly from an abandoned house. A student wishes to help but also remembers the village’s warning about the house. The stranger wants the student to come closer, while the student must choose a safe response.',character:'shadowy stranger',objective:'draw the student into the house',setting:'an abandoned house on a rainy evening'}
];
const tf=[
['The protagonist is the main character whose journey or problem we follow.',true],
['Contemporary context is connected only to the distant past.',false],
['A tableau is also called a freeze frame.',true],
['Performers should move and speak continuously during a tableau.',false],
['Motivation explains why a character wants something.',true],
['A flashback gives clues about the future rather than showing the past.',false],
['An aside is intended for the audience rather than the other characters.',true],
['Props are objects actors use during a scene.',true],
['The climax is generally the most intense plot moment.',true],
['Lighting can create mood and direct attention.',true],
['A resolution can show how the main conflict ends.',true],
['The word antagonist means the main character’s director.',false],
['Exposition usually introduces the setting and key characters.',true],
['Sound design may include recorded voices and effects.',true],
['A costume is the same as a stage prop in every case.',false]
];
const papers=stories.map((s,i)=>({id:'structured-'+(i+1),title:'Theatre Arts Structured Paper '+(i+1),story:s,questions:[
...['Exposition','Rising Action','Climax','Falling Action','Resolution'].map((x,j)=>({section:'3',topic:'plot',marks:2,visual:'mountain',stem:'Story Mountain label '+(j+1)+'. Using the word bank Exposition, Rising Action, Climax, Falling Action, Resolution, identify the correct plot stage at numbered position '+(j+1)+'.'})),
{section:'4',topic:'character',marks:2,stem:'Read the story “'+s.title+'”. What is the objective of '+s.character+' in the situation described?'},
{section:'4',topic:'conflict',marks:2,stem:'What obstacle, risk or conflict might a person face when responding to the call in the story?'},
{section:'4',topic:'production',marks:1,stem:'Suggest ONE costume or prop that could help an audience understand '+s.character+' on stage.'},
{section:'4',topic:'production',marks:1,stem:'Suggest ONE lighting choice for a performance set in '+s.setting+'.'},
{section:'4',topic:'production',marks:1,stem:'Suggest ONE sound effect that could strengthen this scene.'},
{section:'4',topic:'production',marks:3,stem:'Explain HOW your chosen sound or lighting creates a particular mood and guides the audience’s understanding. Give a clear reason and connect it to the action.'}
]}));
window.BSS_THEATRE_WRITTEN=papers;
window.BSS_THEATRE_TRUE_FALSE=tf.map(([stem,answer],i)=>({topic:['plot','context','tableau','tableau','character','devices','devices','production','plot','production','plot','character','plot','production','production'][i],stem,options:['True','False'],answer:answer?0:1,explanation:answer?'The statement is correct.':'The statement is incorrect. Review the relevant term.'}));
})();