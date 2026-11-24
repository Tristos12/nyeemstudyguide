import test from 'node:test';
import assert from 'node:assert/strict';
import {SignJWT,createLocalJWKSet,exportJWK,generateKeyPair} from 'jose';
import {verifyStaffJwt} from '../lib/staff-auth.js';

const issuer='https://idp.school.example';
const audience='bss-teachers';
const keyPair=await generateKeyPair('ES256');
const jwk=await exportJWK(keyPair.publicKey);jwk.kid='staff-test-1';jwk.alg='ES256';jwk.use='sig';
const jwks=createLocalJWKSet({keys:[jwk]});
async function sign({tokenIssuer=issuer,tokenAudience=audience,expires='5m',amr=['pwd','mfa'],subject='staff-123'}={}){
 return new SignJWT({amr})
  .setProtectedHeader({alg:'ES256',kid:'staff-test-1'})
  .setIssuer(tokenIssuer).setAudience(tokenAudience).setSubject(subject)
  .setIssuedAt().setExpirationTime(expires).sign(keyPair.privateKey);
}
async function rejected(token,options={issuer,audience}){
 await assert.rejects(()=>verifyStaffJwt(token,jwks,options));
}
test('valid cryptographically signed staff JWT with MFA accepted',async()=>{
 const result=await verifyStaffJwt(await sign(),jwks,{issuer,audience});
 assert.equal(result.subject,'staff-123');assert.equal(result.verified,true);assert.equal(result.mfaSatisfied,true);
});
test('wrong issuer rejected',async()=>rejected(await sign({tokenIssuer:'https://attacker.example'})));
test('wrong audience rejected',async()=>rejected(await sign({tokenAudience:'student-api'})));
test('expired token rejected',async()=>rejected(await sign({expires:-120})));
test('missing multifactor claim rejected',async()=>rejected(await sign({amr:['pwd']})));
test('missing MFA array rejected',async()=>rejected(await sign({amr:undefined})));
test('missing subject rejected',async()=>rejected(await sign({subject:''})));
test('untrusted signing key rejected',async()=>{
 const other=await generateKeyPair('ES256');
 const forged=await new SignJWT({amr:['mfa']}).setProtectedHeader({alg:'ES256',kid:'staff-test-1'}).setIssuer(issuer).setAudience(audience).setSubject('staff-123').setIssuedAt().setExpirationTime('5m').sign(other.privateKey);
 await rejected(forged);
});
test('HS256 algorithm confusion rejected',async()=>{
 const forged=await new SignJWT({amr:['mfa']}).setProtectedHeader({alg:'HS256',kid:'staff-test-1'}).setIssuer(issuer).setAudience(audience).setSubject('staff-123').setIssuedAt().setExpirationTime('5m').sign(new TextEncoder().encode('test-secret-not-for-production'));
 await rejected(forged);
});
test('invalid issuer configuration rejected',async()=>rejected(await sign(),{issuer:'http://insecure.example',audience}));
