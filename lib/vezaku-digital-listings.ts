/** Public-only VEZAKU catalogue source. Never fetch the global market by accident. */
export type VezakuListing={id:number;public_id:string;title:string;description:string;content_type:'course'|'article'|'download'|'bundle';tags:string[];price_minor:number;currency:string;cover_url:string|null;shop:{id:number;name:string;subdomain:string};course_modules?:{id:string;title:string;lessons:{id:string;title:string;preview:boolean}[]}[]};
export async function getVezakuListings(contentType?:VezakuListing['content_type']) {
 const shopId=process.env.VEZAKU_SHOP_ID;
 if(!shopId||!/^[1-9][0-9]*$/.test(shopId))return {items:[] as VezakuListing[],configured:false,error:null as string|null};
 const url=new URL('/v1/public_digital_listings',process.env.XONBAY_API_URL||'https://api.xonbay.com');
 url.searchParams.set('shop_id',shopId);
 if(contentType)url.searchParams.set('content_type',contentType);
 try{
  const res=await fetch(url.toString(),{next:{revalidate:120}});
  if(!res.ok)return {items:[] as VezakuListing[],configured:true,error:'Catalogue temporarily unavailable'};
  const data=await res.json();
  const items=(Array.isArray(data.items)?data.items:[]).filter((item:VezakuListing)=>String(item.shop?.id)===shopId&&item.shop?.subdomain==='vezaku');
  return {items:items as VezakuListing[],configured:true,error:null};
 }catch{return {items:[] as VezakuListing[],configured:true,error:'Catalogue temporarily unavailable'}}
}
