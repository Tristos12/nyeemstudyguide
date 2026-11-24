/**
 * Server-only staff authorisation foundation for Babonneau Secondary School.
 *
 * DO NOT import this module from public browser JavaScript or ship it to the
 * GitHub Pages build. This is intentionally NOT wired to production endpoints.
 *
 * Integration requires two independent, trusted server adapters:
 * verifyIdentity(token): verifies issuer, audience, expiry, signature and MFA
 * findStaffBySubject(subject): retrieves an enabled staff record from a
 * server-controlled directory (not public profile or token-supplied role).
 *
 * Every protected API route MUST call authoriseStaff before reading or changing
 * any learner, chat, incident or room record.
 */
'use strict';

const ALLOWED_ROLES=Object.freeze(['teacher','safeguarding','administrator']);
const ABILITIES=Object.freeze({
 'class:summary':['teacher','safeguarding','administrator'],
 'room:pause':['teacher','safeguarding','administrator'],
 'room:close':['teacher','safeguarding','administrator'],
 'chat:disable':['teacher','safeguarding','administrator'],
 'incident:list':['safeguarding','administrator'],
 'incident:read':['safeguarding','administrator'],
 'incident:resolve':['safeguarding','administrator'],
 'staff:manage':['administrator']
});
const rejection=(status,code)=>Object.freeze({ok:false,status,code});
function bearerToken(request){
 const raw=request?.headers?.authorization??request?.headers?.Authorization;
 if(typeof raw!=='string'||raw.length>8192)return null;
 const match=/^Bearer ([A-Za-z0-9._~-]+)$/.exec(raw);
 return match?match[1]:null;
}
function validStaffRecord(staff,verifiedSubject){
 return staff&&staff.active===true&&
 typeof staff.subject==='string'&&staff.subject===verifiedSubject&&
 ALLOWED_ROLES.includes(staff.role)&&
 typeof staff.schoolId==='string'&&staff.schoolId.length>0&&
 staff.schoolId.length<=100;
}
/**
 * Subject is verified by the trusted identity provider; role, active status,
 * school scope and class assignments must be obtained from the server directory.
 * Never accept these fields from browser JSON, URL parameters or unverified JWT.
 */
async function authoriseStaff({request,action,schoolId,classId,verifyIdentity,findStaffBySubject}={}){
 if(typeof verifyIdentity!=='function'||typeof findStaffBySubject!=='function')
  return rejection(503,'STAFF_AUTH_NOT_CONFIGURED');
 if(!Object.prototype.hasOwnProperty.call(ABILITIES,action))
  return rejection(403,'ACTION_NOT_ALLOWED');
 const token=bearerToken(request);
 if(!token)return rejection(401,'SIGN_IN_REQUIRED');
 let claims,staff;
 try{
  claims=await verifyIdentity(token);
  if(!claims||typeof claims.subject!=='string'||!claims.subject||
    claims.verified!==true||claims.mfaSatisfied!==true)return rejection(401,'INVALID_STAFF_SESSION');
  staff=await findStaffBySubject(claims.subject);
 }catch{return rejection(401,'INVALID_STAFF_SESSION')}
 if(!validStaffRecord(staff,claims.subject))return rejection(403,'STAFF_ACCESS_DENIED');
 if(!ABILITIES[action].includes(staff.role))return rejection(403,'INSUFFICIENT_ROLE');
 if(typeof schoolId!=='string'||schoolId!==staff.schoolId)return rejection(403,'SCHOOL_SCOPE_DENIED');
 if(classId!==undefined){
  if(typeof classId!=='string'||!classId||classId.length>64)return rejection(403,'CLASS_SCOPE_DENIED');
  if(staff.role==='teacher'&&(!Array.isArray(staff.classIds)||!staff.classIds.includes(classId)))
   return rejection(403,'CLASS_SCOPE_DENIED');
 }
 return Object.freeze({ok:true,status:200,subject:staff.subject,role:staff.role,schoolId:staff.schoolId,classId:classId??null,action});
}
module.exports={authoriseStaff,ABILITIES};
