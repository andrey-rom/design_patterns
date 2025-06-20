import { Hotel } from './Hotel';
import { Room, RoomType } from './Room';
import { Booking } from './BookingState';
import { v4 as uuidv4 } from 'uuid'; 
export class HotelFacade {
  private hotel: Hotel;

  constructor(hotelName: string) {
    this.hotel = new Hotel(hotelName);
    this.initializeHotel(); 
  }

  private initializeHotel(): void {
    this.hotel.addRoom(new Room(101, RoomType.STANDARD, 100, 2));
    this.hotel.addRoom(new Room(102, RoomType.STANDARD, 100, 2));
    this.hotel.addRoom(new Room(201, RoomType.DELUXE, 150, 2));
    this.hotel.addRoom(new Room(202, RoomType.DELUXE, 150, 2));
    this.hotel.addRoom(new Room(301, RoomType.SUITE, 250, 4));
    this.hotel.addRoom(new Room(401, RoomType.PRESIDENTIAL, 500, 4));
  }

  public getAvailableRooms(): Room[] {
    return this.hotel.getAvailableRooms();
  }

  public getAvailableRoomsByType(roomType: RoomType): Room[] {
    return this.hotel.getAvailableRoomsByType(roomType);
  }

  public bookRoom(roomNumber: number, guestName: string, checkInDate: Date, checkOutDate: Date): string | null {
    const room = this.hotel.getRoom(roomNumber);
    
    if (!room || !room.isRoomAvailable()) {
      console.log(`Room ${roomNumber} is not available for booking.`);
      return null;
    }

    const bookingId = uuidv4();
    const booking = new Booking(bookingId, roomNumber, guestName, checkInDate, checkOutDate);
    
    
    this.hotel.addBooking(booking);
    
    console.log(`Room ${roomNumber} has been booked for ${guestName}. Booking ID: ${bookingId}`);
    return bookingId;
  }

  
  public confirmBooking(bookingId: string): boolean {
    const booking = this.hotel.getBooking(bookingId);
    
    if (!booking) {
      console.log(`Booking with ID ${bookingId} not found.`);
      return false;
    }

    booking.confirm();
    return true;
  }

  
  public cancelBooking(bookingId: string): boolean {
    const booking = this.hotel.getBooking(bookingId);
    
    if (!booking) {
      console.log(`Booking with ID ${bookingId} not found.`);
      return false;
    }

    booking.cancel();
    
    
    const room = this.hotel.getRoom(booking.getRoomNumber());
    if (room) {
      room.setAvailability(true);
    }
    
    return true;
  }

  
  public checkIn(bookingId: string): boolean {
    const booking = this.hotel.getBooking(bookingId);
    
    if (!booking) {
      console.log(`Booking with ID ${bookingId} not found.`);
      return false;
    }

    booking.checkIn();
    return true;
  }

  
  public checkOut(bookingId: string): boolean {
    const booking = this.hotel.getBooking(bookingId);
    
    if (!booking) {
      console.log(`Booking with ID ${bookingId} not found.`);
      return false;
    }

    booking.checkOut();
    
    
    const room = this.hotel.getRoom(booking.getRoomNumber());
    if (room) {
      room.setAvailability(true);
    }
    
    return true;
  }

  public getBookingDetails(bookingId: string): any | null {
    const booking = this.hotel.getBooking(bookingId);
    
    if (!booking) {
      console.log(`Booking with ID ${bookingId} not found.`);
      return null;
    }

    return {
      id: booking.getId(),
      guestName: booking.getGuestName(),
      roomNumber: booking.getRoomNumber(),
      checkInDate: booking.getCheckInDate(),
      checkOutDate: booking.getCheckOutDate(),
      status: booking.getState().getName()
    };
  }

  public getAllBookings(): any[] {
    return this.hotel.getAllBookings().map(booking => ({
      id: booking.getId(),
      guestName: booking.getGuestName(),
      roomNumber: booking.getRoomNumber(),
      checkInDate: booking.getCheckInDate(),
      checkOutDate: booking.getCheckOutDate(),
      status: booking.getState().getName()
    }));
  }
} 