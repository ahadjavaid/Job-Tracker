import React, { useMemo } from 'react';
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#4361ee', '#22c55e', '#f77f00', '#ef4444', '#7209b7'];

const AdminAnalytics = ({ jobs, applications }) => {

    // 1. Applications Per Month Data
    const applicationsPerMonth = useMemo(() => {
        const counts = {};
        applications.forEach(app => {
            if (app.appliedAt) {
                const date = new Date(app.appliedAt);
                const month = date.toLocaleString('default', { month: 'short' });
                const year = date.getFullYear();
                const key = `${month} ${year}`;
                counts[key] = (counts[key] || 0) + 1;
            }
        });
        return Object.keys(counts).map(key => ({
            name: key,
            Applications: counts[key]
        }));
    }, [applications]);

    // 2. Popular Job Categories Data
    const jobCategories = useMemo(() => {
        const counts = {};
        applications.forEach(app => {
            let type = 'Unknown';
            if (app.jobType) {
                // Normalize by replacing underscores and converting to lower case
                const normalized = app.jobType.replace(/_/g, ' ').toLowerCase();
                // Convert to Title Case (e.g., "full time" -> "Full Time")
                type = normalized.split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            }
            counts[type] = (counts[type] || 0) + 1;
        });
        return Object.keys(counts).map(key => ({
            name: key,
            Count: counts[key]
        })).sort((a, b) => b.Count - a.Count);
    }, [applications]);

    // 3. Success/Rejection Ratios
    const statusRatios = useMemo(() => {
        const counts = {};
        applications.forEach(app => {
            const status = app.status || 'UNKNOWN';
            counts[status] = (counts[status] || 0) + 1;
        });
        return Object.keys(counts).map(key => ({
            name: key,
            value: counts[key]
        }));
    }, [applications]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={styles.customTooltip}>
                    <p style={styles.tooltipLabel}>{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ ...styles.tooltipData, color: entry.color || entry.fill }}>
                            {entry.name}: <span style={styles.tooltipValue}>{entry.value}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div style={styles.container}>
            
            {/* Applications Over Time */}
            <div style={styles.chartCard}>
                <h3 style={styles.chartTitle}>Applications Received Per Month</h3>
                <div style={styles.chartWrapper}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={applicationsPerMonth}>
                            <defs>
                                <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4361ee" stopOpacity={0.6}/>
                                    <stop offset="95%" stopColor="#4361ee" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4e" vertical={false} />
                            <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
                            <YAxis stroke="#9ca3af" allowDecimals={false} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                            <Area 
                                type="monotone" 
                                dataKey="Applications" 
                                stroke="#4361ee" 
                                strokeWidth={3} 
                                fillOpacity={1} 
                                fill="url(#colorApplications)" 
                                activeDot={{ r: 8, strokeWidth: 0, fill: '#4361ee' }} 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={styles.gridRow}>
                {/* Popular Categories */}
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Most Popular Job Categories</h3>
                    <div style={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={jobCategories} barSize={40}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7209b7" stopOpacity={0.9}/>
                                        <stop offset="95%" stopColor="#4361ee" stopOpacity={0.9}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d4e" vertical={false} />
                                <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
                                <YAxis stroke="#9ca3af" allowDecimals={false} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{fill: '#1e1e3a', opacity: 0.4}} />
                                <Bar dataKey="Count" fill="url(#colorCount)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Ratios */}
                <div style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>Application Status Ratio</h3>
                    <div style={styles.chartWrapper}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusRatios}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {statusRatios.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ paddingTop: '20px' }}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        marginTop: '10px'
    },
    gridRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
    },
    chartCard: {
        backgroundColor: '#13131f',
        border: '1px solid #1e1e3a',
        borderRadius: '20px',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)'
    },
    chartTitle: {
        color: 'white',
        margin: '0 0 24px 0',
        fontSize: '20px',
        fontWeight: '700',
        letterSpacing: '0.5px'
    },
    chartWrapper: {
        height: '320px',
        width: '100%'
    },
    customTooltip: {
        backgroundColor: 'rgba(19, 19, 31, 0.9)',
        border: '1px solid #2d2d4e',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)'
    },
    tooltipLabel: {
        color: '#9ca3af',
        margin: '0 0 8px 0',
        fontSize: '14px',
        fontWeight: '600'
    },
    tooltipData: {
        margin: '4px 0',
        fontSize: '14px',
        fontWeight: '500'
    },
    tooltipValue: {
        color: 'white',
        fontWeight: '700',
        marginLeft: '4px'
    }
};

export default AdminAnalytics;
