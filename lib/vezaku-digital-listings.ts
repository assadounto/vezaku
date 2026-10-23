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


/** Server-only direct detail lookup. Never exposes listings from another shop. */
export async function resolveVezakuListing(id:string):Promise<{item:VezakuListing|null;reason:string;status:number}>{
 const shopId=process.env.VEZAKU_SHOP_ID?.trim();
 if(!shopId||!/^[1-9][0-9]*$/.test(shopId)){console.error('[VEZAKU detail] VEZAKU_SHOP_ID missing/invalid');return {item:null,reason:'VEZAKU_SHOP_ID is not configured correctly on the running server.',status:503};}
 if(!/^(?:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}|[1-9][0-9]*)$/i.test(id)){console.warn('[VEZAKU detail] Invalid listing identifier',id);return {item:null,reason:'This listing link has an invalid ID.',status:400};}
 const url=(process.env.XONBAY_API_URL||'https://api.xonbay.com').replace(/\/$/,'')+'/v1/public_digital_listings/'+encodeURIComponent(id);
 console.info('[VEZAKU detail] Requesting Xonbay public listing',{listingId:id,shopId});
 try{
  const res=await fetch(url,{cache:'no-store',headers:{Accept:'application/json'}});
  if(!res.ok){console.warn('[VEZAKU detail] Xonbay response',{listingId:id,status:res.status});return {item:null,reason:res.status===404?'Xonbay could not find a published listing with this ID.':'The Xonbay catalogue returned HTTP '+res.status+'.',status:res.status};}
  const item=await res.json() as VezakuListing;
  if(String(item.shop?.id)!==shopId||item.shop?.subdomain!=='vezaku'){console.warn('[VEZAKU detail] Shop mismatch',{listingId:id,actualShop:item.shop?.id,expectedShop:shopId});return {item:null,reason:'This listing is not published by the configured VEZAKU shop.',status:404};}
  if(String(item.public_id).toLowerCase()!==id.toLowerCase()&&String(item.id)!==id)return {item:null,reason:'Xonbay returned a different listing.',status:404};
  return {item,reason:'',status:200};
 }catch(error){console.error('[VEZAKU detail] Network error',error);return {item:null,reason:'VEZAKU could not connect to the Xonbay API.',status:502};}
}
export async function getVezakuListingById(id:string):Promise<VezakuListing|null>{
 return (await resolveVezakuListing(id)).item;
}
