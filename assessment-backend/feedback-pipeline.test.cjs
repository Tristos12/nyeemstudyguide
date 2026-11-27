const test = require("node:test");
const assert = require("node:assert/strict");
const { Readable } = require("node:stream");
const assess = require("./api/assess.js");

// All content in these tests is fictional. No production keys, student responses or HTTP requests.
const origin="https://tristos12.github.io";
const ref=origin+"/nyeemstudyguide/ctec-english-guide.html";
function makeReq(body, overrides={}){
 const req=Readable.from([JSON.stringify(body)]);
 req.method="POST";
 req.headers={origin,referer:ref,"x-forwarded-for":"192.0.2.10",...overrides};
 return req;
}
function makeRes(){
 let status=null, headers={}, body="";
 return {
   writeHead(s,h){status=s;headers=h},
   end(s=""){body+=s},
   get status(){return status},
   get headers(){return headers},
   get json(){return body?JSON.parse(body):null}
 };
}
const example={
 consent:true,
 answer:"Reading helps people learn new information. A short daily reading period could help students practise their comprehension skills.",
 task:"Write a paragraph explaining how reading can help students.",
 rubric:"Assess clarity of explanation, examples, organisation and grammar.",
 turnstileToken:"test-turnstile-token-12345"
};
const keys=["ASSESSMENT_ENABLED","OPENAI_API_KEY","OPENAI_MODEL","TURNSTILE_SECRET_KEY","KV_REST_API_URL","KV_REST_API_TOKEN","RATE_LIMIT_SALT"];
async function withFakeService(mode, fn) {
 const previous=Object.fromEntries(keys.map(k=>[k,process.env[k]]));
 const originalFetch=globalThis.fetch;
 process.env.ASSESSMENT_ENABLED="true";
 process.env.OPENAI_API_KEY="synthetic-test-key";
 process.env.OPENAI_MODEL="synthetic-test-model";
 process.env.TURNSTILE_SECRET_KEY="synthetic-test-secret";
 process.env.KV_REST_API_URL="https://test-redis.invalid";
 process.env.KV_REST_API_TOKEN="synthetic-token";
 process.env.RATE_LIMIT_SALT="synthetic-salt";
 const seen=[];
 globalThis.fetch=async(url, opts)=>{
  seen.push({url:String(url),opts});
  if(String(url).includes("turnstile")){
   return {ok:true,json:async()=>({success:mode!=="invalid_challenge",hostname:"tristos12.github.io"})};
  }
  if(String(url).includes("test-redis.invalid")){
   if(mode==="redis_unavailable")throw new Error("test redis failure");
   return {ok:true,json:async()=>[{result:mode==="rate_limited"?11:1},{result:1}]};
  }
  if(String(url).includes("api.openai.com")){
   if(mode==="provider_down")return {ok:false,status:500};
   const object=mode==="invalid_model_response"?
     {overview:[],strengths:"not an array",improvements:[],revisionPrompt:0}:
     {overview:"Clear topic sentence; give one concrete example.",strengths:["Relevant topic"],improvements:["Include a specific example"],revisionPrompt:"Revise one sentence to explain why reading improves comprehension."};
   return {ok:true,json:async()=>({output:[{content:[{type:"output_text",text:JSON.stringify(object)}]}]})};
  }
  throw new Error("Unexpected outbound request in synthetic test: "+url);
 };
 try{return await fn(seen)}
 finally{
  globalThis.fetch=originalFetch;
  for(const k of keys){if(previous[k]===undefined)delete process.env[k];else process.env[k]=previous[k]}
 }
}
test("valid fictional response yields formative feedback, no numeric grade",async()=>{
 await withFakeService("success",async seen=>{
  const res=makeRes();
  await assess(makeReq(example),res);
  assert.equal(res.status,200);
  assert.equal(res.json.feedback.grade,null);
  assert.equal(res.json.feedback.teacherReviewRequired,true);
  assert.equal(res.json.feedback.strengths.length,1);
  const provider=seen.find(x=>x.url.includes("api.openai.com"));
  assert.ok(provider);
  const sent=JSON.parse(provider.opts.body);
  assert.equal(sent.store,false);
  assert.match(sent.instructions,/formative feedback/);
  assert.equal(JSON.stringify(sent).includes("synthetic-test-key"),false);
 });
});
test("server refuses missing consent before any external requests",async()=>{
 await withFakeService("success",async seen=>{
  const res=makeRes();
  await assess(makeReq({...example,consent:false}),res);
  assert.equal(res.status,400);
  assert.equal(res.json.error,"consent_required");
  assert.equal(seen.length,0);
 });
});
test("invalid human verification blocks provider calls",async()=>{
 await withFakeService("invalid_challenge",async seen=>{
  const res=makeRes();await assess(makeReq(example),res);
  assert.equal(res.status,403);
  assert.equal(seen.some(x=>x.url.includes("api.openai.com")),false);
 });
});
test("rate limit exceeded returns 429, no AI submission",async()=>{
 await withFakeService("rate_limited",async seen=>{
  const res=makeRes();await assess(makeReq(example),res);
  assert.equal(res.status,429);
  assert.equal(seen.some(x=>x.url.includes("api.openai.com")),false);
 });
});
test("rate limit unavailable fails closed, no AI submission",async()=>{
 await withFakeService("redis_unavailable",async seen=>{
  const res=makeRes();await assess(makeReq(example),res);
  assert.equal(res.status,503);
  assert.equal(res.json.error,"assessment_temporarily_unavailable");
  assert.equal(seen.some(x=>x.url.includes("api.openai.com")),false);
 });
});
test("AI provider failure returns generic safe error",async()=>{
 await withFakeService("provider_down",async()=>{
  const res=makeRes();await assess(makeReq(example),res);
  assert.equal(res.status,503);
  assert.equal(JSON.stringify(res.json).includes("fictional"),false);
 });
});
test("invalid structured AI feedback is rejected",async()=>{
 await withFakeService("invalid_model_response",async()=>{
  const res=makeRes();await assess(makeReq(example),res);
  assert.equal(res.status,503);
  assert.equal(res.json.error,"assessment_temporarily_unavailable");
 });
});
test("invalid or oversized responses never reach AI",async()=>{
 await withFakeService("success",async seen=>{
  const res=makeRes();await assess(makeReq({...example,answer:"a".repeat(6001)}),res);
  assert.equal(res.status,400);assert.equal(seen.length,0);
 });
});
