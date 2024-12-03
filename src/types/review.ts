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

export type ReviewsContextType = {
    reviews: Review[];
    setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
    getReviewById: (id: string) => Review | undefined;
    markAsResponded: (id: string) => void;
    translations: Record<string, Record<string, string>>;
};