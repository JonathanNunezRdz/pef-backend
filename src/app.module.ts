import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { AnalysisModule } from './analysis/analysis.module';
import { PrismaModule } from './prisma/prisma.module';
import { ResultModule } from './result/result.module';
import { UserModule } from './user/user.module';
import { UtilModule } from './util/util.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		UtilModule,
		UserModule,
		ResultModule,
		AnalysisModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
