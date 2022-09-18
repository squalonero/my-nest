import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { BookingStatus, Passenger } from '../dto/create-booking.dto';

export interface BookingI {
  user: CreateUserDto;
  status: BookingStatus;
  date: Date;
  numPeople: number;
  people: Passenger[];
}
