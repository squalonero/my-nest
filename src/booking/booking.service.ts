import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, ObjectId, Types } from 'mongoose';
import { DayAvailabilityAgg } from 'src/booking/utils/dayAvailabilityAgg';
import { MonthAvailabilityAgg } from './utils/monthAvailabilityAgg';
import { BookingStatus, CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Availability } from './entities/availability.entity';
import { Booking, BookingDocument } from './schemas/booking.schema';
import { UsersAgg } from './utils/usersAgg';
import { BookingDTO } from './entities/booking.entity';
import * as dayjs from 'dayjs';
import { formatUpdateBookingDto } from './utils/utils';
dayjs.locale('it');

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

  async findAll(date): Promise<BookingDTO[]> {
    // const LIMIT = parseInt(this.configService.get<string>('PAGINATION_LIMIT'));

    if (!date) date = dayjs().startOf('day').add(1, 'day').toDate();

    date = dayjs(date).startOf('day').toDate();

    return (
      this.bookingModel
        .aggregate(UsersAgg(date))
        // .skip(parseInt(page) * LIMIT)
        // .limit(LIMIT)
        .exec()
    );
    // return `This action returns all booking`;
  }

  async findAllCount(date): Promise<number> {
    const LIMIT = parseInt(this.configService.get<string>('PAGINATION_LIMIT'));

    if (!date) date = dayjs().startOf('day').add(1, 'day').toDate();

    date = dayjs(date).startOf('day').toDate();

    const data = await this.bookingModel.aggregate(UsersAgg(date)).exec();
    return data.length;
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
      date,
    });
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    return this.bookingModel.find({
      user: userId,
    });
  }

  async findOne(id: string): Promise<Booking> {
    return this.bookingModel.findOne({
      _id: id,
    });
  }

  async update(
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<number> {
    updateBookingDto = formatUpdateBookingDto(updateBookingDto);
    const updated = await this.bookingModel.updateOne({ _id: id }, [
      {
        $set: updateBookingDto,
      },
    ]);
    return updated.modifiedCount;
  }

  async updateStatusByUserId(
    userId: string,
    status: BookingStatus,
  ): Promise<number> {
    const updated = await this.bookingModel.updateMany(
      { user: userId },
      { $set: { status: status } },
    );
    return updated.modifiedCount;
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
