import { User } from 'src/user/entities/user.entity';
import { BookingStatus, Passenger } from '../dto/create-booking.dto';

export class Booking {
  id: string;
  user: User;
  status: BookingStatus;
  date: Date;
  passengers: Passenger[];
}
