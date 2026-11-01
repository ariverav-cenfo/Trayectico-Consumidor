export interface SavedTrip {
  id: string;
  origin: string;
  destination: string;
  option: string;
  summary: string;
  price: string | null;
  savedAt: string | null;
}
