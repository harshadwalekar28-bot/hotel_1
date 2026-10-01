import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  RoomInfo,
  ViewMode,
  ResourceItem,
  CartItem,
  GuestRequest,
  RequestStatus,
  RequestPriority,
  MaintenanceTicket,
  MaintenanceStatus,
  FacilityReservation,
  RoomBooking,
  ChatMessage,
} from '../types/hotel';
import {
  INITIAL_ROOM_INFO,
  INITIAL_GUEST_REQUESTS,
  INITIAL_MAINTENANCE_TICKETS,
  INITIAL_BOOKINGS,
  INITIAL_CHAT_MESSAGES,
} from '../data/hotelData';

interface HotelContextType {
  currentRoom: RoomInfo;
  setCurrentRoom: (room: RoomInfo) => void;
  availableRooms: string[];
  switchRoom: (roomNum: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activeGuestTab: 'services' | 'dining' | 'facilities' | 'nearby' | 'chat' | 'maintenance';
  setActiveGuestTab: (tab: 'services' | 'dining' | 'facilities' | 'nearby' | 'chat' | 'maintenance') => void;
  activeStaffTab: 'overview' | 'requests' | 'maintenance' | 'reservations' | 'facilities';
  setActiveStaffTab: (tab: 'overview' | 'requests' | 'maintenance' | 'reservations' | 'facilities') => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: ResourceItem, quantity?: number, specialInstructions?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
  cartItemCount: number;

  // Requests
  requests: GuestRequest[];
  submitOrderRequest: (notes: string, priority?: RequestPriority) => GuestRequest;
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
  assignStaffToRequest: (requestId: string, staffName: string) => void;
  deleteRequest: (requestId: string) => void;

  // Maintenance
  maintenanceTickets: MaintenanceTicket[];
  submitMaintenanceTicket: (
    ticketData: Omit<MaintenanceTicket, 'id' | 'reportedAt' | 'status'>
  ) => MaintenanceTicket;
  updateTicketStatus: (ticketId: string, status: MaintenanceStatus, notes?: string) => void;
  assignTechnicianToTicket: (ticketId: string, techName: string) => void;

  // Facilities
  facilityReservations: FacilityReservation[];
  bookFacility: (data: Omit<FacilityReservation, 'id' | 'createdAt' | 'status'>) => FacilityReservation;
  cancelFacilityReservation: (id: string) => void;

  // Bookings
  roomBookings: RoomBooking[];
  updateBookingStatus: (id: string, status: RoomBooking['status']) => void;
  addBooking: (booking: Omit<RoomBooking, 'id'>) => void;

  // Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (text: string, isGuest?: boolean) => void;
  isReceptionTyping: boolean;

  // Room Identification Flow
  isRoomIdentified: boolean;
  setIsRoomIdentified: (val: boolean) => void;
  selectRoomAndProceed: (roomNumber: string, guestName?: string) => void;
  resetRoomSelection: () => void;

  // Modals
  isWifiModalOpen: boolean;
  setIsWifiModalOpen: (open: boolean) => void;

  // Notifications count for staff
  pendingRequestsCount: number;
  openMaintenanceCount: number;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  ROOM: 'aurahaven_room',
  REQUESTS: 'aurahaven_requests',
  MAINTENANCE: 'aurahaven_maintenance',
  BOOKINGS: 'aurahaven_bookings',
  CHAT: 'aurahaven_chat',
  FACILITIES: 'aurahaven_facility_res',
};

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoom, setCurrentRoomState] = useState<RoomInfo>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ROOM);
    return saved ? JSON.parse(saved) : INITIAL_ROOM_INFO;
  });

  const availableRooms = ['402', '305', '210', '502', '314', '601', '108'];

  const [viewMode, setViewMode] = useState<ViewMode>('guest');
  const [activeGuestTab, setActiveGuestTab] = useState<
    'services' | 'dining' | 'facilities' | 'nearby' | 'chat' | 'maintenance'
  >('services');
  const [activeStaffTab, setActiveStaffTab] = useState<
    'overview' | 'requests' | 'maintenance' | 'reservations' | 'facilities'
  >('overview');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [requests, setRequests] = useState<GuestRequest[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.REQUESTS);
    return saved ? JSON.parse(saved) : INITIAL_GUEST_REQUESTS;
  });

  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.MAINTENANCE);
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE_TICKETS;
  });

  const [roomBookings, setRoomBookings] = useState<RoomBooking[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CHAT);
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [facilityReservations, setFacilityReservations] = useState<FacilityReservation[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.FACILITIES);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'FRES-201',
            roomNumber: '402',
            guestName: 'Harshad Walekar',
            facilityId: 'fac-infinity-pool',
            facilityTitle: 'Horizon Infinity Pool & Sun Cabanas',
            date: '2026-10-01',
            timeSlot: '03:00 PM - 05:30 PM',
            guestCount: 2,
            notes: 'Poolside cabana #4 with sparkling water.',
            status: 'confirmed',
            createdAt: '2026-10-01 08:00',
          },
        ];
  });

  const [isWifiModalOpen, setIsWifiModalOpen] = useState(false);
  const [isReceptionTyping, setIsReceptionTyping] = useState(false);

  // Initial room identification state (handles direct QR code scan with ?room=402)
  const [isRoomIdentified, setIsRoomIdentified] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const roomParam = urlParams.get('room');
      if (roomParam) {
        return true;
      }
    }
    return localStorage.getItem('aurahaven_identified') === 'true';
  });

  // Handle ?room= URL parameter on mount from physical QR code scan
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const roomParam = urlParams.get('room');
      if (roomParam) {
        switchRoom(roomParam);
        setIsRoomIdentified(true);
        localStorage.setItem('aurahaven_identified', 'true');
      }
    }
  }, []);

  const selectRoomAndProceed = (roomNum: string, guestName?: string) => {
    switchRoom(roomNum);
    if (guestName) {
      setCurrentRoomState((prev) => ({ ...prev, guestName }));
    }
    setIsRoomIdentified(true);
    localStorage.setItem('aurahaven_identified', 'true');
  };

  const resetRoomSelection = () => {
    setIsRoomIdentified(false);
    localStorage.removeItem('aurahaven_identified');
    // Clear URL param if present
    if (typeof window !== 'undefined' && window.location.search.includes('room=')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ROOM, JSON.stringify(currentRoom));
  }, [currentRoom]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.MAINTENANCE, JSON.stringify(maintenanceTickets));
  }, [maintenanceTickets]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.BOOKINGS, JSON.stringify(roomBookings));
  }, [roomBookings]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CHAT, JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.FACILITIES, JSON.stringify(facilityReservations));
  }, [facilityReservations]);

  const setCurrentRoom = (room: RoomInfo) => {
    setCurrentRoomState(room);
  };

  const switchRoom = (roomNum: string) => {
    const match = roomBookings.find((b) => b.roomNumber === roomNum);
    if (match) {
      setCurrentRoomState({
        roomNumber: match.roomNumber,
        guestName: match.guestName,
        roomType: match.roomType,
        floor: parseInt(match.roomNumber[0], 10) || 4,
        checkInDate: match.checkIn,
        checkOutDate: match.checkOut,
        wifiStatus: 'connected',
      });
    } else {
      setCurrentRoomState({
        roomNumber: roomNum,
        guestName: `Guest of Room ${roomNum}`,
        roomType: 'Deluxe Room',
        floor: parseInt(roomNum[0], 10) || 1,
        checkInDate: '2026-10-01',
        checkOutDate: '2026-10-05',
        wifiStatus: 'connected',
      });
    }
  };

  // Cart operations
  const addToCart = (item: ResourceItem, quantity: number = 1, specialInstructions: string = '') => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id
            ? {
                ...ci,
                quantity: ci.quantity + quantity,
                specialInstructions: specialInstructions || ci.specialInstructions,
              }
            : ci
        );
      }
      return [...prev, { item, quantity, specialInstructions }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((ci) => (ci.item.id === itemId ? { ...ci, quantity } : ci))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0);
  const cartItemCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);

  // Request actions
  const submitOrderRequest = (notes: string, priority: RequestPriority = 'standard') => {
    const hasFoodOrDrinks = cart.some(
      (c) => c.item.category === 'breakfast' || c.item.category === 'dining' || c.item.category === 'drinks'
    );
    const newReq: GuestRequest = {
      id: `REQ-${Math.floor(8000 + Math.random() * 1000)}`,
      roomNumber: currentRoom.roomNumber,
      guestName: currentRoom.guestName,
      type: hasFoodOrDrinks ? 'dining' : 'amenity',
      items: [...cart],
      totalAmount: cartTotal,
      notes: notes || 'Delivered to room door.',
      status: 'pending',
      priority,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      assignedStaff: 'Pending Assignment',
    };

    setRequests((prev) => [newReq, ...prev]);
    clearCart();
    setIsCartOpen(false);

    // Send a confirmation chat message from reception
    setTimeout(() => {
      sendChatMessage(
        `Hello Mr. ${currentRoom.guestName.split(' ')[1] || 'Guest'}, your request #${newReq.id} for Room ${currentRoom.roomNumber} has been received. Our team is preparing it now with an estimated delivery in ~25 minutes.`,
        false
      );
    }, 1500);

    return newReq;
  };

  const updateRequestStatus = (requestId: string, status: RequestStatus) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status,
              completedAt: status === 'delivered' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : r.completedAt,
            }
          : r
      )
    );
  };

  const assignStaffToRequest = (requestId: string, staffName: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, assignedStaff: staffName } : r))
    );
  };

  const deleteRequest = (requestId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  // Maintenance actions
  const submitMaintenanceTicket = (
    ticketData: Omit<MaintenanceTicket, 'id' | 'reportedAt' | 'status'>
  ) => {
    const newTicket: MaintenanceTicket = {
      ...ticketData,
      id: `MNT-${Math.floor(1050 + Math.random() * 900)}`,
      reportedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'open',
    };

    setMaintenanceTickets((prev) => [newTicket, ...prev]);

    // Send chat acknowledgement
    setTimeout(() => {
      sendChatMessage(
        `Front Desk update: Maintenance ticket #${newTicket.id} (${newTicket.summary}) has been logged for Room ${newTicket.roomNumber}. Engineering is dispatching a technician according to your preferred time slot.`,
        false
      );
    }, 1200);

    return newTicket;
  };

  const updateTicketStatus = (ticketId: string, status: MaintenanceStatus, notes?: string) => {
    setMaintenanceTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status,
              resolutionNotes: notes || t.resolutionNotes,
              resolvedAt: status === 'resolved' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : t.resolvedAt,
            }
          : t
      )
    );
  };

  const assignTechnicianToTicket = (ticketId: string, techName: string) => {
    setMaintenanceTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, assignedTechnician: techName } : t))
    );
  };

  // Facilities actions
  const bookFacility = (data: Omit<FacilityReservation, 'id' | 'createdAt' | 'status'>) => {
    const newRes: FacilityReservation = {
      ...data,
      id: `FRES-${Math.floor(200 + Math.random() * 800)}`,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'confirmed',
    };
    setFacilityReservations((prev) => [newRes, ...prev]);

    setTimeout(() => {
      sendChatMessage(
        `Reservation confirmed! Your booking for ${newRes.facilityTitle} on ${newRes.date} at ${newRes.timeSlot} (${newRes.guestCount} guests) is registered. Please bring your room keycard.`,
        false
      );
    }, 1000);

    return newRes;
  };

  const cancelFacilityReservation = (id: string) => {
    setFacilityReservations((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'cancelled' } : f))
    );
  };

  // Bookings actions
  const updateBookingStatus = (id: string, status: RoomBooking['status']) => {
    setRoomBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
  };

  const addBooking = (bookingData: Omit<RoomBooking, 'id'>) => {
    const newB: RoomBooking = {
      ...bookingData,
      id: `BK-${Math.floor(9950 + Math.random() * 50)}`,
    };
    setRoomBookings((prev) => [newB, ...prev]);
  };

  // Chat actions
  const sendChatMessage = (text: string, isGuest: boolean = true) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: isGuest ? 'guest' : 'reception',
      senderName: isGuest ? currentRoom.guestName : 'Concierge Jean-Luc',
      roomNumber: currentRoom.roomNumber,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);

    // If guest sent a message, simulate smart concierge reply
    if (isGuest) {
      setIsReceptionTyping(true);
      setTimeout(() => {
        setIsReceptionTyping(false);
        const lower = text.toLowerCase();
        let reply = "Thank you for reaching out to the Front Desk. I've noted this and our team is assisting you right away.";

        if (lower.includes('checkout') || lower.includes('late')) {
          reply = `Certainly, Mr. ${currentRoom.guestName.split(' ')[1] || 'Guest'}! We have granted complimentary late checkout until 01:30 PM for Room ${currentRoom.roomNumber}. Please let us know if you need luggage assistance.`;
        } else if (lower.includes('towel') || lower.includes('linen') || lower.includes('pillow')) {
          reply = `Housekeeping has been dispatched with extra fresh plush linens to Room ${currentRoom.roomNumber}. Expect a polite knock within 15 minutes.`;
        } else if (lower.includes('wifi') || lower.includes('password') || lower.includes('internet')) {
          reply = `The guest high-speed network is "AuraHaven_Guest_Ultra5G" and the password is "AuraGuest2026". You can also tap the WiFi card in your room hub for 1-click connection!`;
        } else if (lower.includes('taxi') || lower.includes('cab') || lower.includes('car') || lower.includes('chauffeur')) {
          reply = `We would be happy to summon a luxury town car or private chauffeur to the lobby for Room ${currentRoom.roomNumber}. What time would you prefer to depart?`;
        } else if (lower.includes('pool') || lower.includes('cabana') || lower.includes('spa')) {
          reply = `Our 5th-floor horizon pool and Soma Spa are open. Towels and chilled fruit infused water are ready for you. Would you like me to reserve a poolside daybed?`;
        } else if (lower.includes('food') || lower.includes('eat') || lower.includes('dinner') || lower.includes('menu') || lower.includes('breakfast')) {
          reply = `Our in-room dining is active! You can browse the full gourmet menu under the "In-Room Dining" tab and place an order directly to Room ${currentRoom.roomNumber}.`;
        } else if (lower.includes('maintenance') || lower.includes('broken') || lower.includes('leak') || lower.includes('ac') || lower.includes('air conditioning')) {
          reply = `I apologize for any inconvenience. I have alerted our on-duty Chief Engineer David Chen to inspect Room ${currentRoom.roomNumber}. You can also submit specific timing preferences in the Maintenance tab.`;
        }

        const receptionMsg: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'reception',
          senderName: 'Concierge Jean-Luc',
          roomNumber: currentRoom.roomNumber,
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setChatMessages((prev) => [...prev, receptionMsg]);
      }, 1600);
    }
  };

  const pendingRequestsCount = requests.filter((r) => r.status === 'pending' || r.status === 'in_progress').length;
  const openMaintenanceCount = maintenanceTickets.filter((t) => t.status === 'open' || t.status === 'investigating').length;

  return (
    <HotelContext.Provider
      value={{
        currentRoom,
        setCurrentRoom,
        availableRooms,
        switchRoom,
        viewMode,
        setViewMode,
        activeGuestTab,
        setActiveGuestTab,
        activeStaffTab,
        setActiveStaffTab,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        cartItemCount,
        requests,
        submitOrderRequest,
        updateRequestStatus,
        assignStaffToRequest,
        deleteRequest,
        maintenanceTickets,
        submitMaintenanceTicket,
        updateTicketStatus,
        assignTechnicianToTicket,
        facilityReservations,
        bookFacility,
        cancelFacilityReservation,
        roomBookings,
        updateBookingStatus,
        addBooking,
        chatMessages,
        sendChatMessage,
        isReceptionTyping,
        isRoomIdentified,
        setIsRoomIdentified,
        selectRoomAndProceed,
        resetRoomSelection,
        isWifiModalOpen,
        setIsWifiModalOpen,
        pendingRequestsCount,
        openMaintenanceCount,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
