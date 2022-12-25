import { User } from 'src/user/user.entity';
import { BookingStatus, Passenger } from '../dto/create-booking.dto';

export class Booking {
  _id: string;
  user: User;
  status: BookingStatus;
  date: Date;
  passengers: Passenger[];
}
