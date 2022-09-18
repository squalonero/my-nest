import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { IsNotEmpty, IsDateString } from 'class-validator';

export enum BookingStatus {
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
  @IsNotEmpty()
  status: BookingStatus;
  @IsDateString()
  date: Date;
  @IsNotEmpty()
  passengers: Passenger[];
}
