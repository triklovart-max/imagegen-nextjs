export const metadata = {
  title: "Genered Image Karya Prasetyo",
  description: "AI Image Generator buatan Prasetyo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, fontFamily: "sans-serif", background: "#f5f5f5" }}>
        {children}
      </body>
    </html>
  );
}
