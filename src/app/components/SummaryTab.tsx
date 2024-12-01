import { CircularProgress } from "@mui/material";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export function SummaryTab({
  darkMode,
  isLoading,
}: {
  darkMode: boolean;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div
      className={`bg-white rounded-lg shadow p-6 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">Feedback Summary</h2>
      <p>
        Here’s a quick overview of recurring themes and insights from customer
        feedback.
      </p>

      {/* Example insights */}
      <div className="grid grid-cols-2 gap-6 mt-6">
        <InsightCard
          title="Common Praise"
          description="Customers love the fast delivery times and friendly customer support!"
          icon="👍"
          darkMode={darkMode}
        />
        <InsightCard
          title="Recurring Complaint"
          description="Some customers mentioned difficulty in navigating the mobile app."
          icon="⚠️"
          darkMode={darkMode}
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        <div
          className={`rounded-lg shadow p-6 ${
            darkMode ? "bg-gray-700" : "bg-white"
          }`}
        >
          <h3 className="text-xl font-bold mb-4">Sentiment Analysis</h3>
          <BarChart
            width={500}
            height={300}
            data={barData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>
        <div
          className={`rounded-lg shadow p-6 ${
            darkMode ? "bg-gray-700" : "bg-white"
          }`}
        >
          <h3 className="text-xl font-bold mb-4">Top Languages</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              cx={200}
              cy={200}
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
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
        </div>
      </div>
    </div>
  );
}

const barData = [
  { name: "Positive", value: 85 },
  { name: "Neutral", value: 10 },
  { name: "Negative", value: 5 },
];

const pieData = [
  { name: "English", value: 70 },
  { name: "Spanish", value: 20 },
  { name: "French", value: 10 },
];

const COLORS = ["#2196f3", "#ff9800", "#9c27b0"];

function InsightCard({
  title,
  description,
  icon,
  darkMode,
}: {
  title: string;
  description: string;
  icon?: string;
  darkMode: boolean;
}) {
  return (
    <div
      className={`border-l-4 p-4 rounded-lg shadow ${
        darkMode ? "bg-gray-700 border-blue-500" : "bg-blue-50 border-blue-500"
      }`}
    >
      <div className="flex items-center mb-2">
        <span className="text-3xl mr-3">{icon}</span>
        <h3
          className={`font-bold text-lg ${
            darkMode ? "text-white" : "text-blue-600"
          }`}
        >
          {title}
        </h3>
      </div>
      <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
        {description}
      </p>
    </div>
  );
}
