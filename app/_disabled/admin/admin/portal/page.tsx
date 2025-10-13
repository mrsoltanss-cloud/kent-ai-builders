"use client";

import * as React from "react";
import AdminLogin from "./AdminLogin";
import Drawer from "./Drawer";
import { signOut, signIn } from "next-auth/react";

/** Tabs */
type TabKey = "leads"|"users"|"builders"|"jobs"|"messaging"|"reviews"|"files"|"payments"|"ai"|"automations"|"analytics"|"cms"|"settings"|"audit";
const TABS: Array<{key: TabKey; label: string}> = [
  {key:"leads", label:"Leads"},
  {key:"users", label:"Users"},
  {key:"builders", label:"Builders"},
  {key:"jobs", label:"Bookings / Jobs"},
  {key:"messaging", label:"Messaging"},
  {key:"reviews", label:"Reviews"},
  {key:"files", label:"Files"},
  {key:"payments", label:"Payments"},
  {key:"ai", label:"Quotes AI Logs"},
  {key:"automations", label:"Automations"},
  {key:"analytics", label:"Analytics"},
  {key:"cms", label:"CMS & SEO"},
  {key:"settings", label:"Settings"},
  {key:"audit", label:"Audit & Health"},
];

type LeadStatus =
  | "new" | "pending_review" | "awaiting_contact" | "scheduled" | "in_progress" | "complete" | "archived" | "cancelled";

type Lead = {
  id: string; ref?: string; service: string; status: LeadStatus; updatedAt?: string;
  user?: { id?: string; email?: string|null; name?: string|null };
  squareMeters?: number|null; rooms?: number|null; urgency?: string|null; budget?: number|null;
  propertyAge?: string|null; timeline?: string|null; contact?: string|null; aiMin?: number|null; aiMax?: number|null;
  scope?: string|null; // optional field if present in schema
};

const ORDER: LeadStatus[] = ["new","pending_review","awaiting_contact","scheduled","in_progress","complete","archived","cancelled"];
const LABEL: Record<LeadStatus,string> = {
  new:"🆕 New", pending_review:"🕵️ Pending review", awaiting_contact:"📞 Awaiting contact",
  scheduled:"📅 Scheduled", in_progress:"🛠️ In progress", complete:"✅ Complete",
  archived:"📦 Archived", cancelled:"⛔ Cancelled",
};

const pill = (active:boolean)=> `rounded-full px-3 py-1.5 text-sm ring-1 ${active?"bg-emerald-600 text-white ring-emerald-600":"bg-white text-slate-700 ring-slate-300 hover:bg-gray-50"}`;
const badge = "inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs";

