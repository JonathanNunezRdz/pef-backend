import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { CreateResultDto } from './dto/create-result.dto';
import { UpdateResultDto } from './dto/update-result.dto';
import { ResultService } from './result.service';

@Controller('result')
export class ResultController {
	constructor(private readonly resultService: ResultService) {}

	@Post()
	create(@Body() createResultDto: CreateResultDto) {
		return this.resultService.create(createResultDto);
	}

	@Get()
	findAll() {
		return this.resultService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.resultService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateResultDto: UpdateResultDto) {
		return this.resultService.update(+id, updateResultDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.resultService.remove(+id);
	}
}
