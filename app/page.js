'use client';

import { useMemo, useState } from 'react';

const THEMES = [
  'Minimalist','Nature','Café','Modern',
  'Artsy','Cars','Islamic','European',
  'Fantasy','East Asian','Luxury','60s Sci-Fi',
  'Manual'
];

const RATIOS = {
  'Story (9:16)': { w: 1080, h: 1920 },
  'Lanskap (16:9)': { w: 1600, h: 900 },
  'Persegi (1:1)': { w: 1024, h: 1024 },
};

export default function Home() {
  const [file, setFile] = useState(null);
  const [theme, setTheme] = useState('Minimalist');
  const [manualBg, setManualBg] = useState('');
  const [ratioKey, setRatioKey] = useState('Story (9:16)');
  const [imgs, setImgs] = useState([]);
  const [loading, setLoading] = useState(false);

  const filePreview = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file]
  );

  async function onGenerate() {
    setLoading(true);
    try {
      const payload = {
        count: 9,
        ratioKey,
        theme,
        manualBg: manualBg.trim(),
        // NOTE: demo: kita tidak upload file beneran — cukup kirim nama file saja
        // (kalau nanti mau real editing, baru kita kirim base64/URL ke API model).
        hasImage: !!file,
        fileName: file?.name || null,
      };
      const r = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await r.json();
      setImgs(data.images || []);
    } catch (e) {
      console.error(e);
      alert('Gagal membuat gambar. Coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{minHeight:'100vh',background:'#0b0f1a',padding:'16px'}}>
      <div style={{maxWidth:980,margin:'0 auto',background:'#111827',border:'1px solid #222',borderRadius:16}}>
        {/* Header */}
        <div style={{padding:'18px 16px',borderBottom:'1px solid #222',borderTopLeftRadius:16,borderTopRightRadius:16}}>
          <h1 style={{margin:0,color:'#c4b5fd',fontWeight:800,fontSize:22,textAlign:'center'}}>
            AI Web Karya Prasetyo — Untuk Bahan Affiliate
          </h1>
          <p style={{margin:'6px 0 0',color:'#94a3b8',textAlign:'center',fontSize:13}}>
            Mentahan foto produk affiliate
          </p>
        </div>

        {/* Body */}
        <div style={{padding:16,display:'grid',gap:16}}>
          {/* 1. Unggah Foto */}
          <section style={{background:'#0f1624',border:'1px solid #1f2937',borderRadius:12,padding:16}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
              <span style={{width:28,height:28,borderRadius:999,background:'#7c3aed',color:'#fff',display:'grid',placeItems:'center',fontWeight:700}}>1</span>
              <h3 style={{margin:0,color:'#e5e7eb'}}>Unggah Foto Model</h3>
            </div>

            <label style={{display:'block',border:'1px dashed #334155',borderRadius:12,padding:16,background:'#0b1220',color:'#94a3b8',textAlign:'center',cursor:'pointer'}}>
              {filePreview ? (
                <img src={filePreview} alt="preview" style={{maxWidth:'100%',borderRadius:8}}/>
              ) : (
                <>
                  <div style={{fontSize:14}}>Klik untuk pilih gambar (PNG/JPG/WEBP ≤5MB)</div>
                </>
              )}
              <input type="file" accept="image/*" style={{display:'none'}}
                onChange={e=>setFile(e.target.files?.[0] || null)} />
            </label>
          </section>

          {/* 2. Tema / Manual */}
          <section style={{background:'#0f1624',border:'1px solid #1f2937',borderRadius:12,padding:16}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
              <span style={{width:28,height:28,borderRadius:999,background:'#7c3aed',color:'#fff',display:'grid',placeItems:'center',fontWeight:700}}>2</span>
              <h3 style={{margin:0,color:'#e5e7eb'}}>Pilih Tema Latar Belakang</h3>
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(4, minmax(0,1fr))',gap:8}}>
              {THEMES.map(t=>(
                <button key={t} onClick={()=>setTheme(t)}
                  style={{
                    padding:'10px 12px',borderRadius:10,border:'1px solid',
                    borderColor: theme===t ? '#7c3aed' : '#1f2937',
                    background: theme===t ? '#1f1330' : '#0b1220',
                    color:'#e5e7eb',fontSize:13
                  }}>
                  {t}
                </button>
              ))}
            </div>

            {theme==='Manual' && (
              <div style={{marginTop:12}}>
                <label style={{color:'#cbd5e1',fontSize:13,fontWeight:600}}>Prompt Latar Belakang Manual</label>
                <textarea
                  value={manualBg}
                  onChange={e=>setManualBg(e.target.value)}
                  placeholder="Contoh: sebuah pantai tropis saat matahari terbenam dengan pasir putih dan pohon kelapa"
                  style={{width:'100%',minHeight:90,marginTop:6,border:'1px solid #334155',borderRadius:12,padding:10,background:'#0b1220',color:'#e5e7eb'}}
                />
              </div>
            )}
          </section>

          {/* 3. Rasio */}
          <section style={{background:'#0f1624',border:'1px solid #1f2937',borderRadius:12,padding:16}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
              <span style={{width:28,height:28,borderRadius:999,background:'#7c3aed',color:'#fff',display:'grid',placeItems:'center',fontWeight:700}}>3</span>
              <h3 style={{margin:0,color:'#e5e7eb'}}>Pilih Aspek Rasio</h3>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3, minmax(0,1fr))',gap:8}}>
              {Object.keys(RATIOS).map(k=>(
                <button key={k} onClick={()=>setRatioKey(k)}
                  style={{
                    padding:'12px',borderRadius:10,border:'1px solid',
                    borderColor: ratioKey===k ? '#7c3aed' : '#1f2937',
                    background: ratioKey===k ? '#1f1330' : '#0b1220',
                    color:'#e5e7eb',fontSize:13
                  }}>
                  {k}
                </button>
              ))}
            </div>
          </section>

          {/* 4. Generate */}
          <section style={{background:'#0f1624',border:'1px solid #1f2937',borderRadius:12,padding:16}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
              <span style={{width:28,height:28,borderRadius:999,background:'#7c3aed',color:'#fff',display:'grid',placeItems:'center',fontWeight:700}}>4</span>
              <h3 style={{margin:0,color:'#e5e7eb'}}>Hasilkan Gambar</h3>
            </div>

            <button onClick={onGenerate} disabled={loading}
              style={{width:'100%',padding:'14px 16px',borderRadius:12,border:0,
                      background:'#7c3aed',color:'#fff',fontWeight:700,opacity:loading?0.7:1}}>
              {loading ? 'Memproses…' : 'Buat 9 Pose & Angle Acak'}
            </button>

            <div style={{marginTop:14}}>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3, minmax(0,1fr))',gap:10}}>
                {imgs.map((src,i)=>(
                  <div key={i} style={{border:'1px solid #1f2937',borderRadius:10,overflow:'hidden',background:'#0b1220'}}>
                    <img src={src} alt={'img-'+i} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
                                       }
