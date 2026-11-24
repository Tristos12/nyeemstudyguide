/**
 * Server-only teacher authentication for the Babonneau Learning Hub.
 * No learner token, nickname, PIN or browser-provided role grants staff access.
 */
import {createRemoteJWKSet,jwtVerify} from 'jose';
import {db} from './server.js';

const permittedRoles=new Set(['teacher','safeguarding','administrator']);
const permissions=Object.freeze({
 'class:summary':['teacher','safeguarding','administrator'],
 'room:pause':['teacher','safeguarding','administrator'],
 'room:close':['teacher','safeguarding','administrator'],
 'chat:disable':['teacher','safeguarding','administrator'],
 'incident:list':['safeguarding','administrator'],
 'incident:read':['safeguarding','administrator'],
 'incident:resolve':['safeguarding','administrator'],
 'staff:manage':['administrator']
});
const denied=(status,code)=>({ok:false,status,code});
let cachedJwks=null,cachedUrl='';
export function configured(){
 return ['STAFF_OIDC_ISSUER','STAFF_OIDC_AUDIENCE','STAFF_OIDC_JWKS_URL','STAFF_SCHOOL_ID'].every(k=>typeof process.env[k]==='string'&&process.env[k].trim().length>0);
}
function secureUrl(value){
 try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.hash}
 catch{return false}
}
function getJwks(url){
 if(url!==cachedUrl){cachedJwks=createRemoteJWKSet(new URL(url));cachedUrl=url}
 return cachedJwks;
}
function bearer(req){
 const h=req?.headers?.authorization;
 if(typeof h!=='string'||h.length>8192)return null;
 const m=/^Bearer ([A-Za-z0-9._~-]+)$/.exec(h);
 return m?m[1]:null;
}
async function verifyIdentity(token){
 const {STAFF_OIDC_ISSUER:issuer,STAFF_OIDC_AUDIENCE:audience,STAFF_OIDC_JWKS_URL:jwksUrl}=process.env;
 if(!secureUrl(issuer)||!secureUrl(jwksUrl))throw Error('OIDC configuration invalid');
 const {payload,protectedHeader}=await jwtVerify(token,getJwks(jwksUrl),{
  issuer,audience,clockTolerance:5,algorithms:['RS256','ES256']
 });
 if(!protectedHeader.kid||typeof payload.sub!=='string'||!payload.sub||!Number.isFinite(payload.exp)||!Number.isFinite(payload.iat))throw Error('Incomplete identity token');
 // A school-approved identity provider must assert MFA through amr. The
 // value "mfa" alone is accepted only from the trusted issuer above.
 const mfaSatisfied=Array.isArray(payload.amr)&&payload.amr.includes('mfa');
 if(!mfaSatisfied)throw Error('Staff MFA required');
 return {subject:payload.sub,verified:true,mfaSatisfied:true};
}
async function staffLookup(subject){
 const rows=await db().query(
  'SELECT subject,school_id,role,active,class_ids FROM gk_staff_accounts WHERE subject=$1 LIMIT 1',[subject]
 );
 const row=rows[0];return row?{subject:row.subject,schoolId:row.school_id,role:row.role,active:row.active,classIds:row.class_ids}:null;
}
/**
 * This gate must execute before every future privileged resource access.
 * The caller must also resolve room/incident ownership from the database
 * and check it against school and class scope before returning any data.
 */
export async function authoriseStaff(req,{action,schoolId,classId}={},adapters={}){
 if(!configured())return denied(503,'STAFF_AUTH_NOT_CONFIGURED');
 if(!Object.prototype.hasOwnProperty.call(permissions,action))return denied(403,'ACTION_NOT_ALLOWED');
 const token=bearer(req);if(!token)return denied(401,'SIGN_IN_REQUIRED');
 let identity,staff;
 try{
  identity=await (adapters.verifyIdentity||verifyIdentity)(token);
  if(!identity||identity.verified!==true||identity.mfaSatisfied!==true||typeof identity.subject!=='string'||!identity.subject)return denied(401,'INVALID_STAFF_SESSION');
  staff=await (adapters.staffLookup||staffLookup)(identity.subject);
 }catch{return denied(401,'INVALID_STAFF_SESSION')}
 if(!staff||staff.active!==true||staff.subject!==identity.subject||!permittedRoles.has(staff.role))return denied(403,'STAFF_ACCESS_DENIED');
 if(!permissions[action].includes(staff.role))return denied(403,'INSUFFICIENT_ROLE');
 if(typeof schoolId!=='string'||schoolId!==process.env.STAFF_SCHOOL_ID||schoolId!==staff.schoolId)return denied(403,'SCHOOL_SCOPE_DENIED');
 if(classId!==undefined){
  if(typeof classId!=='string'||!classId||classId.length>64)return denied(403,'CLASS_SCOPE_DENIED');
  if(staff.role==='teacher'&&(!Array.isArray(staff.classIds)||!staff.classIds.includes(classId)))return denied(403,'CLASS_SCOPE_DENIED');
 }
 return {ok:true,status:200,role:staff.role,subject:staff.subject,schoolId:staff.schoolId,classId:classId??null};
}
