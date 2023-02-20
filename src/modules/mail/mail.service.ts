import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class MailService {
  constructor(
    @InjectQueue('mailsend')
    private readonly mailQueue: Queue,

    private readonly mailerService: MailerService,
  ) {}

  async sendConfirmationEmail(
    email: string,
    url: string,
    txt: string,
  ): Promise<boolean> {
    try {
      await this.mailQueue.add('confirmation', {
        email,
        url,
        txt,
      });
      return true;
    } catch (err) {
      console.log('Error queueing confirmation email to user.');
      return false;
    }
  }

  public async sendMail(email: string, url: string, txt: string) {
    try {
      const data = await this.mailerService.sendMail({
        to: email,
        from: `"NTHMiLo 😎" < ${process.env.SENDER_EMAIL} >`,
        subject: '❄️ Winter Social Network ❄️',
        template: './confirmation',
        context: {
          url: url,
          txt: txt,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}