export default function AdminPortal(){
  const [role,setRole]=React.useState<string|null|undefined>(undefined);
  const [me,setMe]=React.useState<{email:string|null,name:string|null}|null>(null);
  const [tab,setTab]=React.useState<TabKey>("leads");

  React.useEffect(()=>{
    let dead=false;
    fetch("/api/me").then(r=>r.ok?r.json():{role:null,user:null}).then(d=>{ if(!dead){ setRole(d.role??null); setMe(d.user??null); }});
    return ()=>{dead=true};
  },[]);

  // loading
  if (role === undefined) return <LoadingShell />;

  // not signed in
  if (role === null) return (
    <main className="mx-auto max-w-7xl p-6">
      <Header />
      <div className="mb-6 text-sm text-slate-500">Sign in to manage the platform.</div>
      <AdminLogin />
    </main>
  );

  // signed in but not allowed
  const R = String(role).toUpperCase();
  const allowed = R==="ADMIN" || R==="OPS";
  if (!allowed) return (
    <main className="mx-auto max-w-7xl p-6">
      <Header />
      <div className="rounded-2xl border bg-amber-50 p-4 text-sm text-amber-900">
        <div className="mb-2">Your account doesn’t have admin access. Ask a site admin to set your role to <b>ADMIN</b> or <b>OPS</b>.</div>
        <div className="text-slate-700">Signed in as: <b>{me?.email ?? "unknown"}</b></div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={()=>signOut({callbackUrl:"/admin/portal"})} className="rounded-full border px-4 py-2 text-sm hover:bg-gray-50">Sign out</button>
          <button onClick={()=>signIn(undefined,{callbackUrl:"/admin/portal"})} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Sign in with a different account</button>
        </div>
      </div>
    </main>
  );

  return (
    <main className="mx-auto max-w-7xl p-6">
      <Header right={<div className="text-xs text-slate-500">Mirrors client view with admin controls</div>} />
      {/* Tabs */}
      <nav className="mb-4 flex flex-wrap items-center gap-2">
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)} className={pill(tab===t.key)}>{t.label}</button>
        ))}
        <div className="ml-auto text-xs text-slate-500">Signed in as {me?.email ?? "unknown"} ({R})</div>
      </nav>

      {/* Body */}
      {tab==="leads" && <LeadsTab />}
      {tab==="users" && <UsersTab />}
      {tab==="builders" && <EmptyTab label="Builders" helper="Connect a Builder model to populate this view." />}
      {tab==="jobs" && <EmptyTab label="Bookings / Jobs" helper="Wire to accepted jobs pipeline." />}
      {tab==="messaging" && <EmptyTab label="Messaging" helper="Centralise email/SMS/WhatsApp logs here." />}
      {tab==="reviews" && <EmptyTab label="Reviews" helper="Moderate homeowner reviews." />}
      {tab==="files" && <EmptyTab label="Files" helper="Browse all uploaded documents/photos." />}
      {tab==="payments" && <PaymentsTab />}
      {tab==="ai" && <AiLogsTab />}
      {tab==="automations" && <AutomationsTab />}
      {tab==="analytics" && <AnalyticsTab />}
      {tab==="cms" && <EmptyTab label="CMS & SEO" helper="Plug in your pages/locations/services editor." />}
      {tab==="settings" && <SettingsTab />}
      {tab==="audit" && <AuditTab />}
    </main>
  );
}

/** ---------- Shared bits ---------- */
function Header({ right }: { right?: React.ReactNode }) {
  return (
    <header className="mb-5 flex items-center justify-between">
      <h1 className="text-xl font-semibold">Admin • Leads</h1>
      {right}
    </header>
  );
}
function LoadingShell(){
  return (
    <main className="mx-auto max-w-7xl p-6">
      <Header />
      <div className="rounded-2xl border p-6 text-sm text-slate-600">Loading…</div>
    </main>
  );
}
function EmptyTab({label, helper}:{label:string; helper:string}){
  return (
    <div className="rounded-2xl border p-10 text-center text-sm text-slate-600">
      <div className="text-base font-semibold">{label}</div>
      <div className="mt-1">{helper}</div>
    </div>
  );
}

