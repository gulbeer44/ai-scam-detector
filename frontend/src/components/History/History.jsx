import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Box } from "@mui/material";
import "./History.css";

function History({ text }) {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first");
        return;
      }

      const res = await axios.get("http://localhost:5000/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data);
    } catch (err) {
      console.log(err);
      setError("Failed to load history");
    }
  };

  const filteredData = data.filter((item) => {
    if (!text) return true;
    return item.text.toLowerCase().includes(text.toLowerCase());
  });

  const scamCount = filteredData.filter(d => d.prediction === "Scam").length;
  const safeCount = filteredData.filter(d => d.prediction === "Safe").length;

  const today = new Date().toDateString();
  const todayScans = filteredData.filter(
    d => new Date(d.createdAt).toDateString() === today
  ).length;

  const chartData =
    scamCount === 0 && safeCount === 0
      ? [{ name: "No Data", value: 1 }]
      : [
          { name: "Scam", value: scamCount },
          { name: "Safe", value: safeCount }
        ];

  const COLORS = ["#ef4444", "#22c55e"];

  const dailyDataMap = {};
  filteredData.forEach((item) => {
    const date = new Date(item.createdAt).toLocaleDateString();
    if (!dailyDataMap[date]) dailyDataMap[date] = 0;
    dailyDataMap[date]++;
  });

  const dailyData = Object.keys(dailyDataMap).map((date) => ({
    date,
    scans: dailyDataMap[date]
  }));

  const total = filteredData.length;
  const scamItems = filteredData.filter(d => d.prediction === "Scam");

  const scamRate = total > 0
    ? Math.round((scamItems.length / total) * 100)
    : 0;

  const typeCount = {};
  scamItems.forEach(item => {
    const type = item.scamType || "Unknown";
    typeCount[type] = (typeCount[type] || 0) + 1;
  });

  let mostCommon = "N/A";
  let max = 0;
  for (let type in typeCount) {
    if (typeCount[type] > max) {
      max = typeCount[type];
      mostCommon = type;
    }
  }

  const riskTrend =
    scamRate > 50 ? "Increasing 🔺" :
    scamRate > 20 ? "Moderate ⚠️" :
    "Stable ✅";

  return (
    <Box className="history-container">

      <Typography variant="h5" className="history-title">
        📊 Scan History
      </Typography>

      {/* Dashboard */}
      <Box className="history-dashboard">
        {[
          { label: "Total", value: total },
          { label: "Scam", value: scamCount },
          { label: "Safe", value: safeCount },
          { label: "Today", value: todayScans }
        ].map((item, i) => (
          <Box key={i} className="history-card">
            <Typography variant="h6">{item.value}</Typography>
            <Typography className="history-label">
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Insights */}
      <Box className="history-glass">
        <Typography variant="h6">📊 Insights</Typography>
        <Typography>• Total scans: {total}</Typography>
        <Typography>• Scam rate: {scamRate}%</Typography>
        <Typography>• Most common scam: {mostCommon}</Typography>
        <Typography>• Risk trend: {riskTrend}</Typography>
      </Box>

      {/* Pie Chart */}
      {filteredData.length > 0 && (
        <Box className="history-glass">
          <Typography variant="h6">📊 Scan Analytics</Typography>

          <Box className="chart-box">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chartData} dataKey="value" innerRadius={60} outerRadius={90}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Box>
      )}

      {/* Line Chart */}
      {dailyData.length > 1 && (
        <Box className="history-glass">
          <Typography variant="h6">📈 Daily Activity</Typography>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <Line type="monotone" dataKey="scans" stroke="#6366f1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}

      {error && <Typography color="error">{error}</Typography>}
      {filteredData.length === 0 && !error && (
        <Typography>No history yet</Typography>
      )}

      {/* Cards */}
      {filteredData.map((item, i) => (
        <Card key={i} className="history-item">
          <CardContent>
            <Typography variant="h6">
              {item.prediction === "Scam" ? "🚨 Scam Detected" : "✅ Safe Message"}
            </Typography>

            <Typography mt={1}>
              <b>Message:</b> {item.text}
            </Typography>

            <Typography>
              <b>Type:</b> {item.scamType}
            </Typography>

            <Typography className="history-date">
              {new Date(item.createdAt).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default History;