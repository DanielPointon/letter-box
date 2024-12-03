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
      <span className="mr-2 text-lg leading-none text-blue-400">•</span>
      <span className="flex-1 text-gray-300">{textToShow}</span>
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
      className="border-l-4 p-6 rounded-lg shadow-lg transition-all duration-300 bg-gray-800/50 backdrop-blur-lg border-blue-500/30"
    >
      <div className="flex items-center mb-4">
        <span className="text-3xl mr-3">{icon}</span>
        <h3 className="font-bold text-xl text-blue-400">
          {title}
        </h3>
      </div>

      <div className="min-h-[200px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full py-8">
            <div className="relative">
              <div className="w-8 h-8 border-4 border-gray-700 rounded-full"></div>
              <div className="absolute top-0 left-0 w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
          </div>
        ) : (
          <ul className="space-y-3 transition-opacity duration-500">
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

export const SummaryTab: React.FC<SummaryTabProps> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-900/50 backdrop-blur-lg rounded-lg shadow-2xl border border-gray-800">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-700 rounded-full"></div>
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

  const COLORS = ["#60A5FA", "#F59E0B", "#8B5CF6"];

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
    <div className="bg-gray-900/50 backdrop-blur-lg rounded-lg shadow-2xl p-6 border border-gray-800">
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4 text-gray-200">Locations</h3>
        <div className="rounded-lg overflow-hidden border border-gray-800">
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            style={{ height: "400px", width: "100%" }}
            className="map-dark" // Add custom CSS for dark theme map
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {locations.map((location) => (
              <Marker key={location.id} position={[location.lat, location.lng]}>
                <Popup className="dark-popup">
                  <div className="text-gray-800">
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
      </div>

      <h2 className="text-2xl font-bold mb-4 mt-8 text-gray-200">Feedback Summary</h2>
      <p className="mb-6 text-gray-400">
        Here's a quick overview of recurring themes and insights from customer
        feedback.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
        <div className="rounded-lg shadow-xl p-6 bg-gray-800/50 backdrop-blur-lg border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-gray-200">Sentiment Analysis</h3>
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
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '0.375rem',
                color: '#E5E7EB'
              }}
            />
            <Legend />
            <Bar dataKey="Positive" fill="#60A5FA" />
            <Bar dataKey="Neutral" fill="#F59E0B" />
            <Bar dataKey="Negative" fill="#EF4444" />
          </BarChart>
        </div>

        <div className="rounded-lg shadow-xl p-6 bg-gray-800/50 backdrop-blur-lg border border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-gray-200">Top Languages</h3>
          <PieChart width={400} height={400}>
            <Pie
              data={pieData}
              cx={200}
              cy={200}
              labelLine={false}
              label={({ name, percent }) => (
                `${name} ${(percent * 100).toFixed(0)}%`
              )}
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
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '0.375rem',
                color: '#E5E7EB'
              }}
            />
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default SummaryTab;