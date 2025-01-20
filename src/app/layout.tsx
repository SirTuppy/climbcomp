// src/app/layout.tsx
import { AuthProvider } from '../components/providers/AuthProvider'
import { ToastProvider } from '../components/providers/ToastProvider'
import { QueryProvider } from '../components/providers/QueryProvider'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <QueryProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}