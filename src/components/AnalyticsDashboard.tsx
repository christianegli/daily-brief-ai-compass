
import { BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Mock data for the analytics
const responseTimeData = [
  { day: "Mon", time: 45 },
  { day: "Tue", time: 32 },
  { day: "Wed", time: 60 },
  { day: "Thu", time: 25 },
  { day: "Fri", time: 38 },
  { day: "Sat", time: 15 },
  { day: "Sun", time: 20 },
];

const messageCounts = [
  { platform: "Email", count: 28, color: "#f97316" },
  { platform: "Slack", count: 42, color: "#8b5cf6" },
  { platform: "WhatsApp", count: 19, color: "#10b981" },
];

const AnalyticsDashboard = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center pb-2">
        <BarChart2 className="h-5 w-5 mr-2 text-indigo-600" />
        <CardTitle className="text-xl font-bold">Communication Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Average Response Time (minutes)</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} min`, "Response Time"]}
                  labelFormatter={(label) => `${label}day`}
                />
                <Bar dataKey="time" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Message Volume by Platform</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={messageCounts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} messages`, "Count"]}
                />
                <Bar 
                  dataKey="count" 
                  radius={[4, 4, 0, 0]}
                  fill="#8884d8"
                  getBarFill={(entry) => entry.color}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="border rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-indigo-600">89%</div>
              <div className="text-xs text-slate-500">Response Rate</div>
            </div>
            <div className="border rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-indigo-600">35 min</div>
              <div className="text-xs text-slate-500">Avg. Response Time</div>
            </div>
            <div className="border rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-indigo-600">58</div>
              <div className="text-xs text-slate-500">Pending Messages</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsDashboard;
