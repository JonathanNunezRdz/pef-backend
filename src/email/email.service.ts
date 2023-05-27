import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SendGrid, { MailDataRequired } from '@sendgrid/mail';

@Injectable()
export class EmailService {
	constructor(private readonly config: ConfigService) {
		const sendgridApiKey = config.getOrThrow<string>('SENDGRID_API_KEY');
		SendGrid.setApiKey(sendgridApiKey);
	}

	async sendMail(data: MailDataRequired) {
		const transport = await SendGrid.send(data);
		return transport;
	}

	async sendAccountCreation(name: string, to: string) {
		const email = this.config.getOrThrow<string>('SENDGRID_EMAIL');
		const emailName = this.config.getOrThrow<string>('SENDGRID_NAME');
		return this.sendMail({
			to,
			from: {
				email,
				name: emailName,
			},
			subject: 'Cuenta creada exitosamente',
			text: `Bienvenido, ${name}! Gracias por registrarte en Lee. Con tu cuentra prodrás ver los resultados de los análisis que hayas realizado.`,
			html: `<div><h3>Bienvenido, ${name}!</h3><strong>Gracias por registrarte en Lee. Con tu cuentra prodrás ver los resultados de los análisis que hayas realizado.</strong></div>`,
		});
	}
}
