// src/services/googlePlaces.ts

export interface PlaceReview {
  author_name: string;
  author_url?: string;
  language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface PlacePhoto {
  height: number;
  html_attributions: string[];
  photo_reference: string;
  width: number;
}

export interface PlaceDetails {
  name: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: { lat: number; lng: number };
      southwest: { lat: number; lng: number };
    };
  };
  international_phone_number?: string;
  rating?: number;
  reviews?: PlaceReview[];
  photos?: PlacePhoto[];
  place_id: string;
  price_level?: number;
  user_ratings_total?: number;
  website?: string;
  business_status?: string;
}

export interface PlaceResponse {
  html_attributions: string[];
  result: PlaceDetails;
  status: string;
  error_message?: string;
}

export async function fetchPlaceDetails(placeId: string): Promise<PlaceResponse> {
  const response = await fetch('/api/places/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ placeId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch place details');
  }

  return response.json();
}