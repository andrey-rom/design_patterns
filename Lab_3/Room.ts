// Room.ts

export enum RoomType {
  STANDARD = 'Standard',
  DELUXE = 'Deluxe',
  SUITE = 'Suite',
  PRESIDENTIAL = 'Presidential'
}

export class Room {
  private roomNumber: number;
  private type: RoomType;
  private pricePerNight: number;
  private isAvailable: boolean;
  private maxOccupancy: number;

  constructor(roomNumber: number, type: RoomType, pricePerNight: number, maxOccupancy: number) {
    this.roomNumber = roomNumber;
    this.type = type;
    this.pricePerNight = pricePerNight;
    this.isAvailable = true;
    this.maxOccupancy = maxOccupancy;
  }

  // Getters and setters
  public getRoomNumber(): number {
    return this.roomNumber;
  }

  public getType(): RoomType {
    return this.type;
  }

  public getPricePerNight(): number {
    return this.pricePerNight;
  }

  public isRoomAvailable(): boolean {
    return this.isAvailable;
  }

  public setAvailability(isAvailable: boolean): void {
    this.isAvailable = isAvailable;
  }

  public getMaxOccupancy(): number {
    return this.maxOccupancy;
  }

  public toString(): string {
    return `Room ${this.roomNumber} (${this.type}): $${this.pricePerNight}/night, Max Occupancy: ${this.maxOccupancy}, Available: ${this.isAvailable ? 'Yes' : 'No'}`;
  }
} 