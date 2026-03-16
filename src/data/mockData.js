// ============================================================
// AccidentWatch — Mock Data Generator
// Generates 200+ realistic accident records across 90 days
// ============================================================

const LOCATIONS = [
  { name: 'Andheri', lat: 19.1197, lng: 72.8464 },
  { name: 'Bandra', lat: 19.0596, lng: 72.8295 },
  { name: 'Dadar', lat: 19.0178, lng: 72.8478 },
  { name: 'Borivali', lat: 19.2307, lng: 72.8567 },
  { name: 'Malad', lat: 19.1862, lng: 72.8489 },
  { name: 'Goregaon', lat: 19.1663, lng: 72.8494 },
  { name: 'Kurla', lat: 19.0726, lng: 72.8794 },
  { name: 'Ghatkopar', lat: 19.0860, lng: 72.9080 },
  { name: 'Powai', lat: 19.1176, lng: 72.9060 },
  { name: 'Worli', lat: 19.0176, lng: 72.8152 },
  { name: 'Lower Parel', lat: 18.9930, lng: 72.8300 },
  { name: 'Chembur', lat: 19.0622, lng: 72.8978 },
  { name: 'Mulund', lat: 19.1726, lng: 72.9569 },
  { name: 'Thane', lat: 19.2183, lng: 72.9781 },
  { name: 'Vikhroli', lat: 19.1100, lng: 72.9300 },
  { name: 'Santacruz', lat: 19.0844, lng: 72.8412 },
  { name: 'Juhu', lat: 19.0989, lng: 72.8265 },
  { name: 'Colaba', lat: 18.9067, lng: 72.8147 },
];

const VERIFIERS = [
  'Rajesh Patil',
  'Sneha Kulkarni',
  'Amit Deshmukh',
  'Priya Sharma',
  'Vikram Joshi',
  'Neha Tiwari',
];

const SEVERITIES = ['High', 'Medium', 'Low'];
const STATUSES = ['Resolved', 'Active', 'False Alarm'];
const CAUSES = [
  'Rear collision',
  'Side impact',
  'Pedestrian',
  'Vehicle rollover',
  'Unknown',
];
const SERVICES = ['Hospital', 'Police', 'Fire'];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateAccidents(count = 220) {
  const now = new Date();
  const records = [];

  for (let i = 1; i <= count; i++) {
    const daysAgo = randomInt(0, 89);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(randomInt(0, 23), randomInt(0, 59), randomInt(0, 59));

    const location = randomChoice(LOCATIONS);
    const severity = randomChoice(SEVERITIES);
    const status = randomChoice(STATUSES);
    const cause = randomChoice(CAUSES);

    // Determine services notified based on status
    let servicesNotified;
    if (status === 'False Alarm') {
      servicesNotified = [];
    } else {
      const serviceCount = severity === 'High' ? 3 : severity === 'Medium' ? randomInt(1, 3) : randomInt(1, 2);
      const shuffled = [...SERVICES].sort(() => Math.random() - 0.5);
      servicesNotified = shuffled.slice(0, serviceCount);
    }

    records.push({
      id: `ACC-${String(i).padStart(4, '0')}`,
      dateTime: date.toISOString(),
      location: location.name,
      lat: location.lat + (Math.random() - 0.5) * 0.01,
      lng: location.lng + (Math.random() - 0.5) * 0.01,
      severity,
      verifiedBy: status === 'False Alarm' ? randomChoice(VERIFIERS) : randomChoice(VERIFIERS),
      servicesNotified,
      responseTime: status === 'False Alarm' ? 0 : randomInt(45, 300),
      status,
      cause,
    });
  }

  // Sort by date descending
  records.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
  return records;
}

export const accidents = generateAccidents(220);

// ============================================================
// Helper functions for chart aggregations
// ============================================================

export function getAccidentsPerDay(days = 30) {
  const now = new Date();
  const labels = [];
  const counts = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    labels.push(d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }));
    counts.push(
      accidents.filter((a) => a.dateTime.startsWith(key)).length
    );
  }

  return { labels, data: counts };
}

export function getServiceDistribution() {
  const dist = { Hospital: 0, Police: 0, Fire: 0 };
  accidents.forEach((a) => {
    a.servicesNotified.forEach((s) => {
      dist[s]++;
    });
  });
  return dist;
}

export function getRecentAlerts(count = 5) {
  return accidents.slice(0, count);
}

