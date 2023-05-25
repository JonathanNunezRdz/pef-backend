export function numToWord(num: number, currency?: string) {
	// TODO: continue writing the python implementation to convert a number to worded number
	num = round(num);
	// change on the future to use decimal.js library [https://mikemcl.github.io/decimal.js/#toDP]
	// native Math api from node doesn't have the right behavior on different precisions
	const [integer, decimal] = separateNumber(num);

	let entero = '';
	let fraccion = '';
	if (currency) {
		const choosenCurrency = MONEDAS.find(
			(curr) => curr.currency === currency
		);
		if (!choosenCurrency) throw new Error('moneda invalida');

		if (parseInt(integer) === 1) entero = choosenCurrency.singular;
		else {
			entero = choosenCurrency.plural;
			if (decimal === '01')
				fraccion = choosenCurrency.decimalsingular as string;
			else fraccion = choosenCurrency.decimalplural as string;
		}
	}

	const humanReadable: [string, string][] = [];
	const humanReadableDecimal: [string, string][] = [];
	const numUnits = integer.split(',');
	const numDecimals = [decimal];

	numUnits.forEach((num, i) => {
		if (Number(num) !== 0) {
			try {
				const words = hundredsWords(Number(num));
				const units =
					UNITS[numUnits.length - i - 1][Number(num) === 1 ? 0 : 1];
				humanReadable.push([words, units]);
			} catch (error) {
				console.log('trono en:', num);
				throw error;
			}
		}
	});
	numDecimals.forEach((num, i) => {
		if (Number(num) !== 0) {
			const words = hundredsWords(Number(num));
			const units =
				UNITS[numDecimals.length - i - 1][Number(num) === 1 ? 0 : 1];
			humanReadableDecimal.push([words, units]);
		}
	});

	humanReadable.forEach((item, i, arr) => {
		try {
			if (item[1].includes(arr[i + 1][1]))
				item[1] = item[1].replace(arr[i + 1][1], '');
		} catch (error) {}
	});

	const integerParts = [
		...humanReadable.reduce((acc, curr) => [...acc, ...curr], []),
		entero,
	];

	humanReadableDecimal.forEach((item, i, arr) => {
		try {
			if (item[1].includes(arr[i + 1][1]))
				item[1] = item[1].replace(arr[i + 1][1], '');
		} catch (error) {}
	});

	const decimalParts = [
		...humanReadableDecimal.reduce((acc, curr) => [...acc, ...curr], []),
		fraccion,
	];

	let sentence = capitalize(integerParts.join(' ')).trim();
	if (sentence.slice(0, 7) === 'Un Mil ')
		sentence = 'Mil' + sentence.slice(6);
	if (numDecimals[0] !== '00')
		sentence =
			sentence + ' con ' + capitalize(decimalParts.join(' ').trim());

	return sentence.replace(/\s+/g, ' ');
}

function hundredsWords(num: number) {
	let converted = '';
	if (num > 1000 || num < 0)
		throw new Error("can't parse numbers where 0 < num < 1000");

	const numStr = `000000000${num}`.slice(-9);
	const cientos = numStr.slice(6);

	if (cientos) {
		if (cientos === '001') converted += UNIDADES[1];
		else if (parseInt(cientos) > 0) converted += convertGroup(cientos);
	}

	return capitalize(converted).trim();
}

function convertGroup(group: string) {
	let output = '';
	if (group === '100') output = DECENAS[DECENAS.length - 1];
	else if (group[0] !== '0') output = CENTENAS[parseInt(group[0]) - 1];

	const k = parseInt(group.slice(1));

	if (k <= 20) output += UNIDADES[k];
	else if (k > 30 && group[2] !== '0')
		output += `${DECENAS[parseInt(group[1]) - 2]}Y ${
			UNIDADES[parseInt(group[2])]
		}`;
	else
		output += `${DECENAS[parseInt(group[1]) - 2]}${
			UNIDADES[parseInt(group[2])]
		}`;

	return output;
}

function separateNumber(num: number): [string, string] {
	const pair = num.toString().split('.');
	if (pair.length === 1) pair.push('00');
	const integer = pair.shift();
	if (!integer) throw new Error('error at parsing number');
	const decimal = pair.pop();
	if (!decimal) throw new Error('error at parsing number');
	return [numberWithCommas(integer), decimal.slice(0, 2)];
}

