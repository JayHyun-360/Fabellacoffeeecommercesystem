import type { Metadata } from 'next';
import '../styles/index.css';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';

export const metadata: Metadata = {
  title: 'Fabella Coffee E-commerce Design',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
