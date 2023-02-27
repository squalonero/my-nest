import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { MailService } from './../mail/mail.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private mailService: MailService,
    private UserService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(user: CreateUserDto) {
    // const token = Math.floor(1000 + Math.random() * 9000).toString();
    // create user in db
    const userInstance = await this.UserService.findOrCreate(user);

    const { _id: userID } = userInstance;
    const token = this.jwtService.sign({
      exp: Date.now() + 1000 * 60 * 10, // 10 mins
      data: { userId: userID },
    });
    // ...
    // send confirmation mail
    await this.mailService.sendUserConfirmation(userInstance, token);
  }
}
