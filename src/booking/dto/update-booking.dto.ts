import { Prop } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { BookingStatus, Passenger } from './create-booking.dto';

// export class UpdateBookingDto extends PartialType(CreateBookingDto) {}
export class UpdateBookingDto {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user?: User;
  status?: keyof typeof BookingStatus;
  date?: Date;
  passengers?: Passenger[];
}
