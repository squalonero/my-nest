import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { MailService } from './../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private mailService: MailService,
    private UserService: UserService,
    private readonly ConfigService: ConfigService,
    private readonly JwtService: JwtService,
  ) {}

  async signUp(user: User) {
    const tokenDurationMins =
      this.ConfigService.get<number>('JWT_DURATION_MINS');

    const token = this.JwtService.sign({
      exp: Date.now() + 1000 * 60 * tokenDurationMins, // 10 mins
      data: { userId: user._id },
    });
    // ...
    // send confirmation mail
    await this.mailService.sendUserConfirmation(user, token);
  }
}