/** ---------- Leads Tab (power features) ---------- */
function LeadsTab(){
  const [rows,setRows]=React.useState<Lead[]>([]);
  const [tab,setTab]=React.useState<"all"|LeadStatus>("all");
  const [q,setQ]=React.useState("");
  const [openId,setOpenId]=React.useState<string|null>(null);
  const [selected,setSelected]=React.useState<Record<string,boolean>>({});

  const fetchLeads=React.useCallback(async()=>{
    const r=await fetch("/api/admin/leads",{cache:"no-store"});
    if(!r.ok) throw new Error(await r.text());
    const d=await r.json();
    setRows((d.leads??[]).map((l:any)=>({
      id:l.id, ref:l.id.slice(0,8).toUpperCase(), service:l.service, status:l.status,
      updatedAt:l.updatedAt, user:l.user, squareMeters:l.squareMeters, rooms:l.rooms, urgency:l.urgency,
      budget:l.budget, propertyAge:l.propertyAge, timeline:l.timeline, contact:l.contact, aiMin:l.aiMin, aiMax:l.aiMax, scope:l.scope
    })));
  },[]);
  React.useEffect(()=>{fetchLeads().catch(console.error)},[fetchLeads]);

  // keyboard shortcuts (focus search, advance/back selected)
  const searchRef=React.useRef<HTMLInputElement|null>(null);
  React.useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      if(e.key==="/" && !/input|textarea/i.test((e.target as any)?.tagName||"")){ e.preventDefault(); searchRef.current?.focus(); }
      if(e.key==="a"){ const id=firstSelectedId(); if(id) stage(id,"forward").then(fetchLeads); }
      if(e.key==="b"){ const id=firstSelectedId(); if(id) stage(id,"back").then(fetchLeads); }
    };
    window.addEventListener("keydown",onKey);
    return ()=>window.removeEventListener("keydown",onKey);
  },[selected,fetchLeads]);
  const firstSelectedId=()=> Object.keys(selected).find(id=>selected[id]);

  const filtered=React.useMemo(()=>{
    let r=rows;
    if(tab!=="all") r=r.filter(x=>x.status===tab);
    if(q.trim()){
      const t=q.trim().toLowerCase();
      r=r.filter(x=>x.service.toLowerCase().includes(t)||(x.ref??"").toLowerCase().includes(t)||(x.user?.email??"").toLowerCase().includes(t));
    }
    return r;
  },[rows,tab,q]);

  async function stage(id:string, action:"forward"|"back"|"set", value?:LeadStatus){
    const r=await fetch(`/api/admin/lead/${id}/stage`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(action==="set"?{action,value}:{action})});
    if(!r.ok) alert(await r.text());
  }
  async function archive(id:string){
    const r=await fetch(`/api/admin/lead/${id}/archive`,{method:"POST"}); if(!r.ok) alert(await r.text());
  }
  async function del(id:string){
    if(!confirm("Delete this lead?")) return;
    const r=await fetch(`/api/admin/lead/${id}`,{method:"DELETE"}); if(!r.ok) alert(await r.text());
  }

  function toggleAll(on:boolean){ const next:Record<string,boolean>={}; filtered.forEach(l=>next[l.id]=on); setSelected(next); }

  return (
    <section>
      {/* Filters & search */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(["all",...ORDER] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t==="all"?"all":t as any)} className={pill(tab===t)}>{t==="all"?"All":LABEL[t as LeadStatus]}</button>
        ))}
        <input ref={searchRef} value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by service, ref or email" className="ml-auto w-80 rounded-full border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-600"/>
      </div>

      {/* Bulk bar */}
      <div className="mb-2 flex items-center gap-2 text-sm text-slate-600">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={filtered.every(l=>selected[l.id]) && filtered.length>0} onChange={e=>toggleAll(e.target.checked)} />
          <span>Select all</span>
        </label>
        <span className="ml-2">{Object.values(selected).filter(Boolean).length} selected</span>
        <div className="ml-4 flex items-center gap-2">
          <button onClick={()=>{ const id=firstSelectedId(); if(id) stage(id,"back").then(fetchLeads); }} className="rounded-2xl border px-3 py-1.5 text-sm hover:bg-gray-50">◀ Back</button>
          <button onClick={()=>{ const id=firstSelectedId(); if(id) stage(id,"forward").then(fetchLeads); }} className="rounded-2xl border px-3 py-1.5 text-sm hover:bg-gray-50">Advance ▶</button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map(l=>(
          <div key={l.id} className="rounded-2xl border p-4">
            <div className="flex flex-wrap items-center gap-2">
              <input type="checkbox" checked={!!selected[l.id]} onChange={e=>setSelected(s=>({...s,[l.id]:e.target.checked}))}/>
              <button onClick={()=>setOpenId(l.id)} className="text-left text-base font-semibold hover:underline">{l.service}</button>
              <span className="text-xs text-slate-500">Ref {l.ref}</span>
              <span className="text-xs text-slate-500">• {l.user?.email ?? "unknown"}</span>
              <span className={badge}>{LABEL[l.status]}</span>
              <span className="ml-auto text-xs text-slate-400">{new Date(l.updatedAt ?? Date.now()).toLocaleString()}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={()=>stage(l.id,"back").then(fetchLeads)} className="rounded-2xl border px-3 py-1.5 text-sm hover:bg-gray-50">◀ Back stage</button>
              <button onClick={()=>stage(l.id,"forward").then(fetchLeads)} className="rounded-2xl border px-3 py-1.5 text-sm hover:bg-gray-50">Advance stage ▶</button>
              <select className="rounded-2xl border px-3 py-1.5 text-sm" value={l.status} onChange={e=>stage(l.id,"set", e.target.value as LeadStatus).then(fetchLeads)}>
                {ORDER.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={()=>archive(l.id).then(fetchLeads)} className="rounded-2xl border px-3 py-1.5 text-sm hover:bg-gray-50">Archive</button>
              <button onClick={()=>del(l.id).then(fetchLeads)} className="rounded-2xl border border-red-300 bg-red-50 px-3 py-1.5 text-sm text-red-700 hover:bg-red-100">Delete</button>
            </div>
          </div>
        ))}
        {filtered.length===0 && (<div className="rounded-xl border p-8 text-center text-sm text-slate-600">No leads match.</div>)}
      </div>

      {/* Details Drawer */}
      <Drawer open={!!openId} onClose={()=>setOpenId(null)} title="Lead details">
        {openId && <LeadDetails id={openId} onClose={()=>setOpenId(null)} />}
      </Drawer>
    </section>
  );
}

