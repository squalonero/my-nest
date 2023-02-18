import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, ObjectId } from 'mongoose';
import { DayAvailabilityAgg } from 'src/booking/utils/dayAvailabilityAgg';
import { MonthAvailabilityAgg } from './utils/monthAvailabilityAgg';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Availability } from './entities/availability.entity';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { UsersAgg } from './utils/usersAgg';
import { BookingDTO } from './entities/booking.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private configService: ConfigService,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    const createdBooking = new this.bookingModel(createBookingDto);
    return createdBooking.save();
    // return 'This action adds a new booking';
  }

  async findAll(page = 0): Promise<BookingDTO[]> {
    const LIMIT = this.configService.get<number>('PAGINATION_LIMIT');

    return this.bookingModel
      .aggregate(UsersAgg)
      .skip(page * LIMIT)
      .limit(LIMIT)
      .exec();
    // return `This action returns all booking`;
  }

  async getMonthAvailability(monthDate: string): Promise<Availability[]> {
    return this.bookingModel.aggregate(MonthAvailabilityAgg(monthDate));
  }

  async getDayAvailability(day: string): Promise<Availability> {
    const result: Availability[] = await this.bookingModel.aggregate(
      DayAvailabilityAgg(day),
    );

    return (
      result[0] ?? {
        _id: day,
        pending: 0,
        confirmed: 0,
        cancelled: 0,
        total: 0,
      }
    );
  }

  async findByDate(date: string): Promise<Booking[]> {
    return this.bookingModel.find({
      date: date,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  async delete(id: string) {
    try {
      console.log('delete', id);

      const ret = await this.bookingModel.deleteOne({ _id: id });
      return ret;
      // console.log('ret', ret);
    } catch (e) {
      console.log(e);
    }
  }

  async deleteMany(bookings: Booking[]) {
    const del = await this.bookingModel.deleteMany(bookings);
    return del;
  }
}
