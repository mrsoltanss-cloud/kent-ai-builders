(function(){
  function ready(fn){ if (document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

  // Parse values from the Review box (as rendered text)
  function parseReview(){
    const box = Array.from(document.querySelectorAll('div,section,article')).find(el=>{
      const t=(el.textContent||'').toLowerCase();
      return t.includes('service:') && t.includes('postcode:') && t.includes('timing:');
    });
    if(!box) return null;
    const txt = box.innerText || '';
    const get = (label)=>{
      const m = txt.match(new RegExp(label+':\\s*([^\\n]+)','i'));
      return m ? m[1].trim() : '';
    };
    const service  = get('Service');
    const postcode = get('Postcode');
    const timing   = get('Timing');

    // Collect "Details:" bullet lines into a key/value object
    const details = {};
    const parts = txt.split(/Details:\s*/i);
    if(parts[1]){
      parts[1].split(/\n|•/).forEach(line=>{
        const m=line.match(/\s*([A-Za-z0-9 _-]+)\s*:\s*(.+)\s*$/);
        if(m){
          const k = m[1].trim().replace(/\s+/g,'');
          details[k]=m[2].trim();
        }
      });
    }

    // Normalize urgency (best-effort)
    let urgency = 'planning';
    const low = timing.toLowerCase();
    if (low.includes('asap')) urgency='asap';
    else if (low.includes('1-3')) urgency='1-3_months';
    else if (low.includes('3-6')) urgency='3-6_months';
    else if (low.includes('just')) urgency='planning';

    return { service, postcode, urgency, details };
  }

  ready(function(){
    // Find the primary CTA button by its current text
    const btn = Array.from(document.querySelectorAll('button, [role="button"]'))
      .find(el => /submit\s*&\s*get\s*estimate/i.test(el.textContent||''));
    if(!btn) return;

    let previewShown = false;

    btn.addEventListener('click', async function onClick(e){
      if (previewShown) return; // second click = allow normal flow

      e.preventDefault();
      e.stopPropagation();

      const payload = parseReview();
      if (!payload || !payload.service) {
        // fall back to normal flow if we couldn't parse
        previewShown = true;
        btn.click();
        return;
      }

      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Getting estimate...';

      try{
        const res = await fetch('/api/aiQuote', {
          method:'POST',
          headers:{'content-type':'application/json'},
          body: JSON.stringify(payload)
        });
        const data = await res.json().catch(()=>({}));
        const low  = data?.low ?? data?.estimateLow ?? null;
        const high = data?.high ?? data?.estimateHigh ?? null;
        const ref  = data?.ref  ?? data?.reference   ?? '';

        // Insert a small green card right under the review box
        const box = Array.from(document.querySelectorAll('div,section,article')).find(el=>{
          const t=(el.textContent||'').toLowerCase();
          return t.includes('service:') && t.includes('postcode:') && t.includes('timing:');
        });
        const mount = box || btn.closest('div') || document.body;

        const card = document.createElement('div');
        card.className = 'rounded-lg border border-emerald-300 bg-emerald-50/60 p-4 my-4';
        const fmt = (n)=> (typeof n==='number' ? '£'+n.toLocaleString() : '—');
        card.innerHTML = `
          <div class="font-semibold text-emerald-700">Your instant estimate</div>
          <div class="text-2xl font-bold text-emerald-800 mt-1">${fmt(low)} – ${fmt(high)}</div>
          <div class="text-sm text-emerald-700 mt-1">Based on your selections. We’ll confirm by email.</div>
          <div class="text-xs text-slate-500 mt-2">${ref ? 'Ref: '+ref : ''}</div>
        `;
        mount.parentNode.insertBefore(card, mount.nextSibling);

        previewShown = true;
        btn.textContent = 'Looks good — submit';
      }catch(err){
        console.error('Estimate preview failed', err);
        // fail open – allow submission
        previewShown = true;
        btn.textContent = original;
        btn.click();
      }finally{
        btn.disabled = false;
      }
    }, true);
  });
})();
