import {
	BadRequestException,
	Injectable,
	NotAcceptableException,
} from '@nestjs/common';
import { convert } from 'html-to-text';
import pdf from 'pdf-parse';
import WordExtractor from 'word-extractor';

@Injectable()
/**
 * Service that houses various helper functions used throughout the app system.
 */
export class UtilService {
	async extractTextFromUrl(url: string) {
		if (!this.validateUrl(url))
			throw new BadRequestException('URL no válido');

		const res = await fetch(url, {
			method: 'GET',
		});
		const page = await res.text();
		const parsedText = convert(page, {
			selectors: [
				{ selector: 'a', options: { ignoreHref: true } },
				{ selector: 'img', format: 'skip' },
			],
		});

		return parsedText;
	}

	async extractTextFromFile(document: Express.Multer.File) {
		// if format is .pdf
		if (document.mimetype === 'application/pdf') {
			const result = await pdf(document.buffer);
			return result.text;
		}
		// if format is .txt
		else if (document.mimetype === 'text/plain') {
			return document.buffer.toString();
		}
		// if format is .doc/.docx
		else if (this.validateDOCX(document.mimetype)) {
			const extractor = new WordExtractor();
			const parsedDocument = await extractor.extract(document.buffer);
			return parsedDocument.getBody();
		} else {
			throw new NotAcceptableException('Formato de archivo no válido');
		}
	}

	validateDOCX(mimetype: string) {
		if (
			/(application\/msword|application\/vnd.openxmlformats-officedocument.wordprocessingml.document)/.test(
				mimetype
			)
		)
			return true;
		return false;
	}

	validateUrl(url: string) {
		try {
			new URL(url);
			return true;
		} catch (error) {
			return false;
		}
	}

	sleep(ms: number) {
		return new Promise<void>((resolve) => {
			setTimeout(() => {
				resolve();
			}, ms);
		});
	}
}