export function getTodayStats() {
  const today = new Date().toISOString().split('T')[0];
  const todayAccidents = accidents.filter((a) => a.dateTime.startsWith(today));
  const activeEmergencies = accidents.filter((a) => a.status === 'Active').length;
  const validResponses = accidents.filter((a) => a.responseTime > 0);
  const avgResponseTime =
    validResponses.length > 0
      ? Math.round(validResponses.reduce((s, a) => s + a.responseTime, 0) / validResponses.length)
      : 0;
  const falseAlarms = accidents.filter((a) => a.status === 'False Alarm').length;
  const falseAlarmRate = ((falseAlarms / accidents.length) * 100).toFixed(1);

  return {
    totalToday: todayAccidents.length,
    activeEmergencies,
    avgResponseTime,
    falseAlarmRate,
  };
}

export function getAccidentsByDayOfWeek() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const counts = new Array(7).fill(0);
  accidents.forEach((a) => {
    const day = new Date(a.dateTime).getDay();
    counts[day]++;
  });
  // Reorder to Mon-Sun
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = [counts[1], counts[2], counts[3], counts[4], counts[5], counts[6], counts[0]];
  return { labels, data };
}

export function getAvgResponseTimeByWeek(weeks = 12) {
  const now = new Date();
  const labels = [];
  const data = [];

  for (let i = weeks - 1; i >= 0; i--) {
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() - i * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);

    const weekAccidents = accidents.filter((a) => {
      const d = new Date(a.dateTime);
      return d >= weekStart && d <= weekEnd && a.responseTime > 0;
    });

    const avg =
      weekAccidents.length > 0
        ? Math.round(weekAccidents.reduce((s, a) => s + a.responseTime, 0) / weekAccidents.length)
        : 0;

    labels.push(`W${weeks - i}`);
    data.push(avg);
  }

  return { labels, data };
}

export function getCausesBreakdown() {
  const dist = {};
  CAUSES.forEach((c) => (dist[c] = 0));
  accidents.forEach((a) => {
    dist[a.cause]++;
  });
  return dist;
}

export function getTopAccidentZones(count = 5) {
  const zoneCounts = {};
  accidents.forEach((a) => {
    zoneCounts[a.location] = (zoneCounts[a.location] || 0) + 1;
  });
  return Object.entries(zoneCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([zone, cnt]) => ({ zone, count: cnt }));
}

export function getMonthlySeverity(months = 6) {
  const now = new Date();
  const labels = [];
  const high = [];
  const medium = [];
  const low = [];

  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    labels.push(d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }));

    const monthAccidents = accidents.filter((a) => a.dateTime.startsWith(monthKey));
    high.push(monthAccidents.filter((a) => a.severity === 'High').length);
    medium.push(monthAccidents.filter((a) => a.severity === 'Medium').length);
    low.push(monthAccidents.filter((a) => a.severity === 'Low').length);
  }

  return { labels, high, medium, low };
}

export function getServiceAvgResponseTime() {
  const serviceData = {
    Ambulance: { total: 0, count: 0 },
    Police: { total: 0, count: 0 },
    'Fire Brigade': { total: 0, count: 0 },
  };

  accidents.forEach((a) => {
    if (a.responseTime > 0) {
      if (a.servicesNotified.includes('Hospital')) {
        serviceData.Ambulance.total += a.responseTime + randomInt(-20, 20);
        serviceData.Ambulance.count++;
      }
      if (a.servicesNotified.includes('Police')) {
        serviceData.Police.total += a.responseTime + randomInt(-15, 30);
        serviceData.Police.count++;
      }
      if (a.servicesNotified.includes('Fire')) {
        serviceData['Fire Brigade'].total += a.responseTime + randomInt(-10, 40);
        serviceData['Fire Brigade'].count++;
      }
    }
  });

  return Object.entries(serviceData).map(([service, d]) => ({
    service,
    avgTime: d.count > 0 ? Math.round(d.total / d.count) : 0,
    trend: Math.random() > 0.5 ? 'faster' : 'slower',
  }));
}

// Heatmap data — dense points around Mumbai for visible yellow→orange→red gradient
export const heatmapPoints = LOCATIONS.flatMap((loc) => {
  const count = randomInt(5, 8);
  const points = [];
  for (let i = 0; i < count; i++) {
    points.push({
      lat: loc.lat + (Math.random() - 0.5) * 0.005,
      lng: loc.lng + (Math.random() - 0.5) * 0.005,
      weight: randomInt(8, 30),
    });
  }
  return points;
});

export function getTopRiskZones(count = 10) {
  const zoneCounts = {};
  accidents.forEach((a) => {
    zoneCounts[a.location] = (zoneCounts[a.location] || 0) + 1;
  });
  return Object.entries(zoneCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([zone, cnt]) => ({
      zone,
      count: cnt,
      risk: cnt > 18 ? 'Critical' : cnt > 12 ? 'High' : 'Medium',
    }));
}
