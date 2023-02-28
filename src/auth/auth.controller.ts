import { Controller, Get, Query, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BookingService } from 'src/booking/booking.service';
import { BookingStatus } from 'src/booking/dto/create-booking.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly bookingService: BookingService,
  ) {}

  /**
   * User email confirmation
   * It should validate the token and change the status of all the documents
   * assigned to this user to "PENDING"
   * @param req
   * @returns
   */
  @Get('confirm')
  async verify(@Req() req: Request, @Query('token') token: string) {
    const secret = this.configService.get<string>('JWT_SECRET');

    try {
      const isValidJWT = this.jwtService.verify(token, { secret });

      const { exp, data } = isValidJWT;

      if (exp < Date.now())
        return {
          error: 'token expired',
        };

      const updatedStatus = await this.bookingService.updateStatusByUserId(
        data.userId,
        BookingStatus.PENDING,
      );

      return {
        verified: true,
        updated: updatedStatus,
      };
    } catch (e) {
      return {
        error: 'invalid token or error',
      };
    }
  }
}
