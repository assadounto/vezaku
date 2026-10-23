import {NextRequest,NextResponse} from 'next/server';
import {sessionToken,API} from '@/lib/xonbay-auth';
export const dynamic='force-dynamic';
export async function GET(_request:NextRequest,{params}:{params:Promise<{courseId:string;lessonId:string;fileId:string}>}){
 const token=await sessionToken();if(!token)return NextResponse.json({error:'Sign in required'},{status:401});
 const {courseId,lessonId,fileId}=await params;
 if(!/^(?:[a-f0-9-]{36}|[1-9][0-9]*)$/i.test(courseId)||!/^[a-f0-9-]{36}$/i.test(lessonId)||!/^[1-9][0-9]*$/.test(fileId))return NextResponse.json({error:'Invalid file request'},{status:400});
 try{
  const url=API.replace(/\/$/,'')+'/v1/digital_courses/'+encodeURIComponent(courseId)+'/lessons/'+encodeURIComponent(lessonId)+'/files/'+encodeURIComponent(fileId);
  const response=await fetch(url,{headers:{Authorization:'Bearer '+token,Accept:'application/json'},cache:'no-store'});
  if(!response.ok)return NextResponse.json({error:response.status===404?'File not available for this enrolled lesson':'Cannot access this file'},{status:response.status});
  const data=await response.json() as {url?:string;expires_in?:number};
  if(!data.url)return NextResponse.json({error:'Missing secure media link'},{status:502});
  const parsed=new URL(data.url);if(parsed.protocol!=='https:')return NextResponse.json({error:'Invalid secure media link'},{status:502});
  return NextResponse.json({url:data.url,expires_in:data.expires_in||120},{headers:{'Cache-Control':'private,no-store','Referrer-Policy':'no-referrer'}});
 }catch{return NextResponse.json({error:'Unable to retrieve secure media'},{status:502})}
}
