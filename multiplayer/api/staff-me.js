import {prep,fail} from '../lib/server.js';
import {authoriseStaff,configured} from '../lib/staff-auth.js';

/**
 * Staff-only bootstrap endpoint. No public student data or moderation actions.
 * No self-enrolment: accounts must be added by an approved administrator to
 * gk_staff_accounts after identity-provider enrolment and MFA.
 */
export default async function handler(req,res){
 if(!prep(req,res))return;
 if(req.method!=='GET')return fail(res,405,'Method not allowed');
 if(!configured())return fail(res,503,'Staff access has not been activated');
 const result=await authoriseStaff(req,{action:'class:summary',schoolId:process.env.STAFF_SCHOOL_ID});
 if(!result.ok)return res.status(result.status).json({error:result.code});
 return res.status(200).json({authenticated:true,role:result.role,schoolId:result.schoolId,features:{classroomSummary:false,incidentReview:false,roomManagement:false}});
}
