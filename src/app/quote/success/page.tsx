export default function SuccessDebug({ searchParams }: { searchParams?: { ref?: string } }) {
  const ref = (searchParams && searchParams.ref) || 'BK-TEST';
  return (
    <div style={{padding:24,fontFamily:"system-ui"}}>
      <h1 style={{fontSize:28,marginBottom:12}}>DEBUG ✅ /quote/success is visible</h1>
      <p>Ref: <strong>{ref}</strong></p>
      <p style={{marginTop:12,opacity:.7}}>This is a minimal page to prove the route exists.</p>
    </div>
  );
}
export const dynamic = 'force-dynamic';
