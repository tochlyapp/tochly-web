import 'styles/themes.scss';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body data-bs-theme="light">
        {children}
      </body>
    </html>
  );
}
