import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { BookingService } from 'src/booking/booking.service';
import { BookingStatus } from 'src/booking/dto/create-booking.dto';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private bookingService: BookingService,
    private userService: UserService,
  ) {}

  async sendUserConfirmation(user: User, token: string) {
    const { HOST, PORT } = process.env;
    const url = `${HOST}:${PORT}/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Pescaturismo Celeste: Conferma email',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        // name: user.name,
        url,
      },
    });
  }

  async sendUpdateDate(id: string, date: Date) {
    // await this.mailerService.sendMail({
    //   to: user.email,
    //   // from: '"Support Team" <support@example.com>', // override default from
    //   subject: 'Pescaturismo Celeste: Conferma email',
    //   template: './confirmation', // `.hbs` extension is appended automatically
    //   context: {
    //     // ✏️ filling curly brackets with content
    //     // name: user.name,
    //   },
    // });
  }
  async sendUpdateStatus(id: string, status: keyof typeof BookingStatus) {
    const { user, date, passengers } = await this.bookingService.findOne(id);
    const { email } = await this.userService.findOne(user.toString());
    await this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Pescaturismo Celeste: Stato prenotazione',
      template: './changeStatus', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        // name: user.name,
        date: dayjs(date).format('DD-MM-YYYY'),
        passengers,
        status,
      },
    });
  }
}
