import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { spawnSync } from 'child_process';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { v4 } from 'uuid';

@Injectable()
export class UtilService {
	constructor(private configService: ConfigService) {}

	writeFile(data: string) {
		const id = v4();
		const file = `${id}.txt`;
		const filename = this.getFilename(file);
		writeFileSync(filename, data, { encoding: 'utf-8' });
		return file;
	}

	spawnPython<T>(file: string): T {
		const PYTHON_COMMAND =
			this.configService.getOrThrow<string>('PYTHON_COMMAND');

		const filename = this.getFilename(file);
		const pythonScript = join(__dirname, '..', '..', 'python', 'main.py');
		const pythonProcess = spawnSync(
			PYTHON_COMMAND,
			[pythonScript, '-f', filename],
			{ encoding: 'utf-8' }
		);
		const data = JSON.parse(pythonProcess.stdout) as T;
		return data;
	}

	getFilename(file: string) {
		return join(__dirname, '..', '..', 'tmp', file);
	}
}
