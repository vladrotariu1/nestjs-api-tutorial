import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RouletteService {
    nextRollTime: number;

    constructor() {
        this.nextRollTime = Date.now();
    }

    nextRoll() {
        return this.nextRollTime;
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    setNextRollTime() {
        this.nextRollTime = Date.now();
    }
}
