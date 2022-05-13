import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class RouletteService {
    nextRollTime: number;

    constructor() {
        this.nextRollTime = Date.now();
    }

    nextRoll() {
        return this.nextRollTime;
    }

    @Cron('*/20 * * * * *')
    setNextRollTime() {
        this.nextRollTime = Date.now() + 20000;
    }
}
