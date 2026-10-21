import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'VEZAKU — Learn. Build. Create.',description:'Discover hands-on courses, real-world engineering projects, and useful digital downloads on VEZAKU.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
