'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState('9:16');
  const [n, setN] = useState(4);
  const [loading, setLoading] = useState(false);
  const [imgs, setImgs] = useState([]);

  const ratioMap = {
    '1:1': { w: 1024, h: 1024 },
    '9:16': { w: 1080, h: 1920 },   // TikTok
    '20:9': { w: 1600, h: 720 },    // Full layar HP modern
  };

  async function onGen() {
    const { w, h } = ratioMap[ratio] ?? ratioMap['9:16'];
    setLoading(true);
    try {
      const r = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, n, width: w, height: h })
      });
      const data = await r.json();
      setImgs(data.images || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f6f7fb',padding:'16px'}}>
      <div style={{width:'100%',maxWidth:900,background:'#fff',border:'1px solid #eee',borderRadius:16,padding:16,boxShadow:'0 4px 20px rgba(0,0,0,.04)'}}>
        {/* ====== JUDUL DI TAMPILAN AWAL (ADA NAMA KAMU) ====== */}
        <h1 style={{fontSize:22,fontWeight:800,margin:0}}>Genered Image Karya Prasetyo</h1>
        <p style={{color:'#666',margin:'6px 0 16px'}}>Buat gambar AI dari kata-kata. Pilih rasio 9:16 (TikTok) atau 20:9 (full layar HP).</p>

        <label style={{fontWeight:600,fontSize:14}}>Prompt</label>
        <textarea
          value={prompt}
          onChange={e=>setPrompt(e.target.value)}
          placeholder="Contoh: produk skincare di meja marmer, lighting soft, gaya editorial"
          style={{width:'100%',minHeight:90,marginTop:8,border:'1px solid #ddd',borderRadius:12,padding:10}}
        />

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:12}}>
          <div>
            <label style={{fontWeight:600,fontSize:14}}>Rasio</label>
            <select value={ratio} onChange={e=>setRatio(e.target.value)} style={{width:'100%',marginTop:8,border:'1px solid #ddd',borderRadius:12,padding:10}}>
              {Object.keys(ratioMap).map(k=>(
                <option key={k} value={k}>{k} ({ratioMap[k].w}×{ratioMap[k].h})</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{fontWeight:600,fontSize:14}}>Jumlah (4 rekomendasi)</label>
            <input type="number" min={1} max={8} value={n} onChange={e=>setN(parseInt(e.target.value||'1'))}
              style={{width:'100%',marginTop:8,border:'1px solid #ddd',borderRadius:12,padding:10}} />
          </div>
        </div>

        <button onClick={onGen} disabled={loading || !prompt.trim()}
          style={{marginTop:14,width:'100%',border:0,borderRadius:14,padding:'12px 14px',background:'#111',color:'#fff',opacity:loading||!prompt.trim()?0.6:1}}>
          {loading ? 'Menghasilkan…' : 'Generate'}
        </button>

        <div style={{marginTop:16}}>
          <h3 style={{margin:'0 0 8px'}}>Hasil</h3>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {imgs.map((src,i)=>(
              <div key={i} style={{overflow:'hidden',borderRadius:12,border:'1px solid #eee',background:'#fff'}}>
                <img src={src} alt={'hasil-'+i} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
    }
