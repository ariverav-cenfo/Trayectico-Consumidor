export interface TripStepData {
  title: string;
  description: string;
}

export interface TripOption {
  id: string;
  title: string;
  summary: string;
  routeId: string;
  price: string;
  payment: string;
  points: string;
  steps: TripStepData[];
}
