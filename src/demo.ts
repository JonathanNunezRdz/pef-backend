import { TEST_TEXT } from './analysis/analysis.service';
import { numbersToWords } from './metrics/metrics.service';

function main() {
	const converted = numbersToWords(TEST_TEXT);
	console.log(converted);
}

main();