function LeadDetails({id,onClose}:{id:string; onClose:()=>void}){
  const [lead,setLead]=React.useState<Lead|null>(null);
  const load=React.useCallback(async()=>{
    const r=await fetch("/api/admin/leads");
    const d=await r.json();
    const L=(d.leads??[]).find((x:any)=>x.id===id);
    if(L) setLead({
      id:L.id, ref:L.id.slice(0,8).toUpperCase(), service:L.service, status:L.status, updatedAt:L.updatedAt,
      user:L.user, squareMeters:L.squareMeters, rooms:L.rooms, urgency:L.urgency, budget:L.budget,
      propertyAge:L.propertyAge, timeline:L.timeline, contact:L.contact, aiMin:L.aiMin, aiMax:L.aiMax, scope:L.scope
    });
  },[id]);
  React.useEffect(()=>{load()},[load]);

  if(!lead) return <div className="text-sm text-slate-600">Loading…</div>;

  const whatsappNumber = (process.env.WHATSAPP_NUMBER ?? "+447000000000").replace(/\D/g,'');
  const wa = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi — re: ${lead.service} (Ref ${lead.ref}).`)}`;
  const email = `mailto:${lead.user?.email ?? ""}?subject=${encodeURIComponent(`About your ${lead.service} (Ref ${lead.ref})`)}`;

  return (
    <div className="space-y-6">
      <section>
        <div className="text-sm text-slate-500">Reference</div>
        <div className="text-base font-semibold">{lead.ref}</div>
      </section>

      <section className="grid grid-cols-2 gap-4 text-sm">
        <div><div className="text-slate-500">Service</div><div className="font-medium">{lead.service}</div></div>
        <div><div className="text-slate-500">Status</div><div className="font-medium">{lead.status}</div></div>
        <div><div className="text-slate-500">Rooms</div><div className="font-medium">{lead.rooms ?? "–"}</div></div>
        <div><div className="text-slate-500">Size (sqm)</div><div className="font-medium">{lead.squareMeters ?? "–"}</div></div>
        <div><div className="text-slate-500">Urgency</div><div className="font-medium">{lead.urgency ?? "–"}</div></div>
        <div><div className="text-slate-500">Budget</div><div className="font-medium">{lead.budget ? `£${lead.budget.toLocaleString()}` : "–"}</div></div>
        <div><div className="text-slate-500">Property age</div><div className="font-medium">{lead.propertyAge ?? "–"}</div></div>
        <div><div className="text-slate-500">Timeline</div><div className="font-medium">{lead.timeline ?? "–"}</div></div>
        <div className="col-span-2"><div className="text-slate-500">Scope</div><div className="font-medium whitespace-pre-wrap">{lead.scope ?? "–"}</div></div>
      </section>

      <section className="text-sm">
        <div className="text-slate-500">Homeowner</div>
        <div className="font-medium">{lead.user?.name ?? "—"} <span className="text-slate-500">({lead.user?.email ?? "unknown"})</span></div>
        <div className="mt-2 flex gap-2">
          <a href={wa} target="_blank" className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700">Chat on WhatsApp</a>
          <a href={email} className="rounded-lg border px-3 py-1.5 text-xs hover:bg-gray-50">Email</a>
        </div>
      </section>

      <section className="text-sm">
        <div className="text-slate-500">AI estimate</div>
        <div className="font-medium">{lead.aiMin||lead.aiMax ? `£${(lead.aiMin??0).toLocaleString()}–£${(lead.aiMax??0).toLocaleString()}` : "—"}</div>
      </section>

      <div className="pt-2">
        <button onClick={onClose} className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50">Close</button>
      </div>
    </div>
  );
}

