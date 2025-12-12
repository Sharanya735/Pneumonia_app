import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Activity, PieChart as PieChartIcon, BarChart3 } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface HistoryItem {
  prediction: string;
  confidence: number;
  date: string;
}

const Dashboard = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("scanHistory");
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const getPredictionStats = () => {
    const stats = { Normal: 0, Viral: 0, Bacterial: 0 };
    history.forEach((item) => {
      const pred = item.prediction.toLowerCase();
      if (pred.includes("normal")) stats.Normal++;
      else if (pred.includes("viral")) stats.Viral++;
      else stats.Bacterial++;
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  };

  const getConfidenceDistribution = () => {
    const ranges = {
      "0-20%": 0,
      "21-40%": 0,
      "41-60%": 0,
      "61-80%": 0,
      "81-100%": 0,
    };
    
    history.forEach((item) => {
      const conf = item.confidence * 100;
      if (conf <= 20) ranges["0-20%"]++;
      else if (conf <= 40) ranges["21-40%"]++;
      else if (conf <= 60) ranges["41-60%"]++;
      else if (conf <= 80) ranges["61-80%"]++;
      else ranges["81-100%"]++;
    });

    return Object.entries(ranges).map(([range, count]) => ({ range, count }));
  };

  const exportToCSV = () => {
    const csvContent = [
      ["Date", "Prediction", "Confidence"],
      ...history.map((item) => [
        new Date(item.date).toLocaleString(),
        item.prediction,
        `${(item.confidence * 100).toFixed(2)}%`,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pneumoscan-data-${Date.now()}.csv`;
    a.click();
  };

  const pieData = getPredictionStats();
  const barData = getConfidenceDistribution();
  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive overview of your scan history
            </p>
          </div>
          <Button onClick={exportToCSV} disabled={history.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 shadow-soft hover:shadow-glow transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-medical rounded-xl">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Scans</p>
                <p className="text-3xl font-bold">{history.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-soft hover:shadow-glow transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-success/10 rounded-xl">
                <PieChartIcon className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Normal Cases</p>
                <p className="text-3xl font-bold text-success">
                  {pieData.find((d) => d.name === "Normal")?.value || 0}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-soft hover:shadow-glow transition-all">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-xl">
                <BarChart3 className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pneumonia Cases</p>
                <p className="text-3xl font-bold text-destructive">
                  {(pieData.find((d) => d.name === "Viral")?.value || 0) +
                    (pieData.find((d) => d.name === "Bacterial")?.value || 0)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 shadow-soft">
            <h3 className="text-xl font-bold mb-4">Prediction Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 shadow-soft">
            <h3 className="text-xl font-bold mb-4">Confidence Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Scans Table */}
        <Card className="p-6 shadow-soft">
          <h3 className="text-xl font-bold mb-4">Last 10 Scans</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Date</th>
                  <th className="text-left p-3 font-semibold">Prediction</th>
                  <th className="text-left p-3 font-semibold">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(0, 10).map((item, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      {new Date(item.date).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          item.prediction.toLowerCase().includes("normal")
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {item.prediction}
                      </span>
                    </td>
                    <td className="p-3 font-medium">
                      {(item.confidence * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
