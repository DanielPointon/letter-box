import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const MOCK_MODE = true; // Enable mock mode by default, for when we don't have access to an API key

const FIELDS = [
  'id', 'displayName', 'formattedAddress', 'location', 'rating',
  'userRatingCount', 'reviews', 'photos', 'regularOpeningHours',
  'internationalPhoneNumber', 'nationalPhoneNumber', 'websiteUri',
  'priceLevel', 'editorialSummary', 'businessStatus', 'googleMapsUri'
].join(',');

const generateMockReviews = (count = 40) => {
  const reviewers = ['Alice Smith', 'Bob Johnson', 'Carol White', 'David Brown', 'Emma Davis'];
  const comments = [
    'Great place! Really enjoyed the atmosphere.',
    'Service was excellent, will definitely return.',
    'Good experience overall, but parking was difficult.',
    'Loved the ambiance and the staff was very friendly.',
    'Decent place but a bit pricey for what you get.'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    author_name: reviewers[i % reviewers.length],
    profile_photo_url: `https://example.com/photo${i + 1}.jpg`,
    rating: Math.floor(Math.random() * 2) + 4, // Ratings between 4-5
    relative_time_description: `${Math.floor(Math.random() * 4) + 1} months ago`,
    text: comments[i % comments.length],
    time: Math.floor(Date.now() / 1000) - (i * 86400), // Timestamps spread over past days
    language: 'en'
  }));
};

export async function POST(request: Request) {
  const headersList = headers();
  
  console.log('\n=== Incoming Request ===');
  console.log('Headers:', Object.fromEntries(headersList.entries()));
  
  try {
    const body = await request.json();
    console.log('Request Body:', body);
    
    const { placeId } = body;
    
    if (!placeId) {
      console.log('Error: Missing placeId in request');
      return NextResponse.json({ error: 'Place ID is required' }, { status: 400 });
    }

    if (MOCK_MODE) {
      console.log('\n=== Using Mock Data ===');
      const mockData = {
        result: {
          name: 'Sample Restaurant',
          formatted_address: '123 Mock Street, Sample City, ST 12345',
          rating: 4.5,
          user_ratings_total: 256,
          reviews: generateMockReviews(),
          photos: Array.from({ length: 10 }, (_, i) => ({
            photo_reference: `mock_photo_${i}`,
            height: 800,
            width: 1200,
            html_attributions: []
          })),
          website: 'https://example.com',
          international_phone_number: '+1 (555) 123-4567',
          price_level: 2,
          place_id: placeId,
          business_status: 'OPERATIONAL'
        },
        status: 'OK'
      };
      return NextResponse.json(mockData);
    }

    const apiUrl = `https://places.googleapis.com/v1/places/${placeId}`;
    const requestHeaders = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': process.env.GOOGLE_MAPS_API_KEY || '',
      'X-Goog-FieldMask': '*',
      'Accept-Language': 'en'
    };

    console.log('\n=== Outgoing Request ===');
    console.log('URL:', apiUrl);
    console.log('Headers:', {
      ...requestHeaders,
      'X-Goog-Api-Key': '[REDACTED]'
    });
    console.log('Requested Fields:', FIELDS.split(','));

    const response = await fetch(apiUrl, {
      headers: requestHeaders,
    });

    const data = await response.json();

    console.log('\n=== Google Places API Response ===');
    console.log('Status Code:', response.status);
    console.log('Response Headers:', Object.fromEntries(response.headers));
    console.log('Raw Response Data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.log('\n=== API Error ===');
      console.log('Error Response:', data);
      throw new Error(data.error?.message || 'Failed to fetch place details');
    }

    console.log('\n=== Transforming Response ===');
    const transformedData = {
      result: {
        name: data.displayName?.text,
        formatted_address: data.formattedAddress,
        rating: data.rating,
        user_ratings_total: data.userRatingCount,
        reviews: data.reviews?.map((review: any) => {
          console.log('Processing review:', review);
          return {
            author_name: review.authorName,
            profile_photo_url: review.authorPhoto?.uri || '',
            rating: review.rating,
            relative_time_description: review.relativePublishTimeDescription,
            text: review.text,
            time: new Date(review.publishTime).getTime() / 1000,
            language: review.languageCode
          };
        }),
        photos: data.photos?.map((photo: any) => {
          console.log('Processing photo:', photo);
          return {
            photo_reference: photo.name,
            height: photo.heightPx,
            width: photo.widthPx,
            html_attributions: []
          };
        }),
        website: data.websiteUri,
        international_phone_number: data.internationalPhoneNumber,
        price_level: data.priceLevel,
        place_id: data.id,
        business_status: data.businessStatus
      },
      status: 'OK'
    };

    console.log('\n=== Final Transformed Response ===');
    console.log('Transformed Data:', JSON.stringify(transformedData, null, 2));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.log('\n=== Error ===');
    console.error('Error details:', error);
    console.log('Environment:', {
      hasApiKey: !!process.env.GOOGLE_MAPS_API_KEY,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch place details',
        debug: {
          timestamp: new Date().toISOString(),
          env: {
            hasApiKey: !!process.env.GOOGLE_MAPS_API_KEY,
            nodeEnv: process.env.NODE_ENV
          }
        }
      }, 
      { status: 500 }
    );
  }
}