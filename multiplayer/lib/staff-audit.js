/** Privacy-minimised, server-only staff audit writer. No free-form payloads. */
import {db} from './server.js';
const ACTIONS=new Set(['staff.session_verified','staff.session_revoked','room.pause','room.close','chat.disable','incident.list','incident.read','incident.resolve','staff.activate','staff.deactivate','staff.change_role']);
const TYPES=new Set(['session','room','incident','staff']);
const OUTCOMES=new Set(['success','denied','error']);
function safeText(x,max){return typeof x==='string'&&x.length>0&&x.length<=max&&/^[A-Za-z0-9_.:@/-]+$/.test(x)}
export function validateAudit(event){
 if(!event||typeof event!=='object'||Array.isArray(event))return false;
 const {schoolId,subject,role,action,objectType,objectRef=null,outcome,requestId=null}=event;
 if(!safeText(schoolId,100)||!safeText(subject,255)||!['teacher','safeguarding','administrator'].includes(role))return false;
 if(!ACTIONS.has(action)||!TYPES.has(objectType)||!OUTCOMES.has(outcome))return false;
 const expected=action.startsWith('room.')||action==='chat.disable'?'room':action.startsWith('incident.')?'incident':action.startsWith('staff.')&&action!=='staff.session_verified'&&action!=='staff.session_revoked'?'staff':'session';
 if(objectType!==expected)return false;
 if(objectRef!==null&&!safeText(objectRef,128))return false;
 if(requestId!==null&&!safeText(requestId,100))return false;
 return true;
}
/**
 * Call after server-verified authorisation. A write failure must fail the
 * associated privileged operation closed; do not silently skip audit records.
 * For state-changing operations, use one DB transaction for audit + action.
 */
export async function writeStaffAudit(event,{query}={}){
 if(!validateAudit(event))throw Error('Invalid staff audit metadata');
 const exec=query||((sql,args)=>db().query(sql,args));
 const result=await exec(
  'INSERT INTO gk_staff_audit(school_id,staff_subject,staff_role,action,object_type,object_ref,outcome,request_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
  [event.schoolId,event.subject,event.role,event.action,event.objectType,event.objectRef??null,event.outcome,event.requestId??null]
 );
 if(!Array.isArray(result)||result.length!==1||!result[0]?.id)throw Error('Audit insert could not be verified');
 return true;
}
