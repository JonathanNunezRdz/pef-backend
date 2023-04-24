import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { spawnSync } from 'child_process';
import { rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { v4 } from 'uuid';

@Injectable()
/**
 * Service that houses various helper functions used throughout the app system.
 */
export class UtilService {
	constructor(private configService: ConfigService) {}

	validateUrl(url: string) {
		try {
			new URL(url);
			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Save text to file in /tmp
	 * @param data raw text to save
	 * @returns filename for further use
	 */
	writeFile(data: string) {
		const id = v4();
		const file = `${id}.txt`;
		const filename = this.getFilename(file);
		writeFileSync(filename, data, { encoding: 'utf-8' });
		return file;
	}

	/**
	 * Run python script to extract basic metrics from text file
	 * @param file filename in /tmp
	 * @returns data parsed as specified in generics
	 */
	spawnPython<T>(file: string): T {
		const PYTHON_COMMAND =
			this.configService.getOrThrow<string>('PYTHON_COMMAND');

		const filename = this.getFilename(file);
		const pythonScript = join(
			__dirname,
			'..',
			'..',
			'..',
			'python',
			'main.py'
		);
		const pythonProcess = spawnSync(
			PYTHON_COMMAND,
			[pythonScript, '-f', filename],
			{ encoding: 'utf-8' }
		);
		const data = JSON.parse(pythonProcess.stdout) as T;
		return data;
	}

	/**
	 * Delete a file from /tmp
	 * @param file file to delete
	 */
	deleteFile(file: string) {
		const filename = this.getFilename(file);
		try {
			rmSync(filename);
		} catch (error) {
			console.error(error);
		}
	}

	/**
	 * Get the full path for given file
	 * @param file filename saved
	 * @returns full path for given file in /tmp
	 */
	getFilename(file: string) {
		return join(__dirname, '..', '..', '..', 'tmp', file);
	}

	sleep(ms: number) {
		return new Promise<void>((resolve) => {
			setTimeout(() => {
				resolve();
			}, ms);
		});
	}
}
