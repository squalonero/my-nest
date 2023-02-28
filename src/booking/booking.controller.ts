import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { configService } from 'src/main';
import { UserService } from 'src/user/user.service';
import { BookingService } from './booking.service';
import { BookingStatus, CreateBookingDto } from './dto/create-booking.dto';
import { ErrorResponseDto } from './dto/response-dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Availability } from './entities/availability.entity';
import { BookingDTO } from './entities/booking.entity';
import { Booking, BookingDocument } from './schemas/booking.schema';

@Controller('booking')
export class BookingController {
  private MAX_PPL = parseInt(configService.get('MAX_PEOPLE_PER_DAY'));

  constructor(
    private readonly bookingService: BookingService,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<Booking | ErrorResponseDto> {
    const { user, ...booking } = createBookingDto;

    // creates the user
    const bookingToSave = {
      user: await this.userService.findOrCreate(user),
      ...booking,
    };
    // Send email confirmation
    this.authService.signUp(bookingToSave.user);

    //check availability before save
    const { total: totalBooked } = await this.getDayAvailability(
      bookingToSave.date,
    );

    if (totalBooked + bookingToSave.passengers.length <= this.MAX_PPL) {
      bookingToSave.status = BookingStatus.PENDING_EMAIL;
      return this.bookingService.create(bookingToSave);
    } else {
      return {
        error: `Max ${this.MAX_PPL} people per day exceeded`,
      };
    }
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @Query('page') page: string,
    @Query('date') date: string | undefined,
  ): Promise<BookingDTO[] | ErrorResponseDto> {
    if (!dayjs(date).isValid()) return { error: 'Invalid date' };
    return this.bookingService.findAll(page, date);
  }

  @Get('count')
  async findAllCount(
    @Req() req: Request,
    @Query('date') date: string | undefined,
  ): Promise<number | ErrorResponseDto> {
    if (!dayjs(date).isValid()) return { error: 'Invalid date' };
    return this.bookingService.findAllCount(date);
  }

  @Get('getMonthAvailability')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getMonthAvailability(
    @Query('date') monthDate: string,
  ): Promise<Availability[]> {
    return this.bookingService.getMonthAvailability(monthDate);
  }

  @Get('getDayAvailability')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getDayAvailability(
    @Query('date') dayDate: string,
  ): Promise<Availability> {
    return this.bookingService.getDayAvailability(dayDate);
  }

  @Get('findByDate')
  async findByDate(
    @Req() req: Request,
    @Query('date') date: string,
  ): Promise<Booking[]> {
    return this.bookingService.findByDate(date);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Booking> {
    return this.bookingService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ): Promise<number> {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    this.bookingService.delete(id);
  }
}
