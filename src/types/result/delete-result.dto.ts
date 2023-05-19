import { AnalysisResult, User } from '@prisma/client';

export interface DeleteResultService {
	userId: User['id'];
	resultId: AnalysisResult['id'];
}
