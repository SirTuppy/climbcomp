import { Navbar } from '../components/shared/Navbar';
import { AuthProvider } from '../components/providers/AuthProvider';
import { ToastProvider } from '../components/providers/ToastProvider';

import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>
            {children}
          </main>
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}