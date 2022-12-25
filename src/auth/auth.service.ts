import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { MailService } from './../mail/mail.service';
import { User } from './../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private mailService: MailService,
    private UserService: UserService,
  ) {}

  async signUp(user: User) {
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    // create user in db
    const userInstance = await this.UserService.findOrCreate(user);
    // ...
    // send confirmation mail
    await this.mailService.sendUserConfirmation(userInstance, token);
  }
}
