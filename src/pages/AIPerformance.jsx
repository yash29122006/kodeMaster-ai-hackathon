import React, { useState, useEffect } from 'react';
import { Brain, Zap, Target, TrendingUp, Activity, Clock, CheckCircle, AlertTriangle, XCircle, Cpu } from 'lucide-react';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';

// Mock AI performance data
const models = [
  { name: 'YOLOv8', type: 'Object Detection', accuracy: 97.2, precision: 96.8, recall: 95.4, f1: 96.1, latency: 42, status: 'Active', version: 'v8.1.2', lastTrained: '12 Mar 2026' },
  { name: 'ResNet-50', type: 'Classification', accuracy: 98.6, precision: 98.1, recall: 97.9, f1: 98.0, latency: 28, status: 'Active', version: 'v3.4.0', lastTrained: '10 Mar 2026' },
  { name: 'EfficientDet', type: 'Severity Estimation', accuracy: 94.3, precision: 93.7, recall: 92.1, f1: 92.9, latency: 55, status: 'Standby', version: 'v2.0.1', lastTrained: '05 Mar 2026' },
];

const confusionMatrix = {
  labels: ['True Accident', 'False Alarm', 'Near Miss'],
  data: [
    [1842, 23, 45],
    [18, 2156, 31],
    [52, 38, 1295],
  ],
};

function getAccuracyTrend() {
  const labels = [];
  const yolo = [], resnet = [], effdet = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }));
    yolo.push(+(95 + Math.random() * 3).toFixed(1));
    resnet.push(+(96 + Math.random() * 3).toFixed(1));
    effdet.push(+(92 + Math.random() * 3).toFixed(1));
  }
  return { labels, yolo, resnet, effdet };
}

function getInferenceDistribution() {
  return {
    labels: ['0-20ms', '20-40ms', '40-60ms', '60-80ms', '80-100ms', '100ms+'],
    data: [245, 1820, 1450, 380, 85, 20],
  };
}

