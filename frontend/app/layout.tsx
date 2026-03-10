export const metadata = {
  title: "Student Research AI Platform",
  description: "Analyze student research using AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "Arial, sans-serif", margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
