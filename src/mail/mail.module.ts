import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { BookingModule } from 'src/booking/booking.module';
import { UserModule } from 'src/user/user.module';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
        // or
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get('MAIL_PORT'),
          secure: false,
          ignoreTLS: true,
          // auth: {
          //   user: config.get('MAIL_USER'),
          //   pass: config.get('MAIL_PASSWORD'),
          // },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),
    BookingModule,
    UserModule,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
