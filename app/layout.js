import { UserProvider } from '@/context/UserContext';
import './globals.css';

export const metadata = {
  title: 'PawConnect - Pet Community Social Network',
  description: 'A vibrant social network for pet owners to connect, share, adopt, and support each other',
  keywords: 'pets, pet adoption, pet community, pet owners, pet social network',
  authors: [{ name: 'PawConnect Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#7B2CBF" />
      </head>
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