function numberWithCommas(x: number | string) {
	x = Number(x);
	return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
}

function round(num: number | string) {
	if (typeof num === 'string') num = Number(num);
	return Number(num.toFixed(2));
}

function capitalize(text: string) {
	return text.replace(
		/\p{L}\S*/gu,
		(txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
	);
}

const UNIDADES = [
	'',
	'UN ',
	'DOS ',
	'TRES ',
	'CUATRO ',
	'CINCO ',
	'SEIS ',
	'SIETE ',
	'OCHO ',
	'NUEVE ',
	'DIEZ ',
	'ONCE ',
	'DOCE ',
	'TRECE ',
	'CATORCE ',
	'QUINCE ',
	'DIECISEIS ',
	'DIECISIETE ',
	'DIECIOCHO ',
	'DIECINUEVE ',
	'VEINTE ',
];

const DECENAS = [
	'VEINTI',
	'TREINTA ',
	'CUARENTA ',
	'CINCUENTA ',
	'SESENTA ',
	'SETENTA ',
	'OCHENTA ',
	'NOVENTA ',
	'CIEN ',
];

const CENTENAS = [
	'CIENTO ',
	'DOSCIENTOS ',
	'TRESCIENTOS ',
	'CUATROCIENTOS ',
	'QUINIENTOS ',
	'SEISCIENTOS ',
	'SETECIENTOS ',
	'OCHOCIENTOS ',
	'NOVECIENTOS ',
];

const UNITS = [
	['', ''],
	['MIL ', 'MIL '],
	['MILLON ', 'MILLONES '],
	['MIL MILLONES ', 'MIL MILLONES '],
	['BILLON ', 'BILLONES '],
	['MIL BILLONES ', 'MIL BILLONES '],
	['TRILLON ', 'TRILLONES '],
	['MIL TRILLONES', 'MIL TRILLONES'],
	['CUATRILLON', 'CUATRILLONES'],
	['MIL CUATRILLONES', 'MIL CUATRILLONES'],
	['QUINTILLON', 'QUINTILLONES'],
	['MIL QUINTILLONES', 'MIL QUINTILLONES'],
	['SEXTILLON', 'SEXTILLONES'],
	['MIL SEXTILLONES', 'MIL SEXTILLONES'],
	['SEPTILLON', 'SEPTILLONES'],
	['MIL SEPTILLONES', 'MIL SEPTILLONES'],
	['OCTILLON', 'OCTILLONES'],
	['MIL OCTILLONES', 'MIL OCTILLONES'],
	['NONILLON', 'NONILLONES'],
	['MIL NONILLONES', 'MIL NONILLONES'],
	['DECILLON', 'DECILLONES'],
	['MIL DECILLONES', 'MIL DECILLONES'],
	['UNDECILLON', 'UNDECILLONES'],
	['MIL UNDECILLONES', 'MIL UNDECILLONES'],
	['DUODECILLON', 'DUODECILLONES'],
	['MIL DUODECILLONES', 'MIL DUODECILLONES'],
];

const MONEDAS = [
	{
		country: 'Colombia',
		currency: 'COP',
		singular: 'PESO COLOMBIANO',
		plural: 'PESOS COLOMBIANOS',
		symbol: '$',
	},
	{
		country: 'Estados Unidos',
		currency: 'USD',
		singular: 'DÓLAR',
		plural: 'DÓLARES',
		symbol: 'US$',
	},
	{
		country: 'Europa',
		currency: 'EUR',
		singular: 'EURO',
		plural: 'EUROS',
		symbol: '€',
		decimalsingular: 'Céntimo',
		decimalplural: 'Céntimos',
	},
	{
		country: 'México',
		currency: 'MXN',
		singular: 'PESO MEXICANO',
		plural: 'PESOS MEXICANOS',
		symbol: '$',
	},
	{
		country: 'Perú',
		currency: 'PEN',
		singular: 'NUEVO SOL',
		plural: 'NUEVOS SOLES',
		symbol: 'S/.',
	},
	{
		country: 'Reino Unido',
		currency: 'GBP',
		singular: 'LIBRA',
		plural: 'LIBRAS',
		symbol: '£',
	},
];
