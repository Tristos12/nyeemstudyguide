// Pilot-only assessment endpoint. Requires a separately configured private access token.
// The public student endpoint remains disabled unless ASSESSMENT_ENABLED=true.
const crypto=require("node:crypto");
const assess=require("./assess.js");
const ORIGIN="https://tristos12.github.io";
function reply(res,status,error,origin){
 res.writeHead(status,{"Content-Type":"application/json; charset=utf-8","Cache-Control":"no-store","Vary":"Origin",...(origin===ORIGIN?{"Access-Control-Allow-Origin":ORIGIN}:{})});
 return res.end(JSON.stringify({error}));
}
module.exports=async function pilot(req,res){
 const origin=req.headers?.origin||"";
 const referer=req.headers?.referer||"";
 if(origin!==ORIGIN||(referer&&!referer.startsWith(ORIGIN+"/nyeemstudyguide/")))return reply(res,403,"origin_not_allowed");
 if(req.method==="OPTIONS"){
  req.pilotMode=true;
  return assess(req,res);
 }
 if(req.method!=="POST")return reply(res,405,"method_not_allowed",origin);
 // A missing setting always keeps the pilot closed.
 if(process.env.PILOT_ENABLED!=="true"||!process.env.PILOT_ACCESS_TOKEN||process.env.PILOT_ACCESS_TOKEN.length<32)
  return reply(res,503,"pilot_not_enabled",origin);
 const given=req.headers["x-bss-pilot-key"]||"";
 const expected=process.env.PILOT_ACCESS_TOKEN;
 const a=Buffer.from(typeof given==="string"?given:"");
 const b=Buffer.from(expected);
 if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return reply(res,403,"pilot_access_denied",origin);
 req.pilotMode=true;
 return assess(req,res);
};