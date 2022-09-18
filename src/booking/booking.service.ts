import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Availability } from './entities/availability.entity';
import { Booking, BookingDocument } from './schemas/booking.schema';

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

  async findAll(page = 0): Promise<Booking[]> {
    const LIMIT = this.configService.get<number>('PAGINATION_LIMIT');

    return this.bookingModel
      .find()
      .skip(page * LIMIT)
      .limit(LIMIT)
      .exec();
    // return `This action returns all booking`;
  }

  async getMonthAvailability(monthDate: string): Promise<Availability[]> {
    const result = await this.bookingModel.aggregate([
      {
        $project: {
          dateString: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$date',
            },
          },
          month: { $month: '$date' },
          year: { $year: '$date' },
          status: 1,
        },
      },
      {
        $match: {
          $and: [
            {
              $expr: {
                $eq: [{ $month: new Date(monthDate) }, '$month'],
              },
            },
            {
              $expr: {
                $eq: [{ $year: new Date(monthDate) }, '$year'],
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: '$dateString',
          pending: { $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] } },
          confirmed: {
            $sum: { $cond: [{ $eq: ['$status', 'CONFIRMED'] }, 1, 0] },
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'CANCELLED'] }, 1, 0] },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return result;
  }

  async getDayAvailability(day: string): Promise<Availability> {
    const result: Availability[] = await this.bookingModel.aggregate([
      {
        $project: {
          dateString: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$date',
            },
          },
          month: { $month: '$date' },
          year: { $year: '$date' },
          status: 1,
        },
      },
      {
        $match: {
          $expr: {
            $eq: [day, '$dateString'],
          },
        },
      },
      {
        $group: {
          _id: '$dateString',
          pending: { $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] } },
          confirmed: {
            $sum: { $cond: [{ $eq: ['$status', 'CONFIRMED'] }, 1, 0] },
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$status', 'CANCELLED'] }, 1, 0] },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

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

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
