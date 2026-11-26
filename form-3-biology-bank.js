/* Original Form 3 Biology practice bank, built around BSS Term 1 learning outcomes. */
(function(){
'use strict';
const topics={
branches:'Biology and Its Branches',living:'Characteristics of Living Things',
cells:'Plant and Animal Cells',special:'Specialised Cells and Adaptations',
organisation:'Cells, Tissues and Organs',systems:'Organ Systems',
vertebrates:'Vertebrate Classification',science:'Biological Investigation and Application'
};
const sections=Object.keys(topics);
const distribution=[8,8,8,8,7,7,7,7];
/* Each item is [question, correct, plausible wrong 1, plausible wrong 2, clearly wrong, teaching explanation]. */
const bank={
branches:[
['Which branch of biology examines heredity and inherited traits?','Genetics','Ecology','Microbiology','Astronomy','Genetics studies inheritance and variation.'],
['Which branch investigates microscopic organisms such as bacteria?','Microbiology','Botany','Zoology','Geology','Microbiology studies microscopic living organisms.'],
['Who studies marine organisms and their ocean habitats?','Marine biologist','Botanist','Geneticist','Architect','Marine biology focuses on life in seas and oceans.'],
['A scientist examining animal behaviour is working mainly in which branch?','Zoology','Botany','Taxonomy','Meteorology','Zoology is the scientific study of animals.'],
['Which branch is concerned with the study of plants?','Botany','Genetics','Microbiology','Physics','Botany studies plant life.'],
['Which field identifies, names and classifies living things?','Taxonomy','Ecology','Respiration','Chemistry','Taxonomy organises living things into named groups.'],
['Which branch examines relationships between living things and their environment?','Ecology','Genetics','Anatomy','Engineering','Ecology considers organisms and their interactions with their surroundings.'],
['Which statement best defines biology?','The scientific study of living organisms','The study of rocks only','The study of electricity only','The study of stars only','Biology studies life and life processes.'],
['A scientist compares the inherited eye colours of siblings. Which branch is relevant?','Genetics','Marine biology','Botany','Geography','Inherited traits are studied in genetics.'],
['A field team investigates how mangroves support crabs and fish. Which branch is most relevant?','Ecology','Taxonomy only','Genetics only','Astronomy','Ecology examines the relationships between organisms and their surroundings.'],
['Which branch would study freshwater algae as plants or plant-like organisms?','Botany','Zoology','Mechanics','Astronomy','Botany is the study of plants; different algae groups may be classified separately.'],
['A learner discovers an unknown organism and assigns it to a group. Which process is this?','Classification','Digestion','Excretion','Evaporation','Classification groups organisms according to shared characteristics.']
],
living:[
['A seedling becomes taller over several weeks. Which life process is shown?','Growth','Excretion','Respiration','Reproduction','Growth involves an increase in size or mass.'],
['A person removes carbon dioxide through the lungs. Which process removes a metabolic waste?','Excretion','Nutrition','Growth','Movement','Excretion removes metabolic wastes from the body.'],
['A child pulls a hand away after touching a hot surface. Which characteristic is shown?','Sensitivity','Nutrition','Reproduction','Germination','Sensitivity means detecting and responding to stimuli.'],
['A bird lays eggs that hatch into young birds. Which life process is illustrated?','Reproduction','Excretion','Movement','Respiration','Reproduction produces new individuals of a species.'],
['What does the R in MRS GREN represent?','Respiration','Reproduction','Regulation','Rotation','The first R in MRS GREN is respiration; the second R is reproduction.'],
['Which MRS GREN process releases energy from food in cells?','Respiration','Excretion','Growth','Sensitivity','Cellular respiration releases usable energy from food molecules.'],
['A sunflower bends towards a light source. Which characteristic is most directly shown?','Sensitivity','Excretion','Reproduction','Digestion','The plant responds to light, an environmental stimulus.'],
['Which process involves obtaining or making substances needed for growth and energy?','Nutrition','Excretion','Movement','Reproduction','Nutrition is how organisms obtain or make nutrients.'],
['A snail moves to a moist shaded place. Which characteristic is shown by changing position?','Movement','Reproduction','Excretion','Photosynthesis','Movement includes changes of position or location.'],
['A plant produces seeds that may develop into new plants. Which process is involved?','Reproduction','Respiration','Excretion','Digestion','Reproduction produces offspring or new individuals.'],
['What does the E in MRS GREN mean?','Excretion','Exchange','Evolution','Evaporation','Excretion removes metabolic waste products.'],
['Which characteristic is shared by all living organisms at some stage?','They carry out life processes','They all have wings','They all have a backbone','They are all green','Living organisms carry out fundamental life processes although their structures differ.']
],
cells:[
['Which structure controls movement of many substances into and out of a cell?','Cell membrane','Nucleus','Cell wall','Chloroplast','The cell membrane is selectively permeable and regulates movement.'],
['Which cell structure contains genetic material in many plant and animal cells?','Nucleus','Cytoplasm','Vacuole','Cell wall','The nucleus contains DNA in eukaryotic cells.'],
['Which structure supports and protects a plant cell but is absent from animal cells?','Cell wall','Cell membrane','Nucleus','Mitochondrion','Plant cells have a cellulose cell wall outside their membrane.'],
['Which organelle contains chlorophyll needed to absorb light for photosynthesis?','Chloroplast','Nucleus','Cell membrane','Ribosome','Chloroplasts contain chlorophyll and carry out photosynthesis.'],
['What is the jelly-like material inside a cell called?','Cytoplasm','Cell wall','Cuticle','Skeleton','Cytoplasm holds many cell structures and is a site of chemical reactions.'],
['Which structure is generally large and permanent in mature plant cells?','Central vacuole','Nerve ending','Red blood cell','Gill','A large permanent vacuole helps maintain a plant cell’s firmness.'],
['Why do plant cells often have a regular, box-like outline?','Their cell walls provide rigidity','They do not have cytoplasm','They contain no membranes','They have bones','Cell walls support a more regular shape.'],
['An animal cell generally lacks which structure?','Chloroplast','Cell membrane','Cytoplasm','Nucleus','Animal cells have no chloroplasts.'],
['Which structure is present in both typical plant and animal cells?','Cell membrane','Cellulose cell wall','Chloroplast','Large central vacuole only','Both typical plant and animal cells have a membrane.'],
['Which cell part provides a boundary that encloses the cytoplasm?','Cell membrane','Chloroplast','Cell sap','Cell wall only','The cell membrane encloses the cytoplasm in both plant and animal cells.'],
['Why is the nucleus significant to the cell?','It contains DNA and helps control cell activities','It makes the cell wall','It absorbs all the sunlight','It stores bones','DNA in the nucleus provides instructions for cellular activities.'],
['Which plant-cell feature enables photosynthesis most directly?','Chloroplasts','Cell wall','Cell membrane','Nucleus only','Chloroplasts contain pigments needed to capture light.']
],
special:[
['A red blood cell is specialised mainly to transport what?','Oxygen','Solid food','Nerve impulses','Soil','Haemoglobin allows red blood cells to transport oxygen.'],
['What helps a root hair cell absorb water and mineral ions?','A long extension increasing surface area','A thick waxy coat covering roots','Feathers','Large teeth','The extension increases the area for absorption.'],
['Which specialised cell carries electrical impulses through the nervous system?','Nerve cell','Palisade cell','Red blood cell','Root hair cell','Neurones transmit signals around the body.'],
['Why do many sperm cells have tails?','To move towards an egg cell','To make food from sunlight','To absorb soil nutrients','To protect a leaf','The flagellum helps sperm swim.'],
['Which specialised plant cell is rich in chloroplasts for photosynthesis?','Palisade mesophyll cell','Root hair cell','Red blood cell','Neuron','Palisade cells contain many chloroplasts for capturing light.'],
['What feature helps a red blood cell move through narrow capillaries?','Its flexible, biconcave shape','A rigid cell wall','A large permanent nucleus','A thick shell','The flexible biconcave disc shape aids gas transport and movement.'],
['What is a specialised cell?','A cell adapted for a particular function','A cell without any structure','An entire organ system','A non-living mineral','Specialised cells have structures suited to specific tasks.'],
['Which adaptation allows some ciliated epithelial cells to move mucus?','Tiny beating hair-like cilia','Thick roots','Large petals','A cell wall','Cilia beat to move material along cell surfaces.'],
['Which cell would be most suitable for drawing a long branching structure?','Neuron','Red blood cell','Palisade cell','Root hair cell','Neurones have extensions for communication.'],
['A cell with many chloroplasts would be most suited to which process?','Photosynthesis','Carrying oxygen in blood','Producing nerve impulses','Breaking down bones','Chloroplasts allow light energy to be captured.'],
['What is the main function of an egg cell in human reproduction?','To contribute genetic material and nutrients to early development','To carry oxygen','To absorb soil minerals','To transport water up xylem','An egg cell contributes hereditary material and supports early development.'],
['How do specialised cells help multicellular organisms?','Different cell types perform specific jobs efficiently','Every cell performs every task equally','They prevent tissue formation','They eliminate the need for organs','Division of labour enables complex organisms to function.']
],
organisation:[
['What is a tissue?','A group of similar cells working together for a function','A group of unrelated organisms','A single chemical element','A type of rock','Tissues consist of cells cooperating in a particular function.'],
['What is an organ?','A structure made of different tissues working together','A single atom','One type of plant seed','A single blood cell','Organs contain several tissues performing related tasks.'],
['Which sequence shows organisation from simplest to most complex?','Cell → tissue → organ → organ system','Organ → cell → system → tissue','System → cell → organ → tissue','Tissue → cell → system → organ','Cells build tissues, tissues build organs and organs build systems.'],
['What does an organ system consist of?','Organs working together to carry out a major function','Only one type of isolated cell','A group of rocks','Unrelated animals','Organ systems coordinate organs to perform a body function.'],
['The heart contains muscle, nerve and connective tissues. This makes it an example of what?','An organ','One cell','An organism group','A mineral','The heart is an organ because different tissues work together.'],
['Several similar muscle cells working together form what?','Muscle tissue','An organ system directly','A species','A bone mineral','Similar cells with a common function form a tissue.'],
['Why are multicellular organisms able to perform complex functions?','Their cells, tissues and organs can specialise and coordinate','They have no specialised parts','They never require energy','They consist of one cell','Different levels of organisation cooperate in complex tasks.'],
['Which of these is an organ rather than an organ system?','Stomach','Digestive system','Nervous system','Circulatory system','The stomach is an organ within the digestive system.'],
['Which is a correct example of tissues forming an organ?','Muscle and connective tissue contributing to the heart','One oxygen molecule forming a heart','An entire forest forming a cell','Stomach becoming a chemical element','Organs combine several tissues.'],
['A leaf is an organ because it contains which arrangement?','Different plant tissues working together','Only one identical type of atom','A group of separate trees','No living cells','A leaf has several tissues supporting photosynthesis and transport.']
],
systems:[
['Which system includes the heart, blood and blood vessels?','Circulatory system','Digestive system','Nervous system','Skeletal system','The circulatory system transports materials around the body.'],
['Which system includes the oesophagus, stomach and intestines?','Digestive system','Circulatory system','Nervous system','Respiratory system','The digestive system breaks down food and absorbs nutrients.'],
['Which system includes the brain, spinal cord and nerves?','Nervous system','Reproductive system','Digestive system','Circulatory system','The nervous system coordinates rapid communication and responses.'],
['Which body system includes ovaries and testes?','Reproductive system','Digestive system','Circulatory system','Nervous system','The reproductive system includes organs involved in reproduction.'],
['During a run, why may a person’s heart beat faster?','To help deliver more oxygen and nutrients to working tissues','To stop all respiration','To create bones rapidly','To reduce blood circulation to zero','Circulation increases to meet higher demands.'],
['Which system transports absorbed nutrients through blood to tissues?','Circulatory system','Reproductive system','Nervous system','Integumentary system','Blood carries dissolved nutrients and gases to tissues.'],
['Which organ is primarily responsible for pumping blood?','Heart','Stomach','Brain','Small intestine','The heart propels blood through the circulatory system.'],
['What is the main role of the small intestine?','Absorbing most digested nutrients','Sending nerve impulses to muscles','Pumping blood','Producing eggs','Most nutrient absorption occurs in the small intestine.'],
['Which organ is central to coordinating nervous system responses?','Brain','Liver','Stomach','Kidney only','The brain processes information and coordinates many responses.'],
['Which pair belongs to the digestive system?','Stomach and small intestine','Heart and blood vessel','Brain and spinal cord','Ovary and testis','Both the stomach and small intestine aid digestion.']
],
vertebrates:[
['Which trait defines a vertebrate?','A backbone or vertebral column','Six legs','Feathers in every species','External shell only','Vertebrates possess a vertebral column.'],
['Which group generally has feathers and lays hard-shelled eggs?','Birds','Mammals','Amphibians','Fish','Feathers are a defining characteristic of birds.'],
['An adult frog is classified as which type of vertebrate?','Amphibian','Reptile','Mammal','Bird','Frogs are amphibians; many begin life as aquatic tadpoles.'],
['A whale breathes air and feeds its young with milk. It is a what?','Mammal','Fish','Reptile','Amphibian','Whales are mammals because they breathe air and produce milk for young.'],
['Which feature is especially suited to fish extracting oxygen dissolved in water?','Gills','Feathers','Fur','Lungs in every fish','Gills exchange gases between blood and water.'],
['An iguana is most correctly classified as a what?','Reptile','Amphibian','Mammal','Bird','Iguanas are reptiles with dry, scaly skin.'],
['Which vertebrate group is characterised by hair or fur and mammary glands?','Mammals','Fish','Birds','Reptiles','Mammals have mammary glands and typically hair or fur.'],
['Which animal is an amphibian?','Toad','Pigeon','Dog','Tuna','Toads are amphibians.'],
['Which animal belongs to the reptile group?','Sea turtle','Dolphin','Parrot','Frog','Sea turtles are reptiles despite living in the sea.'],
['Which organism is a bird?','Saint Lucia parrot','Bat','Flying fish','Iguana','A parrot has feathers and belongs to the bird group.'],
['Why is a dolphin not classified as a fish?','It breathes air and nurses its young with milk','It has no backbone','It has feathers','It lacks all muscles','Dolphins have mammalian traits.']
],
science:[
['Which tool is most useful for viewing microscopic cells?','Microscope','Telescope','Compass','Ruler only','A microscope magnifies cells and other tiny structures.'],
['Which step should come first when investigating seedling growth?','State a testable question or prediction','Publish a conclusion before collecting data','Change all factors at once','Discard observations','A good investigation begins with a clear question.'],
['For a fair test of soil type on plant growth, what should be kept the same?','Plant type, water and light','Only the soil type','All factors changed at once','Results recorded in different units','Control variables so the tested factor can be evaluated.'],
['Which variable is deliberately changed in an experiment?','Independent variable','Dependent variable','Conclusion','Observation only','The independent variable is manipulated.'],
['What is the dependent variable in a test of light and seedling height?','The measured seedling height','The light setting changed','The plant pot label','The scientist’s name','The dependent variable is the measured response.'],
['Why should results be recorded in a table?','To organise observations for comparison','To replace all evidence with guesses','To make a test unfair','To prevent repeated measurement','Tables help organise and compare data.'],
['Which practice is safest when using a classroom microscope?','Carry it with two hands and keep it on a stable bench','Run while holding it','Touch lenses with dirty hands','Aim bright light into a peer’s eyes','Correct handling reduces damage and injury.'],
['How can a labelled biological drawing be improved?','Use clear lines and label the observed structures accurately','Invent features not visible','Use heavy shading to hide details','Leave it unlabelled','Scientific drawings should be accurate and clearly labelled.'],
['A claim says a plant grew faster in one pot. What strengthens the conclusion?','Repeated measurements and a controlled comparison','One guess without records','Changing light, water and soil simultaneously','Ignoring the second plant','Repeated, controlled observations support conclusions.'],
['What is the best reason to repeat an investigation?','To check reliability and spot inconsistent results','To guarantee the desired answer','To avoid measuring anything','To remove controls','Repeated trials help assess reliability.']
]
};
function create(topic,base,practice,pos){
 const q=bank[topic][base%bank[topic].length];
 const prefixes=['','During a Form 3 Biology revision exercise: ','In a classroom science challenge: ','While preparing for an end-of-term examination: ','In a student study-group discussion: '];
 const options=[q[1],q[2],q[3],q[4]];
 const shift=(practice*2+pos*3+sections.indexOf(topic))%4;
 const rotated=options.slice(shift).concat(options.slice(0,shift));
 return {topic,stem:prefixes[practice]+q[0],options:rotated,answer:rotated.indexOf(q[1]),explanation:q[5]};
}
const papers=[];
for(let p=0;p<5;p++){
 const items=[];
 sections.forEach((topic,i)=>{for(let n=0;n<distribution[i];n++)items.push(create(topic,p*distribution[i]+n,p,n))});
 papers.push(items)
}
window.BSS_BIOLOGY={topics,sections,distribution,papers};
})();