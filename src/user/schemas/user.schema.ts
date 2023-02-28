import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema() //maps this class to a collection called "Users" automatically
export class User {
  @Prop()
  id: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop({ default: false })
  confirmed: boolean;

  get _id(): string {
    return this._id.toString();
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
