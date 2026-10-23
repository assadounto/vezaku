import Details,{generateMetadata as detailMetadata} from '@/app/[kind]/[slug]/page';
import type {Metadata} from 'next';
export const dynamic='force-dynamic';
export const dynamicParams=true;
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;return detailMetadata({params:Promise.resolve({kind:'courses',slug})});}
export default async function Page({params}:Props){const {slug}=await params;console.info('[VEZAKU explicit route] courses',{slug});return Details({params:Promise.resolve({kind:'courses',slug})});}
