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
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export function SummaryTab({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return <CircularProgress />;
  }

  const locations = [
    {
      id: "1",
      name: "Location 1",
      lat: 51.505,
      lng: -0.09,
      metrics: { positive: 85, neutral: 10, negative: 5 },
    },
    {
      id: "2",
      name: "Location 2",
      lat: 51.515,
      lng: -0.1,
      metrics: { positive: 70, neutral: 20, negative: 10 },
    },
    {
      id: "3",
      name: "Location 3",
      lat: 51.525,
      lng: -0.11,
      metrics: { positive: 90, neutral: 5, negative: 5 },
    },
  ];

  const barData = locations.map((location) => ({
    name: location.name,
    Positive: location.metrics.positive,
    Neutral: location.metrics.neutral,
    Negative: location.metrics.negative,
  }));

  const pieData = [
    { name: "English", value: 70 },
    { name: "Spanish", value: 20 },
    { name: "French", value: 10 },
  ];

  const COLORS = ["#2196f3", "#ff9800", "#9c27b0"];

  return (
    <div className="bg-white rounded-lg shadow p-6 bg-white text-gray-900">
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4">Locations</h3>
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {locations.map((location) => (
            <Marker key={location.id} position={[location.lat, location.lng]}>
              <Popup>
                <div>
                  <h4>{location.name}</h4>
                  <p>Positive: {location.metrics.positive}%</p>
                  <p>Neutral: {location.metrics.neutral}%</p>
                  <p>Negative: {location.metrics.negative}%</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
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
        />
        <InsightCard
          title="Recurring Complaint"
          description="Some customers mentioned difficulty in navigating the mobile app."
          icon="⚠️"
        />
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        <div className="rounded-lg shadow p-6 bg-white">
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
            <Bar dataKey="Positive" fill="#4caf50" />
            <Bar dataKey="Neutral" fill="#ffeb3b" />
            <Bar dataKey="Negative" fill="#f44336" />
          </BarChart>
        </div>
        <div className="rounded-lg shadow p-6 bg-white">
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

function InsightCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: string;
}) {
  return (
    <div className="border-l-4 p-4 rounded-lg shadow bg-blue-50 border-blue-500">
      <div className="flex items-center mb-2">
        <span className="text-3xl mr-3">{icon}</span>
        <h3 className="font-bold text-lg text-blue-600">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
