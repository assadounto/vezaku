'use client';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import {ChevronDown,LayoutDashboard,LogOut,UserRound,BookOpen} from 'lucide-react';
export function AccountHeaderActions({user}:{user:{name:string;email:string}|null}){
 const router=useRouter();const [busy,setBusy]=useState(false);
 async function signOut(){if(busy)return;setBusy(true);try{await fetch('/api/auth/logout',{method:'POST',cache:'no-store'})}finally{router.replace('/');router.refresh();setBusy(false)}}
 if(!user)return <div className="header-account-guest"><Link href="/login" className="header-signin">Sign in</Link><Link href="/signup" className="nav-button">Create account</Link></div>;
 const initials=(user.name||user.email||'V').trim().split(/\s+/).slice(0,2).map(n=>n[0]?.toUpperCase()).join('')||'V';
 return <details className="header-account-menu"><summary aria-label="Open account menu"><span className="account-avatar">{initials}</span><span className="account-identity"><strong>{user.name||'My account'}</strong><small>My account</small></span><ChevronDown size={15}/></summary><div className="header-account-dropdown"><div className="account-dropdown-user"><strong>{user.name||'Xonbay account'}</strong><small>{user.email}</small></div><Link href="/dashboard"><LayoutDashboard size={17}/> Dashboard</Link><Link href="/dashboard/learning"><BookOpen size={17}/> My learning</Link><Link href="/dashboard/library"><UserRound size={17}/> My library</Link><button type="button" disabled={busy} onClick={signOut}><LogOut size={17}/>{busy?'Signing out…':'Sign out'}</button></div></details>;
}
