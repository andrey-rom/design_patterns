import { HotelFacade } from './HotelFacade';
import { RoomType } from './Room';


function displaySeparator(): void {
  console.log('\n' + '-'.repeat(50) + '\n');
}

function runHotelBookingDemo(): void {
  console.log('Hotel Booking System Demo');
  displaySeparator();

  const hotelFacade = new HotelFacade('Grand Hotel');

  console.log('Available Rooms:');
  hotelFacade.getAvailableRooms().forEach((room) => console.log(room.toString()));
  displaySeparator();

  console.log('Booking a standard room:');
  const bookingId1 = hotelFacade.bookRoom(101, 'John Smith', new Date('2025-12-20'), new Date('2025-12-25'));
  displaySeparator();

  console.log('Booking a deluxe room:');
  const bookingId2 = hotelFacade.bookRoom(201, 'Jane Doe', new Date('2025-12-22'), new Date('2025-12-27'));
  displaySeparator();

  console.log('Available Rooms after bookings:');
  hotelFacade.getAvailableRooms().forEach((room) => console.log(room.toString()));
  displaySeparator();

  console.log('All Bookings:');
  console.log(hotelFacade.getAllBookings());
  displaySeparator();

  console.log('Confirming bookings:');
  if (bookingId1) {
    hotelFacade.confirmBooking(bookingId1);
    console.log(`Booking details after confirmation:`, hotelFacade.getBookingDetails(bookingId1));
  }

  if (bookingId2) {
    hotelFacade.confirmBooking(bookingId2);
    console.log(`Booking details after confirmation:`, hotelFacade.getBookingDetails(bookingId2));
  }
  displaySeparator();

  console.log('Check-in for booking:');
  if (bookingId1) {
    hotelFacade.checkIn(bookingId1);
    console.log(`Booking details after check-in:`, hotelFacade.getBookingDetails(bookingId1));
  }
  displaySeparator();

  console.log('Cancelling a booking:');
  if (bookingId2) {
    hotelFacade.cancelBooking(bookingId2);
    console.log(`Booking details after cancellation:`, hotelFacade.getBookingDetails(bookingId2));
  }
  displaySeparator();

  console.log('Check-out for booking:');
  if (bookingId1) {
    hotelFacade.checkOut(bookingId1);
    console.log(`Booking details after check-out:`, hotelFacade.getBookingDetails(bookingId1));
  }
  displaySeparator();

  console.log('Available Rooms after all operations:');
  hotelFacade.getAvailableRooms().forEach((room) => console.log(room.toString()));
  displaySeparator();

  console.log('Trying invalid operations:');

  console.log('Trying to book an unavailable room:');
  const invalidBookingId = hotelFacade.bookRoom(999, 'Invalid Guest', new Date(), new Date());
  console.log(`Result: ${invalidBookingId ? 'Success' : 'Failed'}`);

  console.log('Trying to check in a non-existent booking:');
  const invalidCheckIn = hotelFacade.checkIn('non-existent-id');
  console.log(`Result: ${invalidCheckIn ? 'Success' : 'Failed'}`);

  displaySeparator();
  console.log('Demo completed!');
}

runHotelBookingDemo();
