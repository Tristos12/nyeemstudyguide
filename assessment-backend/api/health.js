// Public, non-sensitive status endpoint for the dedicated writing-feedback service.
// Never returns environment values, secrets or submitted work.
module.exports = function handler(req,res){
  res.setHeader("Content-Type","application/json; charset=utf-8");
  res.setHeader("Cache-Control","no-store");
  res.setHeader("X-Content-Type-Options","nosniff");
  if(req.method!=="GET"){res.statusCode=405;return res.end(JSON.stringify({status:"method_not_allowed"}))}
  const enabled=process.env.ASSESSMENT_ENABLED==="true";
  const configured=["OPENAI_API_KEY","OPENAI_MODEL","TURNSTILE_SECRET_KEY","KV_REST_API_URL","KV_REST_API_TOKEN","RATE_LIMIT_SALT"].every(k=>Boolean(process.env[k]));
  res.statusCode=200;
  return res.end(JSON.stringify({service:"ctec-writing-feedback",deployment:"online",assessmentEnabled:enabled&&configured,studentSubmissionsEnabled:enabled&&configured,teacherReviewRequired:true}));
};