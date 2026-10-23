import {getVezakuListings,type VezakuListing} from '@/lib/vezaku-digital-listings';
import type {Kind,Listing} from '@/lib/catalog';
export type LiveListing=Listing & {publicId:string;rawType:VezakuListing['content_type']};
export function kindOf(item:VezakuListing):Kind {
 if(item.content_type==='course')return 'courses';
 if(item.content_type==='article')return 'projects';
 if(item.tags?.some(t=>['project','projects','engineering-project'].includes(t.toLowerCase())))return 'projects';
 return 'products';
}
export function mapListing(item:VezakuListing):LiveListing {
 const kind=kindOf(item);
 const fallback=kind==='courses'?'/images/course-web.svg':kind==='projects'?'/images/project-iot.svg':'/images/product-web.svg';
 const contents=item.content_type==='course'?item.course_modules?.flatMap(m=>m.lessons.map(l=>l.title))||[]:[];
 return {publicId:item.public_id,rawType:item.content_type,slug:item.public_id,kind,title:item.title,description:item.description||'',summary:item.description||'',price:item.price_minor/100,image:item.cover_url||fallback,category:kind==='courses'?'Course':kind==='projects'?'Project guide':'Digital resource',contents,audience:'Learners and builders',duration:item.content_type==='course'?contents.length+' lessons':undefined};
}
export async function getLiveCatalogue(kind:Kind) {
 const result=await getVezakuListings();
 return {...result,items:result.items.map(mapListing).filter(x=>x.kind===kind)};
}
export async function getLiveListing(kind:Kind,id:string) {
 if(!/^[a-f0-9-]{36}$/i.test(id))return null;
 const result=await getLiveCatalogue(kind);
 return result.items.find(x=>x.publicId===id)||null;
}
