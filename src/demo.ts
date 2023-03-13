function main() {
	const num = 1352369.199;
	const separated = separateNumber(num);
	console.log([numberWithCommas(separated[0]), separated[1]]);
}

main();

function numberWithCommas(x: number | string) {
	x = Number(x);
	return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
}

export function separateNumber(num: number): [string, string] {
	const integer = num.toString().split('.').shift();
	if (!integer) throw new Error('error at parsing number');
	const decimal = num.toString().split('.').pop();
	if (!decimal) throw new Error('error at parsing number');
	return [integer, decimal.slice(0, 2)];
}
