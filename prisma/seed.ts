import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

async function main() {
	if (process.env.NODE_ENV === 'development') {
		console.log('added test user');
		const defaultPassword = await hash('password');
		await prisma.user.create({
			data: {
				firstName: 'Test',
				lastName: 'User',
				email: 'jonas@jonas.com',
				hash: defaultPassword,
			},
		});
	}

	const saved = await prisma.algorithm.findFirst({
		where: {
			name: 'UDEM',
		},
		select: {
			id: true,
		},
	});

	if (saved) {
		return;
	}

	//  agregar nombre legible para las variables
	await prisma.variable.createMany({
		data: [
			{
				name: 'numOfLetters',
				readableName: 'Número de letras',
			},
			{
				name: 'numOfSyllables',
				readableName: 'Número de sílabas',
			},
			{
				name: 'numOfWords',
				readableName: 'Número de palabras',
			},
			{
				name: 'numOfSentences',
				readableName: 'Número de enunciados',
			},

			{
				name: 'avgLettersPerWord',
				readableName: 'Promedio de letras por palabra',
			},
			{
				name: 'avgSyllablePerWord',
				readableName: 'Promedio de sílabas por palabra',
			},
			{
				name: 'avgWordsPerSentence',
				readableName: 'Promedio de palabras por enunciado',
			},
			{
				name: 'avgSentencesPerHundredWords',
				readableName: 'Promedio de enunciados por cada 100 palabras',
			},
			{
				name: 'avgSyllablesPerHundredWords',
				readableName: 'Promedio de sílabas por cada 100 palabras',
			},
			{
				name: 'varLettersPerWord',
				readableName: 'Varianza de letras por palabra',
			},
			{
				name: 'numOfSamples',
				readableName:
					'Número de muestras a usar al aplicar el algoritmo de Fernández Huerta',
			},
		],
	});

	const variables = await prisma.variable.findMany();

	const extractVariableId = (name: string) => {
		const variable = variables.find((vari) => vari.name === name);
		if (!variable) throw new Error('variable name not found');
		return variable.id;
	};

	// modify formula based on this: https://scielo.isciii.es/scielo.php?script=sci_arttext&pid=S1135-57272002000400007&lng=en&nrm=iso
	// add an option for users to select a desired amount of "rounds" (muestras) for their query
	// also provide a default and an explanation for this option
	await prisma.$transaction([
		prisma.algorithm.create({
			data: {
				name: 'Fernández Huerta',
				max: 100,
				min: 0,
				unit: 'puntos de lecturabilidad',
				formula:
					'206.84 - 0.60 * avgSyllablesPerHundredWords - 1.02 * avgSentencesPerHundredWords',
				variables: {
					createMany: {
						data: [
							{
								variableId: extractVariableId(
									'avgSyllablesPerHundredWords'
								),
							},
							{
								variableId: extractVariableId(
									'avgSentencesPerHundredWords'
								),
							},
							{
								variableId: extractVariableId('numOfSamples'),
							},
						],
					},
				},
				scales: {
					createMany: {
						data: [
							{
								upperLimit: 30,
								level: 'Muy difícil',
								extra: {
									schoolGrade: {
										label: 'Grado educativo',
										value: 'Universitario (especialización)',
									},
								},
							},
							{
								upperLimit: 50,
								level: 'Difícil',
								extra: {
									schoolGrade: {
										label: 'Grado educativo',
										value: 'Cursos selectivos',
									},
								},
							},
							{
								upperLimit: 60,
								level: 'Moderadamente difícil',
								extra: {
									schoolGrade: {
										label: 'Grado educativo',
										value: 'Preuniversitario',
									},
								},
							},
							{
								upperLimit: 70,
								level: 'Normal',
								extra: {
									schoolGrade: {
										label: 'Grado educativo',
										value: '7° u 8° grado',
									},
								},
							},
							{
								upperLimit: 80,
								level: 'Moderadamente fácil',
								extra: {
									schoolGrade: {
										label: 'Grado educativo',
										value: '6° grado',
									},
								},
							},
							{
								upperLimit: 90,
								level: 'Fácil',
								extra: {
									schoolGrade: {
										label: 'Grado educativo',
										value: '5° grado',
									},
								},
							},
							{
								upperLimit: 100,
								level: 'Muy fácil',
								extra: {
									schoolGrade: {
										label: 'Grado educativo',
										value: '4° grado',
									},
								},
							},
						],
					},
				},
			},
		}),
		prisma.algorithm.create({
			data: {
				name: 'Gutiérrez de Polini',
				max: 100,
				min: 0,
				unit: 'puntos de comprensibilidad',
				formula:
					'95.2 - 9.7 * (numOfLetters / numOfWords) - 0.35 * (numOfWords / numOfSentences)',
				variables: {
					createMany: {
						data: [
							{
								variableId: extractVariableId('numOfLetters'),
							},
							{
								variableId: extractVariableId('numOfWords'),
							},
							{
								variableId: extractVariableId('numOfSentences'),
							},
						],
					},
				},
				scales: {
					createMany: {
						data: [
							{
								upperLimit: 20,
								level: 'Muy difícil',
							},
							{
								upperLimit: 40,
								level: 'Difícil',
							},
							{
								upperLimit: 60,
								level: 'Normal',
							},
							{
								upperLimit: 80,
								level: 'Fácil',
							},
							{
								upperLimit: 100,
								level: 'Muy fácil',
							},
						],
					},
				},
			},
		}),
		prisma.algorithm.create({
			data: {
				name: 'Szigriszt-Pazos',
				max: 100,
				min: 0,
				unit: 'nivel de perspicuidad',
				formula:
					'206.835 - ((62.3 * numOfSyllables) / numOfWords) - (numOfWords / numOfSentences)',
				variables: {
					createMany: {
						data: [
							{
								variableId: extractVariableId('numOfSyllables'),
							},
							{
								variableId: extractVariableId('numOfWords'),
							},
							{
								variableId: extractVariableId('numOfSentences'),
							},
						],
					},
				},
				scales: {
					createMany: {
						data: [
							{
								upperLimit: 16,
								level: 'Muy difícil',
								extra: {
									type: {
										label: 'Tipo de texto',
										value: 'Científica, filosófica',
									},
									schoolGrade: {
										label: 'Grado educativo',
										value: 'Titulados universitarios',
									},
								},
							},
							{
								upperLimit: 35,
								level: 'Árido',
								extra: {
									type: {
										label: 'Tipo de texto',
										value: 'Pedadógia, técnica',
									},
									schoolGrade: {
										label: 'Grado educativo',
										value: 'Selectiva y estudios universitarios',
									},
								},
							},
							{
								upperLimit: 50,
								level: 'Bastante difícil',
								extra: {
									type: {
										label: 'Tipo de texto',
										value: 'Literatura y divulgación',
									},
									schoolGrade: {
										label: 'Grado educativo',
										value: 'Cursos secundarios',
									},
								},
							},
							{
								upperLimit: 65,
								level: 'Normal',
								extra: {
									type: {
										label: 'Tipo de texto',
										value: 'Los medios',
									},
									schoolGrade: {
										label: 'Grado educativo',
										value: 'Popular',
									},
								},
							},
							{
								upperLimit: 75,
								level: 'Bastante fácil',
								extra: {
									type: {
										label: 'Tipo de texto',
										value: 'Novela, revista',
									},
									schoolGrade: {
										label: 'Grado educativo',
										value: '12 años',
									},
								},
							},
							{
								upperLimit: 85,
								level: 'Fácil',
								extra: {
									type: {
										label: 'Tipo de texto',
										value: 'Para quiscos',
									},
									schoolGrade: {
										label: 'Grado educativo',
										value: '11 años',
									},
								},
							},
							{
								upperLimit: 100,
								level: 'Muy fácil',
								extra: {
									type: {
										label: 'Tipo de texto',
										value: 'Comics y viñetas',
									},
									schoolGrade: {
										label: 'Grado educativo',
										value: '6 a 10 años',
									},
								},
							},
						],
					},
				},
			},
		}),
		prisma.algorithm.create({
			data: {
				name: 'Inflesz',
				max: 100,
				min: 0,
				unit: 'nivel de perspicuidad',
				formula:
					'206.835 - 62.3 * (numOfSyllables / numOfWords) - numOfWords / numOfSentences',
				variables: {
					createMany: {
						data: [
							{
								variableId: extractVariableId('numOfSyllables'),
							},
							{
								variableId: extractVariableId('numOfWords'),
							},
							{
								variableId: extractVariableId('numOfSentences'),
							},
						],
					},
				},
				scales: {
					createMany: {
						data: [
							{
								upperLimit: 41,
								level: 'Muy difícil',
							},
							{
								upperLimit: 55,
								level: 'Algo difícil',
							},
							{
								upperLimit: 65,
								level: 'Normal',
							},
							{
								upperLimit: 80,
								level: 'Bastante fácil',
							},
							{
								upperLimit: 100,
								level: 'Muy fácil',
							},
						],
					},
				},
			},
		}),
		prisma.algorithm.create({
			data: {
				name: 'Legibilidad μ',
				max: 100,
				min: 0,
				unit: 'puntos de legibilidad',
				formula:
					'(numOfWords / (numOfWords - 1)) * (avgLettersPerWord / varLettersPerWord) * 100',
				variables: {
					createMany: {
						data: [
							{
								variableId:
									extractVariableId('avgLettersPerWord'),
							},
							{
								variableId: extractVariableId('numOfWords'),
							},
							{
								variableId:
									extractVariableId('varLettersPerWord'),
							},
						],
					},
				},
				scales: {
					createMany: {
						data: [
							{
								upperLimit: 30,
								level: 'Muy difícil',
							},
							{
								upperLimit: 50,
								level: 'Difícil',
							},
							{
								upperLimit: 60,
								level: 'Un poco difícil',
							},
							{
								upperLimit: 70,
								level: 'Adecuado',
							},
							{
								upperLimit: 80,
								level: 'Un poco fácil',
							},
							{
								upperLimit: 90,
								level: 'Fácil',
							},
							{
								upperLimit: 100,
								level: 'Muy fácil',
							},
						],
					},
				},
			},
		}),
		prisma.algorithm.create({
			data: {
				name: 'Crawford',
				max: 20,
				min: 0,
				unit: 'años de escolaridad',
				formula:
					'-0.205 * avgSentencesPerHundredWords + 0.049 * avgSyllablesPerHundredWords - 3.407',
				variables: {
					createMany: {
						data: [
							{
								variableId: extractVariableId(
									'avgSentencesPerHundredWords'
								),
							},
							{
								variableId: extractVariableId(
									'avgSyllablesPerHundredWords'
								),
							},
						],
					},
				},
			},
		}),
		prisma.algorithm.create({
			data: {
				name: 'UDEM',
				max: 100,
				min: 0,
				unit: 'puntos de legibilidad',
				formula: '',
				scales: {
					createMany: {
						data: [
							{
								upperLimit: 44,
								level: 'Muy difícil',
							},
							{
								upperLimit: 59,
								level: 'Difícil',
							},
							{
								upperLimit: 69,
								level: 'Normal',
							},
							{
								upperLimit: 79,
								level: 'Fácil',
							},
							{
								upperLimit: 100,
								level: 'Muy fácil',
							},
						],
					},
				},
			},
		}),
	]);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
