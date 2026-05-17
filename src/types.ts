/**
 * Core types for RouteNaga
 */

export enum VehicleType {
  SUMO = "Shared Sumo",
  BUS = "Bus",
  TAXI = "Private Taxi",
}

export enum TravelStatus {
  ON_TIME = "On Time",
  DELAYED = "Delayed",
  BOARDING = "Boarding",
  COMPLETED = "Completed",
}

export interface Route {
  id: string;
  from: string;
  to: string;
  vehicleType: VehicleType;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  status: TravelStatus;
  safetyRating: number;
  tags: string[];
}

export interface TouristSpot {
  id: string;
  name: string;
  description: string;
  location: string;
  bestTime: string;
  travelTip: string;
  safetyNote: string;
  category: "Nature" | "Culture" | "History" | "Adventure";
  imageUrl?: string;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface UserStats {
  totalTrips: number;
  savedRoutes: number;
  aiInsights: number;
  alertsReceived: number;
}
