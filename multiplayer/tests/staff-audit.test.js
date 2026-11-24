import test from 'node:test';
import assert from 'node:assert/strict';
import {validateAudit,writeStaffAudit} from '../lib/staff-audit.js';

const good={schoolId:'bss-stlucia',subject:'oidc:staff-42',role:'teacher',action:'staff.session_verified',objectType:'session',outcome:'success',requestId:'req-23'};
test('valid minimal staff session event',()=>assert.equal(validateAudit(good),true));
test('fails closed for unknown audit action',()=>assert.equal(validateAudit({...good,action:'messages.export'}),false));
test('rejects role spoofing',()=>assert.equal(validateAudit({...good,role:'superuser'}),false));
test('rejects inappropriate object scope',()=>assert.equal(validateAudit({...good,objectType:'incident'}),false));
test('rejects free-form message content in identifiers',()=>assert.equal(validateAudit({...good,objectRef:'child shared a phone number'}),false));
test('rejects unrestricted text in school scope',()=>assert.equal(validateAudit({...good,schoolId:'school\nDROP TABLE'}),false));
test('rejects excessively long staff IDs',()=>assert.equal(validateAudit({...good,subject:'x'.repeat(256)}),false));
test('writes only fixed audited metadata fields',async()=>{
 let seen;
 const success=await writeStaffAudit(good,{query:async(sql,params)=>{seen={sql,params};return [{id:15}]}});
 assert.equal(success,true);
 assert.equal(seen.params.length,8);
 assert.deepEqual(seen.params,['bss-stlucia','oidc:staff-42','teacher','staff.session_verified','session',null,'success','req-23']);
 assert.match(seen.sql,/INSERT INTO gk_staff_audit/);
});
test('invalid event is rejected before database access',async()=>{
 let called=false;
 await assert.rejects(()=>writeStaffAudit({...good,action:'unsafe.action'},{query:async()=>{called=true;return [{id:1}]}}));
 assert.equal(called,false);
});
test('database failure cannot be silently treated as successful audit',async()=>{
 await assert.rejects(()=>writeStaffAudit(good,{query:async()=>[]}));
});
