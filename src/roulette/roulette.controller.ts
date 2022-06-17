import { Controller, Get } from '@nestjs/common';
import { RouletteService } from './roulette.service';

@Controller('roulette')
export class RouletteController {
    constructor(private rouletteService: RouletteService) {}

    @Get('next-roll/time')
    nextRollTime() {
        return {
            nextRollTime: (this.rouletteService.nextRoll() - Date.now()) / 1000,
        };
    }

    @Get('next-roll/acceleration')
    nextRollAcceleration() {
        return {
            nextRollAcceleration: this.rouletteService.getAccelerationTime(),
        };
    }

    @Get('props')
    getRouletteProps() {
        return this.rouletteService.getRouletteProps();
    }
}
