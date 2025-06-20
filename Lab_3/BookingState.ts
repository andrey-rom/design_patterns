
export class Booking {
  private state: BookingState;
  private id: string;
  private roomNumber: number;
  private guestName: string;
  private checkInDate: Date;
  private checkOutDate: Date;

  constructor(id: string, roomNumber: number, guestName: string, checkInDate: Date, checkOutDate: Date) {
    this.id = id;
    this.roomNumber = roomNumber;
    this.guestName = guestName;
    this.checkInDate = checkInDate;
    this.checkOutDate = checkOutDate;
   
    this.state = new NewBookingState();
  }

  
  public changeState(state: BookingState): void {
    this.state = state;
  }

  public confirm(): void {
    this.state.confirm(this);
  }

  public cancel(): void {
    this.state.cancel(this);
  }

  public checkIn(): void {
    this.state.checkIn(this);
  }

  public checkOut(): void {
    this.state.checkOut(this);
  }

  
  public getId(): string {
    return this.id;
  }

  public getRoomNumber(): number {
    return this.roomNumber;
  }

  public getGuestName(): string {
    return this.guestName;
  }

  public getCheckInDate(): Date {
    return this.checkInDate;
  }

  public getCheckOutDate(): Date {
    return this.checkOutDate;
  }

  public getState(): BookingState {
    return this.state;
  }
}


export interface BookingState {
  confirm(booking: Booking): void;
  cancel(booking: Booking): void;
  checkIn(booking: Booking): void;
  checkOut(booking: Booking): void;
  getName(): string;
}


export class NewBookingState implements BookingState {
  confirm(booking: Booking): void {
    console.log(`Booking ${booking.getId()} has been confirmed.`);
    booking.changeState(new ConfirmedBookingState());
  }

  cancel(booking: Booking): void {
    console.log(`Booking ${booking.getId()} has been cancelled.`);
    booking.changeState(new CancelledBookingState());
  }

  checkIn(booking: Booking): void {
    console.log(`Cannot check in - booking ${booking.getId()} is not confirmed yet.`);
  }

  checkOut(booking: Booking): void {
    console.log(`Cannot check out - booking ${booking.getId()} is not checked in.`);
  }

  getName(): string {
    return 'New';
  }
}

export class ConfirmedBookingState implements BookingState {
  confirm(booking: Booking): void {
    console.log(`Booking ${booking.getId()} is already confirmed.`);
  }

  cancel(booking: Booking): void {
    console.log(`Confirmed booking ${booking.getId()} has been cancelled.`);
    booking.changeState(new CancelledBookingState());
  }

  checkIn(booking: Booking): void {
    console.log(`Guest ${booking.getGuestName()} has checked in to room ${booking.getRoomNumber()}.`);
    booking.changeState(new CheckedInBookingState());
  }

  checkOut(booking: Booking): void {
    console.log(`Cannot check out - booking ${booking.getId()} is not checked in yet.`);
  }

  getName(): string {
    return 'Confirmed';
  }
}

export class CancelledBookingState implements BookingState {
  confirm(booking: Booking): void {
    console.log(`Cannot confirm booking ${booking.getId()} - it has been cancelled.`);
  }

  cancel(booking: Booking): void {
    console.log(`Booking ${booking.getId()} is already cancelled.`);
  }

  checkIn(booking: Booking): void {
    console.log(`Cannot check in - booking ${booking.getId()} has been cancelled.`);
  }

  checkOut(booking: Booking): void {
    console.log(`Cannot check out - booking ${booking.getId()} has been cancelled.`);
  }

  getName(): string {
    return 'Cancelled';
  }
}

export class CheckedInBookingState implements BookingState {
  confirm(booking: Booking): void {
    console.log(`Booking ${booking.getId()} is already confirmed and checked in.`);
  }

  cancel(booking: Booking): void {
    console.log(`Cannot cancel booking ${booking.getId()} - guest has already checked in.`);
  }

  checkIn(booking: Booking): void {
    console.log(`Guest ${booking.getGuestName()} is already checked in to room ${booking.getRoomNumber()}.`);
  }

  checkOut(booking: Booking): void {
    console.log(`Guest ${booking.getGuestName()} has checked out from room ${booking.getRoomNumber()}.`);
    booking.changeState(new CompletedBookingState());
  }

  getName(): string {
    return 'CheckedIn';
  }
}

export class CompletedBookingState implements BookingState {
  confirm(booking: Booking): void {
    console.log(`Booking ${booking.getId()} is already completed.`);
  }

  cancel(booking: Booking): void {
    console.log(`Cannot cancel booking ${booking.getId()} - it is already completed.`);
  }

  checkIn(booking: Booking): void {
    console.log(`Cannot check in - booking ${booking.getId()} is already completed.`);
  }

  checkOut(booking: Booking): void {
    console.log(`Booking ${booking.getId()} is already checked out.`);
  }

  getName(): string {
    return 'Completed';
  }
} 