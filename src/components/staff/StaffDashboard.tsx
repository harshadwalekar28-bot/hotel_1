import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import {
  RequestStatus,
  MaintenanceStatus,
  MaintenanceCategory,
  MaintenanceUrgency,
  RoomBooking,
} from '../../types/hotel';
import {
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wrench,
  UtensilsCrossed,
  Users,
  Search,
  Plus,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  DollarSign,
  UserCheck,
  LogOut,
  LogIn,
  Layers,
  ChevronDown,
  X,
  FileText,
  Sparkles,
  QrCode,
  FileDown,
} from 'lucide-react';

export const StaffDashboard: React.FC = () => {
  const {
    activeStaffTab,
    setActiveStaffTab,
    requests,
    updateRequestStatus,
    assignStaffToRequest,
    maintenanceTickets,
    updateTicketStatus,
    assignTechnicianToTicket,
    submitMaintenanceTicket,
    roomBookings,
    updateBookingStatus,
    addBooking,
    facilityReservations,
    cancelFacilityReservation,
    pendingRequestsCount,
    openMaintenanceCount,
  } = useHotel();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>('all');
  const [requestPriorityFilter, setRequestPriorityFilter] = useState<string>('all');
  const [maintenanceStatusFilter, setMaintenanceStatusFilter] = useState<string>('all');
  const [maintenanceUrgencyFilter, setMaintenanceUrgencyFilter] = useState<string>('all');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');

  // Modals state
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [resolveTicketModal, setResolveTicketModal] = useState<{ id: string; summary: string } | null>(null);
  const [resolveNotesInput, setResolveNotesInput] = useState('');

  // Form states for New Maintenance Ticket
  const [newTicketRoom, setNewTicketRoom] = useState('314');
  const [newTicketGuest, setNewTicketGuest] = useState('Staff Inspection');
  const [newTicketCategory, setNewTicketCategory] = useState<MaintenanceCategory>('ac_climate');
  const [newTicketSummary, setNewTicketSummary] = useState('');
  const [newTicketDescription, setNewTicketDescription] = useState('');
  const [newTicketUrgency, setNewTicketUrgency] = useState<MaintenanceUrgency>('standard');
  const [newTicketTech, setNewTicketTech] = useState('David Chen (Chief HVAC Engineer)');

  // Form states for New Room Booking
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newRoomNumber, setNewRoomNumber] = useState('502');
  const [newRoomType, setNewRoomType] = useState('Executive Garden Balcony');
  const [newCheckIn, setNewCheckIn] = useState('2026-10-02');
  const [newCheckOut, setNewCheckOut] = useState('2026-10-06');
  const [newGuestsCount, setNewGuestsCount] = useState(2);
  const [newTotalAmount, setNewTotalAmount] = useState(1850);
  const [newSpecialRequests, setNewSpecialRequests] = useState('Late arrival, high floor');

  // Available staff rosters
  const housekeepingStaff = ['Elena Rostova (Lead)', 'Marco Silva (Room Service)', 'Chloe Dubois', 'David Chen'];
  const engineeringStaff = [
    'David Chen (Chief HVAC)',
    'Tomas Ruiz (Master Plumber)',
    'Kevin Patel (AV & Systems)',
    'Sarah Vance (Electrical)',
  ];

  // Calculations for overview KPIs
  const totalBookingsCount = roomBookings.length;
  const checkedInCount = roomBookings.filter((b) => b.status === 'checked_in').length;
  const occupancyPercentage = Math.round((checkedInCount / 12) * 100); // 12 suites total
  const totalRevenue = roomBookings.reduce((sum, b) => sum + (b.paymentStatus === 'paid' ? b.totalAmount : 0), 0);

  // Filtered requests
  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.roomNumber.includes(searchQuery) ||
      r.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.items.some((i) => i.item.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = requestStatusFilter === 'all' || r.status === requestStatusFilter;
    const matchesPriority = requestPriorityFilter === 'all' || r.priority === requestPriorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Filtered maintenance tickets
  const filteredMaintenance = maintenanceTickets.filter((t) => {
    const matchesSearch =
      t.roomNumber.includes(searchQuery) ||
      t.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = maintenanceStatusFilter === 'all' || t.status === maintenanceStatusFilter;
    const matchesUrgency = maintenanceUrgencyFilter === 'all' || t.urgency === maintenanceUrgencyFilter;

    return matchesSearch && matchesStatus && matchesUrgency;
  });

  // Filtered bookings
  const filteredBookings = roomBookings.filter((b) => {
    const matchesSearch =
      b.roomNumber.includes(searchQuery) ||
      b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.bookingRef.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketSummary.trim()) return;

    submitMaintenanceTicket({
      roomNumber: newTicketRoom,
      guestName: newTicketGuest,
      category: newTicketCategory,
      summary: newTicketSummary.trim(),
      description: newTicketDescription.trim() || newTicketSummary.trim(),
      urgency: newTicketUrgency,
      preferredTime: 'Immediate',
      reportedBy: 'Staff Internal Inspection',
      assignedTechnician: newTicketTech,
    });

    setIsNewTicketModalOpen(false);
    setNewTicketSummary('');
    setNewTicketDescription('');
  };

  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    addBooking({
      bookingRef: `AH-${Math.floor(77000 + Math.random() * 900)}`,
      guestName: newGuestName.trim(),
      guestEmail: newGuestEmail.trim() || 'guest@example.com',
      roomNumber: newRoomNumber,
      roomType: newRoomType,
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      guestsCount: newGuestsCount,
      status: 'confirmed',
      totalAmount: Number(newTotalAmount),
      paymentStatus: 'paid',
      specialRequests: newSpecialRequests,
    });

    setIsNewBookingModalOpen(false);
    setNewGuestName('');
    setNewGuestEmail('');
  };

  const handleConfirmResolveTicket = () => {
    if (!resolveTicketModal) return;
    updateTicketStatus(resolveTicketModal.id, 'resolved', resolveNotesInput.trim() || 'Resolved and tested by engineering.');
    setResolveTicketModal(null);
    setResolveNotesInput('');
  };

  return (
    <div className="space-y-8">
      {/* Console Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
              Management & Operations Console
            </span>
            <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200 font-semibold">
              Live System Active
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
            Hotel Services & Maintenance Manager
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Triage in-room dining orders, dispatch housekeeping linens, manage engineering work orders, and oversee reservations.
          </p>
        </div>

        {/* Tab Quick Selector & Actions */}
        <div className="flex items-center gap-2">
          {/* Download PDF button */}
          <a
            href="/Aura_Haven_Room_QR_Cards.pdf"
            download="Aura_Haven_Room_QR_Cards.pdf"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs rounded-lg transition-colors shadow-2xs"
            title="Download multi-page ready-to-print PDF for all room acrylic stands"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download Room Cards (PDF)</span>
            <span className="sm:hidden">PDF Cards</span>
          </a>

          {/* Printable Physical Room QR Cards HTML */}
          <a
            href="/room-qr-cards.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs rounded-lg transition-colors border border-stone-300 shadow-2xs"
            title="Open printable standalone 4x6 acrylic tent cards for each hotel suite"
          >
            <QrCode className="w-3.5 h-3.5 text-stone-700" />
            <span className="hidden sm:inline">Interactive Print Sheet</span>
            <span className="sm:hidden">Print Sheet</span>
          </a>

          {activeStaffTab === 'maintenance' && (
            <button
              onClick={() => setIsNewTicketModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-amber-200 font-semibold text-xs rounded-lg transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Work Order</span>
            </button>
          )}

          {activeStaffTab === 'reservations' && (
            <button
              onClick={() => setIsNewBookingModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-amber-200 font-semibold text-xs rounded-lg transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Guest Booking</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Overview Cards (Single-elevation, no pills) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="p-4 bg-white rounded-xl border border-stone-200/90 shadow-2xs">
          <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
            Occupancy Rate
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
              {occupancyPercentage}%
            </span>
            <span className="text-xs text-stone-500 font-medium">({checkedInCount}/12 Suites)</span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-600 h-full rounded-full" style={{ width: `${occupancyPercentage}%` }}></div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 bg-white rounded-xl border border-stone-200/90 shadow-2xs">
          <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
            Pending Guest Requests
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono text-2xl font-bold text-amber-800 tabular-nums">
              {pendingRequestsCount}
            </span>
            <span className="text-xs text-stone-500 font-medium">Active in queue</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">Avg SLA: 18 min response</p>
        </div>

        {/* KPI 3 */}
        <div className="p-4 bg-white rounded-xl border border-stone-200/90 shadow-2xs">
          <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
            Open Maintenance Tickets
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono text-2xl font-bold text-rose-700 tabular-nums">
              {openMaintenanceCount}
            </span>
            <span className="text-xs text-stone-500 font-medium">Work orders</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">2 Engineers on duty</p>
        </div>

        {/* KPI 4 */}
        <div className="p-4 bg-white rounded-xl border border-stone-200/90 shadow-2xs">
          <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
            Active Bookings
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono text-2xl font-bold text-stone-900 tabular-nums">
              {totalBookingsCount}
            </span>
            <span className="text-xs text-stone-500 font-medium">Total registered</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">{checkedInCount} currently checked in</p>
        </div>

        {/* KPI 5 */}
        <div className="p-4 bg-white rounded-xl border border-stone-200/90 shadow-2xs col-span-2 lg:col-span-1">
          <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
            Revenue Today
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-mono text-2xl font-bold text-emerald-800 tabular-nums">
              ${totalRevenue.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">Room & In-Room Dining</p>
        </div>
      </div>

      {/* Staff View Navigation Tabs (Segmented Buttons) */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-200/70 rounded-xl overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveStaffTab('overview')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            activeStaffTab === 'overview'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-950'
          }`}
        >
          Operations Overview
        </button>
        <button
          onClick={() => setActiveStaffTab('requests')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeStaffTab === 'requests'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-950'
          }`}
        >
          <span>Guest Requests Queue</span>
          {pendingRequestsCount > 0 && (
            <span className="font-mono text-[10px] bg-amber-100 text-amber-900 px-1.5 rounded-sm font-bold">
              {pendingRequestsCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveStaffTab('maintenance')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
            activeStaffTab === 'maintenance'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-950'
          }`}
        >
          <span>Maintenance & Engineering</span>
          {openMaintenanceCount > 0 && (
            <span className="font-mono text-[10px] bg-rose-100 text-rose-900 px-1.5 rounded-sm font-bold">
              {openMaintenanceCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveStaffTab('reservations')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            activeStaffTab === 'reservations'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-950'
          }`}
        >
          Room Bookings ({roomBookings.length})
        </button>
        <button
          onClick={() => setActiveStaffTab('facilities')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
            activeStaffTab === 'facilities'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-950'
          }`}
        >
          Facility Bookings ({facilityReservations.length})
        </button>
      </div>

      {/* Global Search & Filter Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by room #, guest name, ticket ID, or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 text-stone-900"
          />
        </div>

        {activeStaffTab === 'requests' && (
          <div className="flex items-center gap-2">
            <select
              value={requestStatusFilter}
              onChange={(e) => setRequestStatusFilter(e.target.value)}
              className="text-xs p-1.5 border border-stone-200 rounded-lg bg-stone-50 text-stone-800 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="delivered">Delivered</option>
            </select>
            <select
              value={requestPriorityFilter}
              onChange={(e) => setRequestPriorityFilter(e.target.value)}
              className="text-xs p-1.5 border border-stone-200 rounded-lg bg-stone-50 text-stone-800 font-medium"
            >
              <option value="all">All Priorities</option>
              <option value="standard">Standard</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        )}

        {activeStaffTab === 'maintenance' && (
          <div className="flex items-center gap-2">
            <select
              value={maintenanceStatusFilter}
              onChange={(e) => setMaintenanceStatusFilter(e.target.value)}
              className="text-xs p-1.5 border border-stone-200 rounded-lg bg-stone-50 text-stone-800 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
            <select
              value={maintenanceUrgencyFilter}
              onChange={(e) => setMaintenanceUrgencyFilter(e.target.value)}
              className="text-xs p-1.5 border border-stone-200 rounded-lg bg-stone-50 text-stone-800 font-medium"
            >
              <option value="all">All Urgency</option>
              <option value="urgent">Urgent Only</option>
              <option value="standard">Standard</option>
              <option value="low">Low</option>
            </select>
          </div>
        )}

        {activeStaffTab === 'reservations' && (
          <div className="flex items-center gap-2">
            <select
              value={bookingStatusFilter}
              onChange={(e) => setBookingStatusFilter(e.target.value)}
              className="text-xs p-1.5 border border-stone-200 rounded-lg bg-stone-50 text-stone-800 font-medium"
            >
              <option value="all">All Bookings</option>
              <option value="checked_in">Checked In</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_out">Checked Out</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeStaffTab === 'overview' && (
        <div className="space-y-6">
          {/* Urgent Dispatch Triage Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Urgent Maintenance Work Orders */}
            <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-rose-50 text-rose-700 rounded-md">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-stone-900">
                      Active Maintenance Dispatch
                    </h3>
                    <p className="text-[11px] text-stone-500">Unresolved guest room work orders</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveStaffTab('maintenance')}
                  className="text-xs text-amber-800 font-semibold hover:underline"
                >
                  View All ({maintenanceTickets.length})
                </button>
              </div>

              <div className="divide-y divide-stone-100">
                {maintenanceTickets
                  .filter((t) => t.status !== 'resolved')
                  .slice(0, 4)
                  .map((ticket) => (
                    <div key={ticket.id} className="py-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-stone-900">Room {ticket.roomNumber}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-stone-500">{ticket.id}</span>
                          <span aria-hidden="true">·</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-xs text-[10px] font-semibold uppercase ${
                              ticket.urgency === 'urgent'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {ticket.urgency}
                          </span>
                        </div>
                        <p className="text-xs text-stone-800 font-medium mt-0.5">{ticket.summary}</p>
                        <p className="text-[11px] text-stone-500">
                          Assigned: {ticket.assignedTechnician || 'Unassigned'}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          updateTicketStatus(
                            ticket.id,
                            ticket.status === 'open' ? 'investigating' : 'resolved'
                          )
                        }
                        className="text-xs px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-amber-200 rounded-md font-semibold shrink-0"
                      >
                        {ticket.status === 'open' ? 'Dispatch Tech' : 'Mark Resolved'}
                      </button>
                    </div>
                  ))}
              </div>
            </div>

            {/* In-Room Requests Queue */}
            <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-50 text-amber-800 rounded-md">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-stone-900">
                      Recent Guest Room Requests
                    </h3>
                    <p className="text-[11px] text-stone-500">In-room dining and amenity deliveries</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveStaffTab('requests')}
                  className="text-xs text-amber-800 font-semibold hover:underline"
                >
                  View All ({requests.length})
                </button>
              </div>

              <div className="divide-y divide-stone-100">
                {requests
                  .filter((r) => r.status !== 'delivered')
                  .slice(0, 4)
                  .map((req) => (
                    <div key={req.id} className="py-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-stone-900">Room {req.roomNumber}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-stone-500">{req.id}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-stone-600 capitalize">{req.type}</span>
                        </div>
                        <p className="text-xs text-stone-800 font-medium mt-0.5">
                          {req.items.map((i) => `${i.quantity}x ${i.item.title}`).join(', ')}
                        </p>
                        <p className="text-[11px] text-stone-500">Assigned: {req.assignedStaff}</p>
                      </div>

                      <button
                        onClick={() =>
                          updateRequestStatus(
                            req.id,
                            req.status === 'pending' ? 'in_progress' : 'delivered'
                          )
                        }
                        className="text-xs px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-amber-200 rounded-md font-semibold shrink-0"
                      >
                        {req.status === 'pending' ? 'Start Prep' : 'Mark Delivered'}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Quick Room Occupancy Matrix */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif font-bold text-sm text-stone-900">Suite Occupancy Map</h3>
                <p className="text-xs text-stone-500">Real-time room occupancy and keycard lock status</p>
              </div>
              <span className="text-xs text-stone-600 font-mono">12 Total Suites</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {['108', '204', '210', '305', '314', '402', '405', '501', '502', '504', '601', '602'].map(
                (roomNum) => {
                  const booking = roomBookings.find((b) => b.roomNumber === roomNum);
                  const isOccupied = booking && booking.status === 'checked_in';
                  const hasMnt = maintenanceTickets.some(
                    (t) => t.roomNumber === roomNum && t.status !== 'resolved'
                  );

                  return (
                    <div
                      key={roomNum}
                      className={`p-3 rounded-xl border transition-all ${
                        isOccupied
                          ? 'bg-amber-50/40 border-amber-200'
                          : 'bg-stone-50/50 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-stone-900">
                          Suite {roomNum}
                        </span>
                        {hasMnt && (
                          <span title="Open Maintenance Ticket">
                            <Wrench className="w-3 h-3 text-rose-600" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-medium text-stone-700 mt-1 truncate">
                        {isOccupied ? booking.guestName : 'Available'}
                      </p>
                      <span
                        className={`inline-block mt-2 text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded-xs ${
                          isOccupied
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-600'
                        }`}
                      >
                        {isOccupied ? 'Occupied' : 'Vacant'}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GUEST REQUESTS QUEUE */}
      {activeStaffTab === 'requests' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">Guest Room Service Queue</h3>
              <p className="text-xs text-stone-500">Live order fulfillment and staff dispatch table</p>
            </div>
            <span className="text-xs font-mono text-stone-500 tabular-nums">
              Showing {filteredRequests.length} requests
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Room & Guest</th>
                  <th className="py-3 px-4">Items Ordered</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Assigned Staff</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{req.id}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 block">Room {req.roomNumber}</span>
                      <span className="text-[11px] text-stone-500">{req.guestName}</span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-medium text-stone-800 truncate">
                        {req.items.map((i) => `${i.quantity}x ${i.item.title}`).join(', ')}
                      </p>
                      {req.notes && (
                        <p className="text-[10px] text-stone-500 italic mt-0.5 truncate">
                          "{req.notes}"
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-500 tabular-nums">{req.createdAt}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900 tabular-nums">
                      {req.totalAmount > 0 ? `$${req.totalAmount}` : 'Free'}
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={req.assignedStaff || 'Unassigned'}
                        onChange={(e) => assignStaffToRequest(req.id, e.target.value)}
                        className="text-xs p-1 border border-stone-200 rounded-md bg-stone-50 text-stone-800"
                      >
                        <option value="Pending Assignment">Pending Assignment</option>
                        {housekeepingStaff.map((staff) => (
                          <option key={staff} value={staff}>
                            {staff}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={req.status}
                        onChange={(e) => updateRequestStatus(req.id, e.target.value as RequestStatus)}
                        className={`text-xs p-1 rounded-md font-semibold border ${
                          req.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : req.status === 'in_progress'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {req.status !== 'delivered' && (
                        <button
                          onClick={() => updateRequestStatus(req.id, 'delivered')}
                          className="px-2.5 py-1 text-xs bg-stone-900 hover:bg-stone-800 text-amber-200 font-semibold rounded-md transition-colors"
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MAINTENANCE TICKETING SYSTEM */}
      {activeStaffTab === 'maintenance' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Engineering Work Orders Board
              </h3>
              <p className="text-xs text-stone-500">Track and dispatch hotel technical and room repairs</p>
            </div>
            <button
              onClick={() => setIsNewTicketModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log New Work Order</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Ticket</th>
                  <th className="py-3 px-4">Room & Reporter</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Issue Summary</th>
                  <th className="py-3 px-4">Urgency</th>
                  <th className="py-3 px-4">Assigned Engineer</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredMaintenance.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{ticket.id}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 block">Room {ticket.roomNumber}</span>
                      <span className="text-[11px] text-stone-500">{ticket.reportedBy}</span>
                    </td>
                    <td className="py-3.5 px-4 capitalize text-stone-700">
                      {ticket.category.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="font-medium text-stone-900">{ticket.summary}</p>
                      <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                        {ticket.description}
                      </p>
                      {ticket.resolutionNotes && (
                        <p className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded-sm mt-1">
                          Resolved: {ticket.resolutionNotes}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase ${
                          ticket.urgency === 'urgent'
                            ? 'bg-rose-100 text-rose-800'
                            : ticket.urgency === 'standard'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {ticket.urgency}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={ticket.assignedTechnician || 'Unassigned'}
                        onChange={(e) => assignTechnicianToTicket(ticket.id, e.target.value)}
                        className="text-xs p-1 border border-stone-200 rounded-md bg-stone-50 text-stone-800"
                      >
                        <option value="Unassigned">Unassigned</option>
                        {engineeringStaff.map((tech) => (
                          <option key={tech} value={tech}>
                            {tech}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <select
                        value={ticket.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as MaintenanceStatus;
                          if (newStatus === 'resolved') {
                            setResolveTicketModal({ id: ticket.id, summary: ticket.summary });
                          } else {
                            updateTicketStatus(ticket.id, newStatus);
                          }
                        }}
                        className={`text-xs p-1 rounded-md font-semibold border ${
                          ticket.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : ticket.status === 'investigating'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        <option value="open">Open</option>
                        <option value="investigating">Investigating</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {ticket.status !== 'resolved' ? (
                        <button
                          onClick={() => setResolveTicketModal({ id: ticket.id, summary: ticket.summary })}
                          className="px-2.5 py-1 text-xs bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-md transition-colors"
                        >
                          Resolve
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-semibold">Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ROOM BOOKINGS & RESERVATIONS */}
      {activeStaffTab === 'reservations' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Hotel Room Booking & Folio Master
              </h3>
              <p className="text-xs text-stone-500">Manage check-in, check-out, room allocations and guest folios</p>
            </div>
            <button
              onClick={() => setIsNewBookingModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Reservation</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Guest Details</th>
                  <th className="py-3 px-4">Room & Type</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Guests</th>
                  <th className="py-3 px-4">Folio Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Check-in Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{b.bookingRef}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 block">{b.guestName}</span>
                      <span className="text-[11px] text-stone-500">{b.guestEmail}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 block">Suite {b.roomNumber}</span>
                      <span className="text-[11px] text-stone-500">{b.roomType}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-600 tabular-nums">
                      {b.checkIn} → {b.checkOut}
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums">{b.guestsCount}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900 tabular-nums">
                      ${b.totalAmount}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-semibold capitalize ${
                          b.status === 'checked_in'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : b.status === 'confirmed'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {b.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'checked_in')}
                          className="px-2.5 py-1 text-xs bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-md transition-colors"
                        >
                          Check In
                        </button>
                      )}
                      {b.status === 'checked_in' && (
                        <button
                          onClick={() => updateBookingStatus(b.id, 'checked_out')}
                          className="px-2.5 py-1 text-xs bg-stone-800 hover:bg-stone-900 text-stone-100 font-semibold rounded-md transition-colors"
                        >
                          Check Out
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: FACILITY BOOKINGS */}
      {activeStaffTab === 'facilities' && (
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Facility & Cabana Schedule
              </h3>
              <p className="text-xs text-stone-500">Guest reservations for horizon pool cabanas, Soma spa, and rooftop lounge</p>
            </div>
            <span className="text-xs font-mono text-stone-500 tabular-nums">
              {facilityReservations.length} Active Slots
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Reservation ID</th>
                  <th className="py-3 px-4">Facility</th>
                  <th className="py-3 px-4">Date & Time Slot</th>
                  <th className="py-3 px-4">Guest & Suite</th>
                  <th className="py-3 px-4">Guests</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {facilityReservations.map((f) => (
                  <tr key={f.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{f.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-stone-900">{f.facilityTitle}</td>
                    <td className="py-3.5 px-4 font-mono text-stone-600">
                      {f.date} · {f.timeSlot}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-stone-900 block">{f.guestName}</span>
                      <span className="text-[11px] text-stone-500">Suite {f.roomNumber}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums">{f.guestCount}</td>
                    <td className="py-3.5 px-4 text-stone-500 italic">{f.notes || 'None'}</td>
                    <td className="py-3.5 px-4 text-right">
                      {f.status === 'confirmed' ? (
                        <button
                          onClick={() => cancelFacilityReservation(f.id)}
                          className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                        >
                          Cancel Slot
                        </button>
                      ) : (
                        <span className="text-stone-400">Cancelled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Create New Maintenance Ticket */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-stone-50">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-serif font-bold">Log Engineering Work Order</h3>
              </div>
              <button
                onClick={() => setIsNewTicketModalOpen(false)}
                className="p-1 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Room / Location</label>
                  <input
                    type="text"
                    required
                    value={newTicketRoom}
                    onChange={(e) => setNewTicketRoom(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg text-stone-800 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Reported By</label>
                  <input
                    type="text"
                    required
                    value={newTicketGuest}
                    onChange={(e) => setNewTicketGuest(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg text-stone-800 bg-stone-50"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Category</label>
                <select
                  value={newTicketCategory}
                  onChange={(e) => setNewTicketCategory(e.target.value as MaintenanceCategory)}
                  className="w-full p-2 border border-stone-300 rounded-lg text-stone-800 bg-stone-50"
                >
                  <option value="ac_climate">AC & Climate Control</option>
                  <option value="plumbing_water">Plumbing & Water</option>
                  <option value="tv_entertainment">TV, Audio & Network</option>
                  <option value="electrical_lighting">Electrical & Lighting</option>
                  <option value="keycard_lock">Keycard Sensor & Door Locks</option>
                  <option value="furniture_fixtures">Furniture & Balcony Fixtures</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Summary Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Balcony sliding glass latch stiff"
                  value={newTicketSummary}
                  onChange={(e) => setNewTicketSummary(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg text-stone-800 bg-stone-50"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Detailed Notes</label>
                <textarea
                  rows={2}
                  value={newTicketDescription}
                  onChange={(e) => setNewTicketDescription(e.target.value)}
                  placeholder="Additional inspection details for technician..."
                  className="w-full p-2 border border-stone-300 rounded-lg text-stone-800 bg-stone-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Urgency</label>
                  <select
                    value={newTicketUrgency}
                    onChange={(e) => setNewTicketUrgency(e.target.value as MaintenanceUrgency)}
                    className="w-full p-2 border border-stone-300 rounded-lg text-stone-800 bg-stone-50"
                  >
                    <option value="low">Low Priority</option>
                    <option value="standard">Standard Priority</option>
                    <option value="urgent">Urgent Priority</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Assign Technician</label>
                  <select
                    value={newTicketTech}
                    onChange={(e) => setNewTicketTech(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg text-stone-800 bg-stone-50"
                  >
                    {engineeringStaff.map((tech) => (
                      <option key={tech} value={tech}>
                        {tech}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsNewTicketModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-200 font-semibold rounded-lg shadow-xs"
                >
                  Save & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Create New Room Booking */}
      {isNewBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-stone-50">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-serif font-bold">New Guest Reservation</h3>
              </div>
              <button
                onClick={() => setIsNewBookingModalOpen(false)}
                className="p-1 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBooking} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Guest Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lorde Alistair"
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg text-stone-800 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="guest@example.com"
                    value={newGuestEmail}
                    onChange={(e) => setNewGuestEmail(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg text-stone-800 bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Assign Suite #</label>
                  <select
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg text-stone-800 bg-stone-50"
                  >
                    <option value="108">Suite 108 (Garden King)</option>
                    <option value="204">Suite 204 (Executive)</option>
                    <option value="314">Suite 314 (Ocean Deluxe)</option>
                    <option value="501">Suite 501 (Lagoon Terrace)</option>
                    <option value="502">Suite 502 (Executive Balcony)</option>
                    <option value="602">Suite 602 (Presidential)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Suite Category</label>
                  <input
                    type="text"
                    value={newRoomType}
                    onChange={(e) => setNewRoomType(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg text-stone-800 bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Check-in Date</label>
                  <input
                    type="date"
                    value={newCheckIn}
                    onChange={(e) => setNewCheckIn(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg text-stone-800 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Check-out Date</label>
                  <input
                    type="date"
                    value={newCheckOut}
                    onChange={(e) => setNewCheckOut(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg text-stone-800 bg-stone-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Guests Count</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={newGuestsCount}
                    onChange={(e) => setNewGuestsCount(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded-lg text-stone-800 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-800 block mb-1">Total Rate ($)</label>
                  <input
                    type="number"
                    value={newTotalAmount}
                    onChange={(e) => setNewTotalAmount(Number(e.target.value))}
                    className="w-full p-2 border border-stone-300 rounded-lg text-stone-800 bg-stone-50"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Special Preferences</label>
                <input
                  type="text"
                  value={newSpecialRequests}
                  onChange={(e) => setNewSpecialRequests(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg text-stone-800 bg-stone-50"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsNewBookingModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-200 font-semibold rounded-lg shadow-xs"
                >
                  Register Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Resolve Maintenance Ticket */}
      {resolveTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-stone-50">
              <h3 className="text-base font-serif font-bold">Resolve Ticket {resolveTicketModal.id}</h3>
              <button
                onClick={() => setResolveTicketModal(null)}
                className="p-1 text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <p className="text-stone-700 font-medium">Issue: {resolveTicketModal.summary}</p>
              <div>
                <label className="font-semibold text-stone-800 block mb-1">
                  Resolution Notes & Actions Performed
                </label>
                <textarea
                  rows={3}
                  value={resolveNotesInput}
                  onChange={(e) => setResolveNotesInput(e.target.value)}
                  placeholder="e.g. Replaced AC air filter, cleared drain line, tested with guest..."
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800 bg-stone-50"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-stone-50 border-t border-stone-200 text-xs">
              <button
                onClick={() => setResolveTicketModal(null)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResolveTicket}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-xs"
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
