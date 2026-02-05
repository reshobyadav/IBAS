"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function SmartBuildingDashboard() {
  const initialEnergy = useMemo(() => [
    { time: "00:00", kWh: 12 },
    { time: "02:00", kWh: 9 },
    { time: "04:00", kWh: 7 },
    { time: "06:00", kWh: 20 },
    { time: "08:00", kWh: 45 },
    { time: "10:00", kWh: 60 },
    { time: "12:00", kWh: 55 },
    { time: "14:00", kWh: 48 },
    { time: "16:00", kWh: 50 },
    { time: "18:00", kWh: 68 },
    { time: "20:00", kWh: 40 },
    { time: "22:00", kWh: 25 },
  ], []);

  const [energyData, setEnergyData] = useState(initialEnergy);
  const [devices, setDevices] = useState([
    { id: "light-101", name: "Classroom 101 Lights", type: "light", on: true },
    { id: "ac-102", name: "Classroom 102 AC", type: "hvac", on: false },
    { id: "pump-1", name: "Water Pump - Block A", type: "pump", on: true },
    { id: "outlet-1", name: "Lab Outlet 3", type: "outlet", on: false },
  ]);

  const [occupancy, setOccupancy] = useState([
    { zone: "Classroom 101", occupants: 35 },
    { zone: "Library", occupants: 12 },
    { zone: "Cafeteria", occupants: 28 },
    { zone: "Admin Office", occupants: 5 },
  ]);

  const [alerts, setAlerts] = useState([
    { id: 1, level: "info", text: "Scheduled maintenance: HVAC Block B - Tomorrow" },
    { id: 2, level: "warning", text: "Unusually high water flow in Block C" },
  ]);

  const [sustainability, setSustainability] = useState({
    monthlySavingsKWh: 420,
    carbonReductionKg: 250,
    waterSavedL: 9200,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergyData(prev => prev.map(p => ({ ...p, kWh: Math.max(3, Math.round(p.kWh * (0.95 + Math.random() * 0.12))) })));
      setOccupancy(prev => prev.map(o => ({ ...o, occupants: Math.max(0, o.occupants + Math.floor(Math.random() * 5 - 2)) })));

      if (Math.random() < 0.03) {
        setAlerts(a => [
          { id: Date.now(), level: Math.random() > 0.5 ? "warning" : "info", text: "Automated fault detected: sensor offline" },
          ...a,
        ].slice(0, 6));
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const toggleDevice = (id) => {
    setDevices(d => d.map(x => x.id === id ? { ...x, on: !x.on } : x));
  };

  const totalEnergy = useMemo(() => energyData.reduce((s, e) => s + e.kWh, 0), [energyData]);
  const avgOccupancy = useMemo(() => Math.round(occupancy.reduce((s, o) => s + o.occupants, 0) / occupancy.length), [occupancy]);

  const pieData = [
    { name: "Electricity", value: 68 },
    { name: "Water", value: 22 },
    { name: "Gas", value: 10 },
  ];
  const COLORS = ["#14B8A6", "#8B5CF6", "#F43F5E"];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Content */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Section */}
          <section className="lg:col-span-8 space-y-6 text-blue-600">
            {/* Energy Consumption */}
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-medium text-blue-600">Energy Consumption (24h)</h2>
                <div className="text-sm text-gray-600">Total: {totalEnergy} kWh</div>
              </div>
              <div className="h-64">
                <ResponsiveContainer>
                  <LineChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="kWh" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Occupancy + Sustainability */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card title="Occupancy Overview">
                <div className="space-y-2">
                  {occupancy.map(o => (
                    <div key={o.zone} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold">{o.zone}</div>
                        <div className="text-xs text-black">Sensors: Motion & RFID</div>
                      </div>
                      <div className="text-lg font-semibold">{o.occupants}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-xs text-black">Average occupancy: {avgOccupancy}</div>
              </Card>

              <Card title="Sustainability Snapshot">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <Metric label="Monthly Savings" value={`${sustainability.monthlySavingsKWh} kWh`} />
                  <Metric label="CO₂ Reduced" value={`${sustainability.carbonReductionKg} kg`} />
                  <Metric label="Water Saved" value={`${sustainability.waterSavedL} L`} />
                </div>
                <div className="w-full h-32 mt-4">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={30} outerRadius={45} paddingAngle={4}>
                        {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Legend layout="horizontal" verticalAlign="bottom" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Device Controls */}
            <Card title="Device Controls">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {devices.map(d => (
                  <div key={d.id} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="text-sm font-semibold">{d.name}</div>
                      <div className="text-xs text-black">{d.type.toUpperCase()}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`text-xs px-2 py-1 rounded ${d.on ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-black'}`}>{d.on ? 'On' : 'Off'}</div>
                      <button onClick={() => toggleDevice(d.id)} className="px-3 py-1 border rounded">Toggle</button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* Right Section */}
          <aside className="lg:col-span-4 space-y-6 text-blue-600">
            <Card title="Quick Metrics">
              <div className="grid gap-3">
                <Metric label="Current Load" value={`${energyData[energyData.length - 1].kWh} kWh`} />
                <Metric label="Peak Today" value={`${Math.max(...energyData.map(d => d.kWh))} kWh`} />
                <Metric label="Active Alerts" value={`${alerts.length}`} />
                <Metric label="Connected Devices" value={`${devices.length}`} />
              </div>
            </Card>

            <Card title="Recent Alerts">
              <div className="space-y-2">
                {alerts.map(a => (
                  <div key={a.id} className={`p-3 rounded border-l-4 ${a.level === 'warning' ? 'border-amber-400' : 'border-violet-400'}`}>
                    <div className="text-sm">{a.text}</div>
                    <div className="text-xs text-black">{new Date(a.id).toISOString()}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Recent Events & Logs">
              <div className="text-xs text-black space-y-2">
                <div>• 10:12 — Motion detected in Hallway C</div>
                <div>• 09:45 — Water leak sensor tested (OK)</div>
                <div>• 08:00 — Night mode turned off</div>
              </div>
            </Card>

            <Card title="Building Controls (Quick)">
              <div className="flex flex-col gap-2">
                <button className="w-full border rounded p-2 text-left">Set Classroom Schedule</button>
                <button className="w-full border rounded p-2 text-left">Run Water Conservation Mode</button>
                <button className="w-full border rounded p-2 text-left">Trigger Emergency Lockdown</button>
              </div>
            </Card>
          </aside>
        </main>
      </div>
    </div>
  );
}

function Card({ children, title }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-4 rounded-2xl shadow">
      {title && <h3 className="text-sm font-medium mb-3 text-blue-600">{title}</h3>}
      {children}
    </motion.div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="flex items-center justify-between p-2 border rounded">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium text-blue-600">{value}</div>
    </div>
  );
}
