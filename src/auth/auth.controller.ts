import { Controller, Get, Query, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

      const { exp, userId } = isValidJWT;

      if (exp < Date.now())
        return {
          error: 'token expired',
        };
    } catch (e) {
      return {
        error: 'invalid token',
      };
    }

    //find bookings by userID

    return {
      verified: 'yes',
    };
  }
}
