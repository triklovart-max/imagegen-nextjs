function compact(n) {
  if (n >= 1_000_000) return (n/1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n/1_000).toFixed(1) + 'K';
  return String(Math.round(n));
}

// Bikin angka dummy konsisten dari username (kalau user tak isi angka)
function seeded(username) {
  let h = 0;
  for (let i=0;i<username.length;i++) h = (h*31 + username.charCodeAt(i)) >>> 0;
  const rand = (min,max) => Math.floor(min + (h % (max-min+1)));
  const followers = rand(5_000, 200_000);
  const likes = rand(20_000, 2_000_000);
  const videos = Math.max(10, Math.floor(likes / rand(50, 400)));
  return { followers, likes, videos };
}

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message:'Method not allowed' });

  const { username = '', followers, totalLikes, videos } = req.body || {};
  const seed = seeded(username || 'user');

  const F = Number.isFinite(followers) ? followers : seed.followers;
  const L = Number.isFinite(totalLikes) ? totalLikes : seed.likes;
  const V = Number.isFinite(videos) ? Math.max(1, videos) : seed.videos;

  const avgLikes = L / V;
  // asumsi: like rate ~10% dari views => views ≈ likes / 0.10
  const estViews = Math.max(500, Math.round(avgLikes / 0.10));
  // asumsi RPM (pendapatan per 1000 views) $1.5–$4.0
  const low = (estViews/1000) * 1.5;
  const high = (estViews/1000) * 4.0;
  const mid = (low + high) / 2;

  const engagement = F > 0 ? (avgLikes / F) * 100 : 0;

  res.json({
    earningLow: low.toFixed(2),
    earningHigh: high.toFixed(2),
    earningMid: mid.toFixed(2),

    followers: F, totalLikes: L, videos: V,
    followersDisplay: compact(F),
    totalLikesDisplay: compact(L),
    videosDisplay: compact(V),

    avgLikes: Math.round(avgLikes),
    avgLikesDisplay: compact(Math.round(avgLikes)),
    engagementPct: engagement.toFixed(2),
    estViews: estViews,
    estViewsDisplay: compact(estViews),
    note: 'Estimasi demo. Bukan angka resmi TikTok.'
  });
}
