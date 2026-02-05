"use client"

import React from 'react'
import { useState , useMemo } from 'react';

const Header = () => {
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
    const [selectedBuilding, setSelectedBuilding] = useState("Main Campus");
    const [energyData, setEnergyData] = useState(initialEnergy);
    const applyOptimization = () => {
        setEnergyData(prev => prev.map(p => ({ ...p, kWh: Math.max(2, Math.round(p.kWh * 0.88)) })));
        setSustainability(s => ({ ...s, monthlySavingsKWh: s.monthlySavingsKWh + 8, carbonReductionKg: s.carbonReductionKg + 4 }));
        setAlerts(a => [{ id: Date.now(), level: 'info', text: 'AI Scheduler applied energy optimization' }, ...a].slice(0, 6));
    };
    const [alerts, setAlerts] = useState([
        { id: 1, level: "info", text: "Scheduled maintenance: HVAC Block B - Tomorrow" },
        { id: 2, level: "warning", text: "Unusually high water flow in Block C" },
    ]);
    
    const [sustainability, setSustainability] = useState({
        monthlySavingsKWh: 420,
        carbonReductionKg: 250,
        waterSavedL: 9200,
    });

    return (
        <div className='max-w-full bg-gray-50 p-4 sm:p-6'>
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-blue-600">Smart Building Dashboard</h1>
                    <p className="text-sm text-gray-500">Intelligent Building Automation — {selectedBuilding}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <select
                        value={selectedBuilding}
                        onChange={(e) => setSelectedBuilding(e.target.value)}
                        className="border rounded px-3 py-2 text-blue-600"
                    >
                        <option>Main Campus</option>
                        <option>Research Block</option>
                        <option>Hostel Complex</option>
                    </select>
                    <button
                        onClick={applyOptimization}
                        className="bg-teal-500 text-white px-4 py-2 rounded shadow hover:opacity-90"
                    >
                        Apply AI Optimization
                    </button>
                </div>
            </header>
        </div>
    )
}

export default Header
