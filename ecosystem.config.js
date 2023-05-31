const dotenv = require('dotenv');

const envTypes = ['dev', 'test', 'prod'];

const env = {};

envTypes.forEach((type) => {
	const { parsed } = dotenv.config({ path: `./.env.${type}` });

	if (parsed) {
		env[type] = { ...parsed };
	}
});

module.exports = {
	apps: [
		{
			name: 'pef-backend-dev',
			script: './dist/dev/src/main.js',
			instances: 1,
			env: {
				...env['dev'],
			},
		},
		{
			name: 'pef-backend-test',
			script: './dist/test/src/main.js',
			instances: 1,
			env: {
				...env['test'],
			},
		},
		{
			name: 'pef-backend-prod',
			script: './dist/prod/src/main.js',
			instances: 1,
			env: {
				...env['prod'],
			},
		},
	],
};
