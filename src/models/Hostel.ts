import { UserReview } from './UserReview';

export interface Hostel {
    id: string;
    name: string;
    dateAdded: Date;
    contactPhone: string;
    contactEmail: string;
    description: string;
    price: number;
    longitude: number;
    latitude: number;
    images: string[];
    reviews: UserReview[];
}