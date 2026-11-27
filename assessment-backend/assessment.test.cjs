const test=require("node:test");
const assert=require("node:assert/strict");
const assess=require("./api/assess.js");
const health=require("./api/health.js");
function response(){
 let status,headers={},text="";
 return {writeHead(s,h){status=s;headers=h},setHeader(k,v){headers[k]=v},end(s=""){text+=s},get status(){return status??this.statusCode},get payload(){return text?JSON.parse(text):null},get headers(){return headers}};
}
test("health is available but assessment disabled",()=>{
 const r=response();health({method:"GET"},r);
 assert.equal(r.status,200);
 assert.equal(r.payload.service,"ctec-writing-feedback");
 assert.equal(r.payload.assessmentEnabled,false);
});
test("health does not reveal secret configuration",()=>{
 const r=response();health({method:"GET"},r);
 assert.equal(JSON.stringify(r.payload).includes("OPENAI_API_KEY"),false);
});
test("assessment refuses requests without trusted Origin",async()=>{
 const r=response();await assess({method:"POST",headers:{origin:"https://not-a-school.example"}},r);
 assert.equal(r.status,403);
 assert.equal(r.payload.error,"origin_not_allowed");
});
test("assessment disabled even for permitted Origin",async()=>{
 const prev=process.env.ASSESSMENT_ENABLED;process.env.ASSESSMENT_ENABLED="false";
 try{
 const r=response();await assess({method:"POST",headers:{origin:"https://tristos12.github.io",referer:"https://tristos12.github.io/nyeemstudyguide/ctec-english-guide.html"}},r);
 assert.equal(r.status,503);assert.equal(r.payload.error,"assessment_not_enabled");
 }finally{if(prev===undefined)delete process.env.ASSESSMENT_ENABLED;else process.env.ASSESSMENT_ENABLED=prev}
});
test("assessment refuses GET",async()=>{
 const r=response();await assess({method:"GET",headers:{origin:"https://tristos12.github.io"}},r);
 assert.equal(r.status,405);
});
