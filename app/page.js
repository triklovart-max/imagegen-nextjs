'use client';

import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [followers, setFollowers] = useState('');
  const [totalLikes, setTotalLikes] = useState('');
  const [videos, setVideos] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  async function calc() {
    setLoading(true);
    try {
      const r = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          followers: followers ? Number(followers) : undefined,
          totalLikes: totalLikes ? Number(totalLikes) : undefined,
          videos: videos ? Number(videos) : undefined,
        }),
      });
      const j = await r.json();
      setData(j);
    } catch (e) {
      alert('Gagal menghitung. Coba lagi.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const Card = ({ children }) => (
    <div style={{
      background:'#fff', border:'1px solid #e5e7eb', borderRadius:14,
      padding:16, boxShadow:'0 6px 20px rgba(0,0,0,.05)'
    }}>{children}</div>
  );

  return (
    <main style={{minHeight:'100vh',background:'#f7f8fb'}}>
      <header style={{padding:'18px 16px',textAlign:'center',background:'#111827',color:'#e5e7eb'}}>
        <h1 style={{margin:0,fontSize:20,fontWeight:800}}>Tik Earning Calculator</h1>
        <div style={{opacity:.8,fontSize:13,marginTop:6}}>
          Cek estimasi komisi/earning per video + statistik dasar
        </div>
      </header>

      <section style={{maxWidth:920, margin:'16px auto', padding:'0 12px', display:'grid', gap:12}}>
        <Card>
          <div style={{display:'grid',gap:10}}>
            <label style={{fontWeight:700}}>TikTok Username</label>
            <input
              value={username}
              onChange={e=>setUsername(e.target.value)}
              placeholder="@username"
              style={{border:'1px solid #e5e7eb',borderRadius:12,padding:'12px 14px'}}
            />

            <div style={{fontSize:12,opacity:.8,marginTop:4}}>
              (Opsional, biar hasil makin akurat)
            </div>

            <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:10}}>
              <input placeholder="Followers"
                     inputMode="numeric"
                     value={followers}
                     onChange={e=>setFollowers(e.target.value)}
                     style={{border:'1px solid #e5e7eb',borderRadius:12,padding:'12px 14px'}} />
              <input placeholder="Total Likes"
                     inputMode="numeric"
                     value={totalLikes}
                     onChange={e=>setTotalLikes(e.target.value)}
                     style={{border:'1px solid #e5e7eb',borderRadius:12,padding:'12px 14px'}} />
              <input placeholder="Total Videos"
                     inputMode="numeric"
                     value={videos}
                     onChange={e=>setVideos(e.target.value)}
                     style={{border:'1px solid #e5e7eb',borderRadius:12,padding:'12px 14px'}} />
            </div>

            <button onClick={calc} disabled={loading || !username.trim()}
              style={{
                marginTop:6, height:48, border:0, borderRadius:12,
                background:'#2563eb', color:'#fff', fontWeight:800,
                opacity: (loading||!username.trim()) ? .6 : 1
              }}>
              {loading ? 'Menghitung…' : 'Calculate Earnings'}
            </button>
          </div>
        </Card>

        {data && (
          <div style={{display:'grid',gap:12}}>
            <Card>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:13,letterSpacing:.6,opacity:.7,marginBottom:6}}>
                  Estimated Earning per video
                </div>
                <div style={{fontSize:40,fontWeight:800}}>
                  ${data.earningMid}
                </div>
                <div style={{fontSize:12,opacity:.6}}>
                  range ${data.earningLow} – ${data.earningHigh}
                </div>
              </div>
            </Card>

            <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:12}}>
              <Card>
                <div style={{fontSize:13,opacity:.7,marginBottom:6}}>Followers</div>
                <div style={{fontSize:28,fontWeight:800}}>{data.followersDisplay}</div>
              </Card>
              <Card>
                <div style={{fontSize:13,opacity:.7,marginBottom:6}}>Total Likes</div>
                <div style={{fontSize:28,fontWeight:800}}>{data.totalLikesDisplay}</div>
              </Card>
              <Card>
                <div style={{fontSize:13,opacity:.7,marginBottom:6}}>Videos</div>
                <div style={{fontSize:28,fontWeight:800}}>{data.videosDisplay}</div>
              </Card>
            </div>

            <Card>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:12}}>
                <div>
                  <div style={{fontSize:12,opacity:.7,marginBottom:4}}>Avg Likes / Video</div>
                  <div style={{fontWeight:800}}>{data.avgLikesDisplay}</div>
                </div>
                <div>
                  <div style={{fontSize:12,opacity:.7,marginBottom:4}}>Engagement Rate (estimasi)</div>
                  <div style={{fontWeight:800}}>{data.engagementPct}%</div>
                </div>
                <div>
                  <div style={{fontSize:12,opacity:.7,marginBottom:4}}>Views / Video (estimasi)</div>
                  <div style={{fontWeight:800}}>{data.estViewsDisplay}</div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </section>

      <footer style={{textAlign:'center',padding:'18px 0',color:'#64748b',fontSize:12}}>
        © {new Date().getFullYear()} Prasetyo – Estimator (demo)
      </footer>
    </main>
  );
                  }
