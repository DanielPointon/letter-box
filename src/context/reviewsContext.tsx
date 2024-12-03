'use client';

import React, { createContext, useContext, useState } from 'react';

export type Review = {
  id: string;
  text: string;
  lang: "English" | "Spanish" | "French";
  userId: string;
  user: {
    id: string;
    username: string;
    avatarUrl: string;
  };
  imageUrl?: string;
  responded: boolean;
  isTranslating?: boolean;
  originalText?: string;
  rating?: number;
  responseTime?: string;
};

type ReviewsContextType = {
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  getReviewById: (id: string) => Review | undefined;
  markAsResponded: (id: string) => void;
  translations: Record<string, Record<string, string>>;
};

const defaultTranslations: Record<string, Record<string, string>> = {
  Spanish: {
    "Great service!": "¡Excelente servicio!",
    "Muy buen producto": "Very good product",
    "Thank you for your feedback! We appreciate your kind words.": "¡Gracias por sus comentarios! Apreciamos sus amables palabras.",
    "We're glad you enjoyed our service.": "Nos alegra que haya disfrutado de nuestro servicio."
  },
  French: {
    "Produit de qualité": "Quality product",
    "Thank you for your review! We strive for excellence.": "Merci pour votre avis ! Nous visons l'excellence.",
    "We appreciate your business.": "Nous apprécions votre confiance."
  }
};

const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    text: "Great service!",
    lang: "English",
    userId: "1",
    user: {
      id: "1",
      username: "John Doe",
      avatarUrl: "#image#",
    },
    responded: false,
    rating: 5,
    responseTime: "2h",
  },
  {
    id: "2",
    text: "Muy buen producto",
    lang: "Spanish",
    userId: "2",
    user: {
      id: "2",
      username: "Maria Garcia",
      avatarUrl: "#image#",
    },
    responded: true,
    originalText: "Very good product!",
    rating: 4,
    responseTime: "1d",
  },
  {
    id: "3",
    text: "Produit de qualité",
    lang: "French",
    userId: "3",
    user: {
      id: "3",
      username: "Jean Dupont",
      avatarUrl: "#image#",
    },
    imageUrl: "#image#",
    responded: false,
    originalText: "Very good product!",
    rating: 3,
    responseTime: "3d",
  },
];

const ReviewsContext = createContext<ReviewsContextType | null>(null);

export function ReviewsProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);

  const getReviewById = (id: string) => {
    return reviews.find(review => review.id === id);
  };

  const markAsResponded = (id: string) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === id
          ? { ...review, responded: true }
          : review
      )
    );
  };

  return (
    <div>
      <ReviewsContext.Provider 
        value={{
          reviews,
          setReviews,
          getReviewById,
          markAsResponded,
          translations: defaultTranslations
        }}
      >
        {children}
      </ReviewsContext.Provider>
    </div>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
}

export { ReviewsContext };