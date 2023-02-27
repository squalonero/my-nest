import { BookingStatus, Passenger } from '../dto/create-booking.dto';

export class BookingDTO {
  _id: string;
  user: string;
  status: BookingStatus;
  date: Date;
  passengers: Passenger[];
}
