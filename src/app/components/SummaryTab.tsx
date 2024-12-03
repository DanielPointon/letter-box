import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
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
  ResponsiveContainer
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Types
interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  metrics: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

interface BarData {
  name: string;
  Positive: number;
  Neutral: number;
  Negative: number;
}

interface PieData {
  name: string;
  value: number;
}

interface InsightCardProps {
  title: string;
  points: string[];
  icon?: string;
}

interface SummaryTabProps {
  isLoading: boolean;
}

interface TypewriterBulletPointProps {
  text: string;
  delay: number;
  startTyping: boolean;
  onComplete: () => void;
  index: number;
  activeIndex: number;
  completedIndices: Set<number>;
}

// Chart theme configuration
const chartTheme = {
  colors: {
    positive: "#4ade80",
    neutral: "#fbbf24",
    negative: "#f87171",
    pieColors: ["#60a5fa", "#818cf8", "#a78bfa"],
    background: "#1e293b",
    text: "#e2e8f0",
    grid: "#334155",
  },
  fontSize: {
    label: 12,
    title: 14,
  }
};

// Custom hook for typewriter effect
const useTypewriter = (
  text: string,
  delay = 50,
  startTyping = false,
  onComplete?: () => void
): { displayText: string; isComplete: boolean } => {
  const [displayText, setDisplayText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    if (!startTyping) {
      setDisplayText("");
      setCurrentIndex(0);
      setIsComplete(false);
      return;
    }

    if (currentIndex < text.length) {
      const timer: NodeJS.Timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, delay, text, startTyping, onComplete, isComplete]);

  return { displayText, isComplete };
};

const TypewriterBulletPoint: React.FC<TypewriterBulletPointProps> = ({
  text,
  delay,
  startTyping,
  onComplete,
  index,
  activeIndex,
  completedIndices,
}) => {
  const { displayText, isComplete } = useTypewriter(
    text,
    delay,
    startTyping,
    onComplete
  );

  const isVisible = index <= activeIndex || completedIndices.has(index);
  const textToShow = completedIndices.has(index) ? text : displayText;

  return (
    <li
      className="mb-2 flex items-start opacity-0 transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <span className="mr-2 text-lg leading-none">•</span>
      <span className="flex-1">{textToShow}</span>
    </li>
  );
};

const InsightCard: React.FC<InsightCardProps> = ({ title, points, icon }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [completedIndices, setCompletedIndices] = useState<Set<number>>(
    new Set()
  );
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      const timer: NodeJS.Timeout = setTimeout(() => {
        setIsLoading(false);
        setActiveIndex(0);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [inView]);

  const handleBulletComplete = (index: number) => {
    setCompletedIndices((prev) => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
  };

  useEffect(() => {
    if (
      !isLoading &&
      activeIndex < points.length - 1 &&
      completedIndices.has(activeIndex)
    ) {
      const timer = setTimeout(() => {
        setActiveIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [completedIndices, activeIndex, points.length, isLoading]);

  return (
    <div
      ref={ref}
      className="rounded-lg bg-slate-800 p-6 shadow-lg"
    >
      <div className="flex items-center mb-4">
        <span className="text-3xl mr-3">{icon}</span>
        <h3 className="text-xl font-bold text-slate-200">{title}</h3>
      </div>

      <div className="min-h-[200px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full py-8">
            <div className="relative">
              <div className="w-8 h-8 border-4 border-slate-600 rounded-full"></div>
              <div className="absolute top-0 left-0 w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
          </div>
        ) : (
          <ul className="space-y-3 text-slate-300">
            {points.map((point, index) => (
              <TypewriterBulletPoint
                key={index}
                text={point}
                delay={30}
                startTyping={index === activeIndex}
                onComplete={() => handleBulletComplete(index)}
                index={index}
                activeIndex={activeIndex}
                completedIndices={completedIndices}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-2 rounded shadow-lg">
        <p className="text-slate-200 font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}%`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const SummaryTab: React.FC<SummaryTabProps> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-slate-600 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  const locations: Location[] = [
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

  const barData: BarData[] = locations.map((location) => ({
    name: location.name,
    Positive: location.metrics.positive,
    Neutral: location.metrics.neutral,
    Negative: location.metrics.negative,
  }));

  const pieData: PieData[] = [
    { name: "English", value: 70 },
    { name: "Spanish", value: 20 },
    { name: "French", value: 10 },
  ];

  const commonPraisePoints: string[] = [
    "Check-in process is consistently quick and efficient",
    "Staff receives excellent reviews for their hospitality",
    "Room cleanliness and comfort exceed guest expectations",
    "Breakfast buffet quality highly praised by guests",
  ];

  const recurringComplaintPoints: string[] = [
    "Room service menu could offer more variety",
    "Some guests report inconsistent water temperature",
    "Wifi connection can be unstable in certain rooms",
    "Parking facilities too limited during peak seasons",
  ];

  return (
    <div className="bg-slate-900 text-slate-200 rounded-lg shadow-xl p-6">
      <div className="mt-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Locations</h3>
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
          className="rounded-lg shadow-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {locations.map((location) => (
            <Marker key={location.id} position={[location.lat, location.lng]}>
              <Popup>
                <div className="p-2">
                  <h4 className="font-bold">{location.name}</h4>
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
      <p className="mb-6 text-slate-300">
        Here's a quick overview of recurring themes and insights from customer
        feedback.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <InsightCard
          title="Common Praise"
          points={commonPraisePoints}
          icon="👍"
        />
        <InsightCard
          title="Recurring Complaints"
          points={recurringComplaintPoints}
          icon="⚠️"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg bg-slate-800 p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-slate-200">Sentiment Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.colors.grid} />
              <XAxis 
                dataKey="name" 
                stroke={chartTheme.colors.text}
                tick={{ fill: chartTheme.colors.text }}
              />
              <YAxis 
                stroke={chartTheme.colors.text}
                tick={{ fill: chartTheme.colors.text }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: chartTheme.colors.text }}
              />
              <Bar dataKey="Positive" fill={chartTheme.colors.positive} />
              <Bar dataKey="Neutral" fill={chartTheme.colors.neutral} />
              <Bar dataKey="Negative" fill={chartTheme.colors.negative} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-slate-800 p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-6 text-slate-200">Language Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={chartTheme.colors.pieColors[index % chartTheme.colors.pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SummaryTab;