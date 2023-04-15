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
import { MailService } from 'src/mail/mail.service';

@Controller('booking')
export class BookingController {
  private MAX_PPL = parseInt(configService.get('MAX_PEOPLE_PER_DAY'));

  constructor(
    private mailService: MailService,
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

    if (!bookingToSave.user.isNew && !bookingToSave.user.confirmed) {
      this.authService.signUp(bookingToSave.user);
      return {
        error:
          'Per favore conferma la tua email. Ti abbiamo inviato una nuova richiesta di conferma, controlla la tua casella di posta.',
      };
    }

    if (bookingToSave.user.isNew) {
      // Send email confirmation only to new users
      bookingToSave.status = BookingStatus.PENDING_EMAIL;
      this.authService.signUp(bookingToSave.user);
      bookingToSave.user.save();
    } else {
      bookingToSave.status = BookingStatus.PENDING;
    }
    //check availability before save
    const { total: totalBooked } = await this.getDayAvailability(
      bookingToSave.date,
    );

    if (totalBooked + bookingToSave.passengers.length <= this.MAX_PPL) {
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
    // @Query('page') page: string,
    @Query('date') date: string | undefined,
  ): Promise<BookingDTO[] | ErrorResponseDto> {
    if (!dayjs(date).isValid()) return { error: 'Invalid date' };
    return this.bookingService.findAll(date);
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
    const { date, status } = updateBookingDto;
    if (date) {
      this.mailService.sendUpdateDate(id, date);
    }
    if (status) {
      this.mailService.sendUpdateStatus(id, status);
    }
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    this.bookingService.delete(id);
  }
}
