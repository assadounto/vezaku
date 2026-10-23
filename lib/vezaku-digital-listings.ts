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


/** Fetch a single published listing by its public UUID; verify shop ownership even for direct links. */
export async function getVezakuListingById(id:string):Promise<VezakuListing|null>{
 const shopId=process.env.VEZAKU_SHOP_ID;
 if(!shopId||!/^[1-9][0-9]*$/.test(shopId)||!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(id))return null;
 const base=(process.env.XONBAY_API_URL||'https://api.xonbay.com').replace(/\/$/,'');
 try{
  const res=await fetch(base+'/v1/public_digital_listings/'+encodeURIComponent(id),{cache:'no-store'});
  if(!res.ok){console.warn('[VEZAKU detail] Xonbay listing fetch failed',{listingId:id,status:res.status});return null;}
  const item=await res.json() as VezakuListing;
  if(String(item.shop?.id)!==shopId||item.shop?.subdomain!=='vezaku'||item.public_id?.toLowerCase()!==id.toLowerCase()){console.warn('[VEZAKU detail] Listing did not match configured VEZAKU shop',{listingId:id,receivedShopId:item.shop?.id,receivedSubdomain:item.shop?.subdomain});return null;}
  return item;
 }catch(error){console.error('[VEZAKU detail] Listing fetch error',error);return null}
}