/** ---------- Users Tab (read from DB) ---------- */
function UsersTab(){
  const [rows,setRows]=React.useState<Array<{id:string;email:string;name:string|null;role:string|null;createdAt:string;leadsCount:number}>>([]);
  const [q,setQ]=React.useState("");

  const load=React.useCallback(async()=>{
    const r=await fetch("/api/admin/users",{cache:"no-store"});
    const d=await r.json();
    setRows(d.users??[]);
  },[]);
  React.useEffect(()=>{load()},[load]);

  const filtered=React.useMemo(()=>{
    if(!q.trim()) return rows;
    const t=q.trim().toLowerCase();
    return rows.filter(u=> (u.email||"").toLowerCase().includes(t) || (u.name||"").toLowerCase().includes(t));
  },[rows,q]);

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name or email" className="w-80 rounded-full border px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-600"/>
      </div>

      <div className="space-y-3">
        {filtered.map(u=>(
          <div key={u.id} className="rounded-2xl border p-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="text-base font-medium">{u.name ?? "—"}</div>
              <span className="text-xs text-slate-500">{u.email}</span>
              <span className={badge}>{(u.role||"").toUpperCase()||"USER"}</span>
              <span className="text-xs text-slate-500">• Leads: {u.leadsCount}</span>
              <span className="ml-auto text-xs text-slate-400">{new Date(u.createdAt).toLocaleString()}</span>
            </div>
            <div className="mt-3 text-sm text-slate-600">
              <span className="rounded border px-2 py-1">Impersonate</span>
              <span className="ml-2 rounded border px-2 py-1">Export data</span>
              <span className="ml-2 rounded border px-2 py-1">Suspend</span>
            </div>
          </div>
        ))}
        {filtered.length===0 && <div className="rounded-xl border p-8 text-center text-sm text-slate-600">No users.</div>}
      </div>
    </section>
  );
}

/** ---------- Payments (stub) ---------- */
function PaymentsTab(){
  const [data,setData]=React.useState<{payments:any[];invoices:any[]}|null>(null);
  React.useEffect(()=>{ fetch("/api/admin/payments").then(r=>r.json()).then(setData); },[]);
  return (
    <div className="rounded-2xl border p-6 text-sm text-slate-600">
      <div className="text-base font-semibold mb-2">Payments & Invoices</div>
      <div>Hook this up to Stripe: show transactions, payouts, refunds. (Stubbed for now)</div>
      <div className="mt-2">Payments: {data?.payments?.length ?? 0} • Invoices: {data?.invoices?.length ?? 0}</div>
    </div>
  );
}

