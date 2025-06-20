// Hotel.ts

import { Room, RoomType } from './Room';
import { Booking } from './BookingState';

export class Hotel {
  private name: string;
  private rooms: Map<number, Room>;
  private bookings: Map<string, Booking>;

  constructor(name: string) {
    this.name = name;
    this.rooms = new Map<number, Room>();
    this.bookings = new Map<string, Booking>();
  }

  public getName(): string {
    return this.name;
  }

  public addRoom(room: Room): void {
    this.rooms.set(room.getRoomNumber(), room);
  }

  public getRoom(roomNumber: number): Room | undefined {
    return this.rooms.get(roomNumber);
  }

  public getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  public getAvailableRooms(): Room[] {
    return this.getAllRooms().filter(room => room.isRoomAvailable());
  }

  public getAvailableRoomsByType(type: RoomType): Room[] {
    return this.getAvailableRooms().filter(room => room.getType() === type);
  }

  public addBooking(booking: Booking): void {
    this.bookings.set(booking.getId(), booking);
    
    const room = this.rooms.get(booking.getRoomNumber());
    if (room) {
      room.setAvailability(false);
    }
  }

  public getBooking(bookingId: string): Booking | undefined {
    return this.bookings.get(bookingId);
  }

  public getAllBookings(): Booking[] {
    return Array.from(this.bookings.values());
  }

  public removeBooking(bookingId: string): boolean {
    const booking = this.bookings.get(bookingId);
    if (booking) {
      const room = this.rooms.get(booking.getRoomNumber());
      if (room) {
        room.setAvailability(true);
      }
      
      return this.bookings.delete(bookingId);
    }
    return false;
  }
} 