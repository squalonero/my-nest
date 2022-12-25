import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { IsNotEmpty, IsDateString } from 'class-validator';

export enum BookingStatus {
  PENDING_EMAIL = 'PENDING_EMAIL_CONFIRMATION',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export type Passenger = {
  name: string;
  lastName: string;
  age: number;
};

export class CreateBookingDto {
  @IsNotEmpty()
  user: CreateUserDto;
  status: BookingStatus;
  @IsDateString()
  date: string;
  @IsNotEmpty()
  passengers: Passenger[];
}
