// Short, room-only learner messages. This is a basic filter, not a substitute
// for human supervision or a complete child-safety moderation service.
export const MAX_MESSAGE_LENGTH=150;
const forbiddenWords=/\b(?:fuck(?:ing|ed|er)?|shit(?:ty)?|bitch(?:es)?|cunt|nigg(?:a|er|as|ers)|faggot|retard(?:ed)?|whore|slut|asshole|motherfucker)\b/i;
const links=/(?:https?:\/\/|www\.|\b[a-z0-9-]+\.(?:com|net|org|edu|gov|co|io|app|gg|me|ly|xyz|link)\b)/i;
const email=/[a-z0-9._%+-]+\s*@\s*[a-z0-9.-]+\.[a-z]{2,}/i;
const phone=/(?:\+?\d[\d .()\-]{6,}\d)/;
const socialHandles=/\b(?:snapchat|instagram|tiktok|whatsapp|telegram|discord|phone number|address|call me|text me|dm me)\b/i;
export function checkMessage(value){
 if(typeof value!=='string')return {ok:false,error:'Enter a short message'};
 const text=value.replace(/[\u0000-\u001f\u007f-\u009f]/g,' ').replace(/\s+/g,' ').trim();
 if(text.length<1||text.length>MAX_MESSAGE_LENGTH)return {ok:false,error:'Messages must be 1 to 150 characters'};
 if(links.test(text)||email.test(text)||phone.test(text)||socialHandles.test(text))return {ok:false,error:'Please do not share links, contact details or social accounts'};
 if(forbiddenWords.test(text))return {ok:false,error:'Please use respectful language'};
 return {ok:true,text};
}
