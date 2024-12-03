// src/app/api/places/reviews/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

const FIELDS = [
  'id',
  'displayName',
  'formattedAddress',
  'location',
  'rating',
  'userRatingCount',
  'reviews',
  'photos',
  'regularOpeningHours',
  'internationalPhoneNumber',
  'nationalPhoneNumber',
  'websiteUri',
  'priceLevel',
  'editorialSummary',
  'businessStatus',
  'googleMapsUri',
].join(',');

export async function POST(request: Request) {
  const headersList = headers();
  
  // Log all incoming request headers
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
      'X-Goog-Api-Key': '[REDACTED]' // Don't log the actual API key
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

    // Transform the response
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