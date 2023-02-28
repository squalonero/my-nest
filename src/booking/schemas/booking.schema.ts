import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as S } from 'mongoose';
import { BookingStatus, Passenger } from 'src/booking/dto/create-booking.dto';
import { User } from 'src/user/schemas/user.schema';

export type BookingDocument = Booking & Document;

@Schema() //maps this class to a collection called "bookings" automatically
export class Booking {
  @Prop()
  id: S.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop()
  status: BookingStatus;

  @Prop({ required: true })
  date: Date;

  @Prop()
  passengers: Passenger[];
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
