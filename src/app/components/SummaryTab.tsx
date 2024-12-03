// src/app/components/SummaryTab.tsx
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
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

interface Props {
  darkMode: boolean;
  isLoading: boolean;
  places: Array<{
    id: string;
    details: {
      name: string;
      rating: number;
      user_ratings_total: number;
      formatted_address: string;
    };
  }>;
}

export function SummaryTab({ darkMode, isLoading, places }: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );
  }

  const ratingDistribution = places
    .filter(place => place.details && place.details.rating) // Filter out places without details
    .map(place => ({
      name: place.details.name || 'Unknown',
      rating: place.details.rating || 0,
      reviews: place.details.user_ratings_total || 0
    }));

  const totalReviews = places.reduce(
    (sum, place) => sum + (place.details?.user_ratings_total || 0),
    0
  );

  const averageRating = places.length > 0
    ? places.reduce((sum, place) => sum + (place.details?.rating || 0), 0) / places.length
    : 0;

  const RATING_COLORS = ['#2196f3', '#4caf50', '#ff9800', '#f44336'];
  const darkModeClass = darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900';

  // Helper function to safely format numbers
  const formatNumber = (num?: number) => {
    return (num ?? 0).toLocaleString();
  };

  // Helper function to safely get rating
  const getRating = (rating?: number) => {
    return rating ? `${rating} ★` : 'N/A';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Locations"
          value={places.length}
          icon="🏢"
          darkMode={darkMode}
        />
        <StatCard
          title="Average Rating"
          value={`${averageRating.toFixed(1)} ★`}
          icon="⭐"
          darkMode={darkMode}
        />
        <StatCard
          title="Total Reviews"
          value={formatNumber(totalReviews)}
          icon="📝"
          darkMode={darkMode}
        />
      </div>

      {places.length > 0 ? (
        <>
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6`}>
            <div className={`p-6 rounded-lg shadow ${darkModeClass}`}>
              <h3 className="text-xl font-bold mb-4">Ratings by Location</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rating" fill="#2196f3" name="Rating" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={`p-6 rounded-lg shadow ${darkModeClass}`}>
              <h3 className="text-xl font-bold mb-4">Review Volume by Location</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ratingDistribution}
                      dataKey="reviews"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => 
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {ratingDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`}
                          fill={RATING_COLORS[index % RATING_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className={`rounded-lg shadow ${darkModeClass}`}>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Location Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Reviews
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {places.map((place) => (
                      <tr key={place.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {place.details?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          {place.details?.formatted_address || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getRating(place.details?.rating)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatNumber(place.details?.user_ratings_total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No locations found. Try adding some Place IDs.</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  darkMode 
}: { 
  title: string; 
  value: string | number; 
  icon: string;
  darkMode: boolean;
}) {
  return (
    <div className={`p-6 rounded-lg shadow ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
}