export default function AIPerformance() {
  const accuracyTrend = getAccuracyTrend();
  const inferenceDist = getInferenceDistribution();
  const [liveInference, setLiveInference] = useState(42);
  const [liveAccuracy, setLiveAccuracy] = useState(97.2);
  const [totalPredictions, setTotalPredictions] = useState(45832);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveInference(Math.floor(30 + Math.random() * 35));
      setLiveAccuracy(+(96 + Math.random() * 2.5).toFixed(1));
      setTotalPredictions((p) => p + Math.floor(Math.random() * 5));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const kpis = [
    { icon: Target, label: 'Accuracy', value: `${liveAccuracy}%`, color: 'text-emerald-400 bg-emerald-500/10' },
    { icon: Zap, label: 'Avg Latency', value: `${liveInference}ms`, color: 'text-cyan-400 bg-cyan-500/10' },
    { icon: Activity, label: 'Total Predictions', value: totalPredictions.toLocaleString(), color: 'text-blue-400 bg-blue-500/10' },
    { icon: Brain, label: 'Active Models', value: '2 / 3', color: 'text-purple-400 bg-purple-500/10' },
    { icon: CheckCircle, label: 'Precision', value: '96.8%', color: 'text-amber-400 bg-amber-500/10' },
    { icon: TrendingUp, label: 'F1 Score', value: '96.1', color: 'text-rose-400 bg-rose-500/10' },
  ];

  const getMatrixColor = (val, max) => {
    const ratio = val / max;
    if (ratio > 0.8) return 'bg-emerald-500/70 text-white';
    if (ratio > 0.3) return 'bg-amber-500/40 text-primary';
    return 'bg-red-500/20 text-primary';
  };
  const maxVal = Math.max(...confusionMatrix.data.flat());

  return (
    <div className="space-y-4 animate-fade-in">
      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-dark-card rounded-xl px-4 py-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${kpi.color}`}>
                <kpi.icon size={15} strokeWidth={1.8} />
              </div>
              <span className="text-xs text-muted">{kpi.label}</span>
            </div>
            <p className="text-xl font-bold text-primary">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-dark-card rounded-xl p-5">
          <LineChart
            labels={accuracyTrend.labels}
            datasets={[
              { label: 'YOLOv8', data: accuracyTrend.yolo, color: '#22d3ee' },
              { label: 'ResNet-50', data: accuracyTrend.resnet, color: '#f59e0b' },
              { label: 'EfficientDet', data: accuracyTrend.effdet, color: '#8b5cf6' },
            ]}
            title="Model Accuracy Trend (30 Days)"
            height={280}
          />
        </div>
        <div className="bg-dark-card rounded-xl p-5">
          <BarChart
            labels={inferenceDist.labels}
            datasets={[{ label: 'Count', data: inferenceDist.data, color: '#3b82f6' }]}
            title="Inference Time Distribution"
            height={280}
          />
        </div>
      </div>

      {/* Confusion Matrix + Model Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Detection Accuracy Breakdown */}
        <div className="bg-dark-card rounded-xl p-5">
          <h3 className="text-sm font-medium text-secondary mb-1">Detection Accuracy</h3>
          <p className="text-[11px] text-faint mb-5">How well each category is correctly identified</p>

          {/* Per-category accuracy bars */}
          <div className="space-y-5">
            {[
              { label: 'True Accidents', correct: 1842, total: 1910, icon: '🚨', color: 'from-red-500 to-orange-400' },
              { label: 'False Alarms', correct: 2156, total: 2205, icon: '⚠️', color: 'from-amber-500 to-yellow-400' },
              { label: 'Near Misses', correct: 1295, total: 1385, icon: '🔍', color: 'from-blue-500 to-cyan-400' },
            ].map((cat) => {
              const pct = ((cat.correct / cat.total) * 100).toFixed(1);
              return (
                <div key={cat.label}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{cat.icon}</span>
                      <span className="text-sm font-medium text-primary">{cat.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-muted">{cat.correct.toLocaleString()} / {cat.total.toLocaleString()}</span>
                      <span className="text-sm font-bold text-primary">{pct}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-dark-hover rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${cat.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-4">
            <div className="text-center">
              <p className="text-lg font-bold text-emerald-400">5,293</p>
              <p className="text-[10px] text-muted">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-amber-400">207</p>
              <p className="text-[10px] text-muted">Misclassified</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-primary">96.2%</p>
              <p className="text-[10px] text-muted">Overall</p>
            </div>
          </div>

          {/* AI Insights */}
          <div className="mt-5 pt-4 space-y-3">
            <p className="text-[11px] text-faint uppercase tracking-wider font-semibold">AI Insights</p>
            {[
              { icon: '✅', text: 'False alarm rate dropped 12% this week', color: 'text-emerald-400' },
              { icon: '⚡', text: 'Near-miss detection improved after v2.0.1 retrain', color: 'text-cyan-400' },
              { icon: '🔄', text: 'Next scheduled retraining: 16 Mar 2026', color: 'text-blue-400' },
              { icon: '⚠️', text: 'Night-time accuracy 3.2% lower — data augmentation recommended', color: 'text-amber-400' },
            ].map((insight, i) => (
              <div key={i} className="flex items-start gap-2.5 bg-dark-hover rounded-lg px-3 py-2.5">
                <span className="text-sm flex-shrink-0">{insight.icon}</span>
                <p className="text-xs text-secondary leading-relaxed">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Model Details */}
        <div className="bg-dark-card rounded-xl p-5">
          <h3 className="text-sm font-medium text-secondary mb-4">Model Details</h3>
          <div className="space-y-3">
            {models.map((m) => (
              <div key={m.name} className="bg-dark-hover rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Cpu size={16} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary">{m.name}</p>
                      <p className="text-[11px] text-faint">{m.type} · {m.version}</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    m.status === 'Active' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                  }`}>{m.status}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: 'Accuracy', val: `${m.accuracy}%` },
                    { label: 'Precision', val: `${m.precision}%` },
                    { label: 'Recall', val: `${m.recall}%` },
                    { label: 'Latency', val: `${m.latency}ms` },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-[10px] text-faint uppercase">{s.label}</p>
                      <p className="text-sm font-bold text-primary">{s.val}</p>
                    </div>
                  ))}
                </div>
                {/* Progress bar for F1 score */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-faint">F1 Score</span>
                    <span className="text-[10px] text-muted font-mono">{m.f1}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-dark-card rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${m.f1}%` }} />
                  </div>
                </div>
                <p className="text-[10px] text-faint mt-2">Last trained: {m.lastTrained}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Inference Log */}
      <div className="bg-dark-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-secondary">Recent Inference Log</h3>
          <span className="flex items-center gap-1.5 text-xs text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 pulse-dot" /> Live
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                {['Time', 'Frame ID', 'Model', 'Detection', 'Confidence', 'Latency', 'Result'].map((h) => (
                  <th key={h} className="px-4 py-2 text-left text-[11px] text-faint uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { time: '15:04:48', frame: 'F-28491', model: 'YOLOv8', detection: 'Vehicle Collision', confidence: '98.2%', latency: '38ms', result: 'confirmed' },
                { time: '15:04:45', frame: 'F-28490', model: 'ResNet-50', detection: 'Classification', confidence: '99.1%', latency: '24ms', result: 'confirmed' },
                { time: '15:04:42', frame: 'F-28489', model: 'YOLOv8', detection: 'Near Miss', confidence: '76.4%', latency: '45ms', result: 'flagged' },
                { time: '15:04:38', frame: 'F-28488', model: 'EfficientDet', detection: 'Severity: High', confidence: '91.3%', latency: '52ms', result: 'confirmed' },
                { time: '15:04:35', frame: 'F-28487', model: 'YOLOv8', detection: 'No Incident', confidence: '99.7%', latency: '36ms', result: 'clear' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-dark-hover transition-colors">
                  <td className="px-4 py-2.5 text-xs text-muted font-mono">{row.time}</td>
                  <td className="px-4 py-2.5 text-xs text-secondary font-mono">{row.frame}</td>
                  <td className="px-4 py-2.5 text-xs text-secondary">{row.model}</td>
                  <td className="px-4 py-2.5 text-xs text-primary">{row.detection}</td>
                  <td className="px-4 py-2.5 text-xs font-mono text-muted">{row.confidence}</td>
                  <td className="px-4 py-2.5 text-xs font-mono text-muted">{row.latency}</td>
                  <td className="px-4 py-2.5">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      row.result === 'confirmed' ? 'bg-emerald-500/15 text-emerald-400' :
                      row.result === 'flagged' ? 'bg-amber-500/15 text-amber-400' :
                      'bg-blue-500/15 text-blue-400'
                    }`}>{row.result}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
