import {NextResponse} from 'next/server';import {resolveVezakuListing} from '@/lib/vezaku-digital-listings';
export const dynamic='force-dynamic';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 const result=await resolveVezakuListing(id);
 return NextResponse.json({routeReached:true,listingId:id,upstreamStatus:result.status,reason:result.reason||'OK',found:!!result.item,kind:result.item?.content_type??null},{status:200,headers:{'Cache-Control':'no-store'}});
}
