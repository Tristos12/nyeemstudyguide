'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {authoriseStaff}=require('./staff-authorization.cjs');
const schoolId='bss-stlucia';
const request={headers:{authorization:'Bearer verified-session'}};
const verifyIdentity=async()=>({subject:'staff-123',verified:true,mfaSatisfied:true});
const findStaffBySubject=async subject=>({subject,active:true,role:'teacher',schoolId,classIds:['1R11']});
const check=overrides=>authoriseStaff({request,action:'class:summary',schoolId,classId:'1R11',verifyIdentity,findStaffBySubject,...overrides});
test('no identity adapters means deny',async()=>assert.equal((await check({verifyIdentity:undefined})).status,503));
test('missing bearer token means deny',async()=>assert.equal((await check({request:{headers:{}}})).status,401));
test('unverified claims mean deny',async()=>assert.equal((await check({verifyIdentity:async()=>({subject:'staff-123',verified:false,mfaSatisfied:true})})).status,401));
test('no MFA means deny',async()=>assert.equal((await check({verifyIdentity:async()=>({subject:'staff-123',verified:true,mfaSatisfied:false})})).status,401));
test('inactive staff means deny',async()=>assert.equal((await check({findStaffBySubject:async s=>({subject:s,active:false,role:'teacher',schoolId,classIds:['1R11']})})).status,403));
test('unlisted actions mean deny',async()=>assert.equal((await check({action:'room:delete-everything'})).status,403));
test('cross-school access means deny',async()=>assert.equal((await check({schoolId:'another-school'})).status,403));
test('teacher cannot access unassigned class',async()=>assert.equal((await check({classId:'1R12'})).status,403));
test('teacher cannot read incidents',async()=>assert.equal((await check({action:'incident:read'})).status,403));
test('teacher in assigned class may view summary',async()=>assert.equal((await check({})).ok,true));
test('safeguarding role may review incidents',async()=>{
 const r=await check({action:'incident:read',findStaffBySubject:async subject=>({subject,active:true,role:'safeguarding',schoolId})});
 assert.equal(r.ok,true);
});
test('claimed role from request is ignored',async()=>{
 const r=await check({request:{headers:{authorization:'Bearer verified-session'},body:{role:'administrator'}},action:'staff:manage'});
 assert.equal(r.status,403);
});
