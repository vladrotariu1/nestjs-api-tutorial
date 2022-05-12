import { Controller, Get } from '@nestjs/common';
import { RouletteService } from './roulette.service';

@Controller('roulette')
export class RouletteController {
    constructor(private rouletteService: RouletteService) {}

    @Get('next-roll')
    nextRoll() {
        return { nextRoll: this.rouletteService.nextRoll() };
    }
}
