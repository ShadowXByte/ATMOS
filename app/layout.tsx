import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ATMOS - Weather App',
  description: 'A modern weather application with real-time weather data and forecasts',
  keywords: ['weather', 'forecast', 'temperature', 'climate'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
