export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { count = 9, ratioKey = 'Story (9:16)', theme = 'Minimalist', manualBg = '', hasImage = false, fileName = '' } = req.body || {};

  const RATIOS = {
    'Story (9:16)': { w: 1080, h: 1920 },
    'Lanskap (16:9)': { w: 1600, h: 900 },
    'Persegi (1:1)': { w: 1024, h: 1024 },
  };
  const { w, h } = RATIOS[ratioKey] || RATIOS['Story (9:16)'];

  // DEMO: kita pakai Picsum sebagai placeholder. Seed pakai tema+manual+fileName biar beda-beda.
  const seedBase = `${theme}-${manualBg}-${fileName || 'nofile'}`;
  const images = Array.from({ length: Math.max(1, Math.min(12, parseInt(count))) }, (_, i) =>
    `https://picsum.photos/seed/${encodeURIComponent(seedBase + '-' + i)}/${w}/${h}`
  );

  res.json({ images, note: hasImage ? 'image-uploaded-demo' : 'no-image' });
}
