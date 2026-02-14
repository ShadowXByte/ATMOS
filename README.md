# ATMOS Weather App

A modern, responsive weather web application built with Next.js and deployed on Vercel. Get real-time weather information and 5-day forecasts for any city worldwide.

![ATMOS Weather App](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

## Features

- 🌤️ **Current Weather**: Get real-time weather data for any city
- 📅 **5-Day Forecast**: View weather predictions for the next 5 days
- 📍 **Geolocation**: Automatically detect and display weather for your current location
- 🎨 **Modern UI**: Beautiful, responsive design with glassmorphism effects
- ⚡ **Fast Performance**: Built with Next.js for optimal speed
- 🌍 **Global Coverage**: Search weather for any city worldwide

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: Open-Meteo (Free, No API Key Required)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/ShadowXByte/ATMOS.git
cd ATMOS
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

**Note**: No API key required! The app uses the free Open-Meteo API.

## Deployment on Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
\`\`\`bash
npm install -g vercel
\`\`\`

2. Login to Vercel:
\`\`\`bash
vercel login
\`\`\`

3. Deploy:
\`\`\`bash
vercel
\`\`\`

4. Deploy to production:
\`\`\`bash
vercel --prod
\`\`\`

## Project Structure

\`\`\`
ATMOS/
├── app/
│   ├── api/
│   │   ├── weather/
│   │   │   └── route.ts      # Weather API endpoint
│   │   └── forecast/
│   │       └── route.ts      # Forecast API endpoint
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page component
├── public/                   # Static assets
├── .env.example              # Example environment variables
├── .gitignore
├── next.config.js            # Next.js configuration
├── package.json
├── postcss.config.js         # PostCSS configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── vercel.json               # Vercel deployment config
\`\`\`

## Features in Detail

### Current Weather Display
- Temperature (Celsius)
- Feels like temperature
- Weather description with icon
- Humidity percentage
- Wind speed
- Atmospheric pressure
- Sunrise and sunset times

### 5-Day Forecast
- Daily high and low temperatures
- Weather conditions for each day
- Visual weather icons
- Easy-to-read cards layout

### Search Functionality
- Search by city name
- Use current location via geolocation
- Real-time error handling
- Loading states

## API Endpoints

### GET /api/weather
Fetch current weather data

**Query Parameters:**
- \`city\` (string): City name
- \`lat\` (number): Latitude (alternative to city)
- \`lon\` (number): Longitude (alternative to city)

### GET /api/forecast
Fetch 5-day weather forecast

**Query Parameters:**
- \`city\` (string): City name
- \`lat\` (number): Latitude (alternative to city)
- \`lon\` (number): Longitude (alternative to city)

## Environment Variables

**No environment variables required!** The app uses the free Open-Meteo API which doesn't require authentication.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Weather data provided by [Open-Meteo](https://open-meteo.com/) (Free Weather API)
- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Deployed on [Vercel](https://vercel.com/)

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/ShadowXByte/ATMOS/issues).

---

Made with ❤️ by [ShadowXByte](https://github.com/ShadowXByte)
