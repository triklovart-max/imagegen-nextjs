export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');
  const { prompt = 'demo', n = 4, width = 1080, height = 1920 } = req.body || {};
  const count = Math.max(1, Math.min(8, parseInt(n)));
  const images = Array.from({ length: count }, (_, i) =>
    `https://picsum.photos/seed/${encodeURIComponent(prompt)}-${i}/${width}/${height}`
  );
  res.json({ images });
}
