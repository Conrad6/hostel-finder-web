export interface UserReview {
    id: string;
    reviewText: string;
    hostel: string;
    user: string;
    rating: number;
    dateCreated: Date;
    updatable: boolean;
}