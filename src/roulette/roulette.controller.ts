import { Controller, Get } from '@nestjs/common';
import { RouletteService } from './roulette.service';

@Controller('roulette')
export class RouletteController {
    constructor(private rouletteService: RouletteService) {}

    @Get('next-roll/time')
    nextRollTime() {
        return this.rouletteService.nextRoll();
    }

    @Get('next-roll/positions-array')
    nextRollAcceleration() {
        return this.rouletteService.getNextRollPositionsArray();
    }

    @Get('props')
    getRouletteProps() {
        return this.rouletteService.getRouletteProps();
    }
}
