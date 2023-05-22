import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SendGrid, { MailDataRequired } from '@sendgrid/mail';

@Injectable()
export class EmailService {
	constructor(readonly config: ConfigService) {
		const sendgridApiKey = config.getOrThrow<string>('SENDGRID_API_KEY');
		SendGrid.setApiKey(sendgridApiKey);
	}

	async sendMail(data: MailDataRequired) {
		const transport = await SendGrid.send(data);
		return transport;
	}

	async sendAccountCreation(name: string, to: string) {
		return this.sendMail({
			to,
			from: {
				email: 'jonathan.nunez@udem.edu',
				name: 'Legibilidad Udem',
			},
			subject: 'Cuenta creada exitosamente',
			text: `Bienvenido, ${name}! Gracias por registrarte en Lee. Con tu cuentra prodrás ver los resultados de los análisis que hayas realizado.`,
			html: `<div><h3>Bienvenido, ${name}!</h3><strong>Gracias por registrarte en Lee. Con tu cuentra prodrás ver los resultados de los análisis que hayas realizado.</strong></div>`,
		});
	}
}