/** ---------- AI Logs (stub) ---------- */
function AiLogsTab(){
  const [logs,setLogs]=React.useState<any[]>([]);
  React.useEffect(()=>{ fetch("/api/admin/quotes-logs").then(r=>r.json()).then(d=>setLogs(d.logs??[])); },[]);
  return (
    <div className="rounded-2xl border p-6 text-sm text-slate-600">
      <div className="text-base font-semibold mb-2">Quotes AI Logs</div>
      <div>Log each AI quote request here. (Stubbed)</div>
      <div className="mt-2">Total logs: {logs.length}</div>
    </div>
  );
}

/** ---------- Automations (stub) ---------- */
function AutomationsTab(){
  const [rows,setRows]=React.useState<any[]>([]);
  React.useEffect(()=>{ fetch("/api/admin/automations").then(r=>r.json()).then(d=>setRows(d.automations??[])); },[]);
  return (
    <div className="space-y-3">
      {rows.map(a=>(
        <div key={a.id} className="rounded-2xl border p-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="text-base font-semibold">{a.name}</div>
            <span className={badge}>{a.enabled?"Enabled":"Disabled"}</span>
            <span className="ml-auto text-xs text-slate-500">{a.trigger} → {a.action}</span>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="rounded-2xl border px-3 py-1.5 hover:bg-gray-50">Edit</button>
            <button className="rounded-2xl border px-3 py-1.5 hover:bg-gray-50">Disable</button>
            <button className="rounded-2xl border px-3 py-1.5 hover:bg-gray-50">Run test</button>
          </div>
        </div>
      ))}
      {rows.length===0 && <div className="rounded-2xl border p-6 text-sm text-slate-600">No automations yet.</div>}
    </div>
  );
}

/** ---------- Analytics (totals only, safe) ---------- */
function AnalyticsTab(){
  const [tot,setTot]=React.useState<{users:number;leads:number}|null>(null);
  React.useEffect(()=>{ fetch("/api/admin/analytics").then(r=>r.json()).then(d=>setTot(d.totals ?? null)); },[]);
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-2xl border p-6">
        <div className="text-sm text-slate-500">Total users</div>
        <div className="text-2xl font-semibold">{tot?.users ?? "—"}</div>
      </div>
      <div className="rounded-2xl border p-6">
        <div className="text-sm text-slate-500">Total leads</div>
        <div className="text-2xl font-semibold">{tot?.leads ?? "—"}</div>
      </div>
    </div>
  );
}

/** ---------- Settings (env mask) ---------- */
function SettingsTab(){
  const [env,setEnv]=React.useState<any>(null);
  React.useEffect(()=>{ fetch("/api/admin/settings").then(r=>r.json()).then(setEnv); },[]);
  return (
    <div className="rounded-2xl border p-6 text-sm">
      <div className="text-base font-semibold mb-2">Settings</div>
      <pre className="overflow-auto rounded bg-slate-50 p-3">{JSON.stringify(env?.env ?? {}, null, 2)}</pre>
    </div>
  );
}

/** ---------- Audit (stub) ---------- */
function AuditTab(){
  const [rows,setRows]=React.useState<any[]>([]);
  React.useEffect(()=>{ fetch("/api/admin/audit").then(r=>r.json()).then(d=>setRows(d.events??[])); },[]);
  return (
    <div className="rounded-2xl border p-6 text-sm text-slate-600">
      <div className="text-base font-semibold mb-2">Audit & System Health</div>
      <div>Track admin actions and system status. (Stubbed)</div>
      <div className="mt-2">Events: {rows.length}</div>
    </div>
  );
}
