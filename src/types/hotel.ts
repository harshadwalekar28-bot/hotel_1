export type ViewMode = 'guest' | 'staff';

export interface RoomInfo {
  roomNumber: string;
  guestName: string;
  roomType: string;
  floor: number;
  checkInDate: string;
  checkOutDate: string;
  wifiStatus: 'connected' | 'disconnected';
}

export type ResourceCategory = 'breakfast' | 'dining' | 'drinks' | 'amenities' | 'linens' | 'comfort';

export interface ResourceItem {
  id: string;
  title: string;
  category: ResourceCategory;
  description: string;
  price: number; // 0 for complimentary room resources like towels, adapters
  isComplimentary: boolean;
  estimatedMinutes: number;
  image?: string;
  dietary?: string[];
  inStock: boolean;
  popular?: boolean;
}

export interface CartItem {
  item: ResourceItem;
  quantity: number;
  specialInstructions?: string;
}

export type RequestStatus = 'pending' | 'in_progress' | 'delivered' | 'cancelled';
export type RequestPriority = 'standard' | 'high' | 'urgent';

export interface GuestRequest {
  id: string;
  roomNumber: string;
  guestName: string;
  type: 'dining' | 'amenity' | 'housekeeping' | 'concierge';
  items: CartItem[];
  totalAmount: number;
  notes: string;
  status: RequestStatus;
  priority: RequestPriority;
  createdAt: string;
  completedAt?: string;
  assignedStaff?: string;
}

export type MaintenanceCategory =
  | 'ac_climate'
  | 'plumbing_water'
  | 'electrical_lighting'
  | 'tv_entertainment'
  | 'keycard_lock'
  | 'furniture_fixtures'
  | 'other';

export type MaintenanceUrgency = 'low' | 'standard' | 'urgent';
export type MaintenanceStatus = 'open' | 'investigating' | 'parts_ordered' | 'resolved';

export interface MaintenanceTicket {
  id: string;
  roomNumber: string;
  guestName: string;
  category: MaintenanceCategory;
  summary: string;
  description: string;
  urgency: MaintenanceUrgency;
  status: MaintenanceStatus;
  preferredTime?: string;
  reportedBy: string; // 'Guest (Room 402)' or 'Housekeeping (Elena)'
  reportedAt: string;
  resolvedAt?: string;
  assignedTechnician?: string;
  resolutionNotes?: string;
}

export interface HotelFacility {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  hours: string;
  location: string;
  image: string;
  features: string[];
  capacity: number;
  requiresBooking: boolean;
  slots: string[];
}

export interface FacilityReservation {
  id: string;
  roomNumber: string;
  guestName: string;
  facilityId: string;
  facilityTitle: string;
  date: string;
  timeSlot: string;
  guestCount: number;
  notes?: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface NearbyPlace {
  id: string;
  name: string;
  category: 'beaches' | 'culture' | 'dining' | 'adventure' | 'shopping';
  distance: string;
  travelTime: string;
  hours: string;
  description: string;
  highlights: string[];
  conciergeTip: string;
  image: string;
  address: string;
}

export interface ChatMessage {
  id: string;
  sender: 'guest' | 'reception';
  senderName: string;
  roomNumber: string;
  text: string;
  timestamp: string;
  isQuickAction?: boolean;
}

export interface RoomBooking {
  id: string;
  bookingRef: string;
  guestName: string;
  guestEmail: string;
  roomNumber: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'paid' | 'pending';
  specialRequests?: string;
}
