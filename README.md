# AccidentWatch Admin Dashboard

> Camera-Based AI Accident Detection & Emergency Notification System — Admin Panel

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will open at `http://localhost:5173`.

## 🗺️ Google Maps Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable:
   - **Maps JavaScript API**
   - **Visualization Library** (for HeatmapLayer)
3. Generate an API key
4. Open `src/pages/Heatmap.jsx` and replace:
   ```
   YOUR_GOOGLE_MAPS_API_KEY
   ```
   with your actual API key.

> **Note:** The dashboard works fully without a Maps key — only the Heatmap page requires it.

## 📁 Project Structure

```
/src
  /components
    /layout    — Sidebar, Navbar
    /charts    — LineChart, BarChart, DoughnutChart, PieChart, GaugeChart
    /ui        — KPICard, Badge, Table
  /pages       — Overview, AccidentLog, Analytics, Heatmap, ResponseTracker
  /data        — mockData.js (200+ realistic records)
  App.jsx
  main.jsx
```

## 🛠️ Tech Stack

- React 18 + Vite
- Chart.js via react-chartjs-2
- Google Maps via @react-google-maps/api
- Tailwind CSS
- Lucide React Icons
- React Router v7

## 📊 Features

- **Overview**: KPI cards, accident trends, service distribution, recent alerts
- **Accident Log**: Searchable/filterable table, pagination, CSV export
- **Analytics**: 5 interactive charts from mock data
- **Heatmap**: Google Maps heat layer + risk zone sidebar
- **Response Tracker**: Real-time charts, service metrics, system gauge
