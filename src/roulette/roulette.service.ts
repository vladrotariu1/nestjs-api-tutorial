import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
    SLOTS_MAX_SPEED,
    SLOTS_NUMBER,
    SLOTS_PX_WIDTH,
    SLOTS_ROLL_ACCELERATION,
    SLOTS_ROLL_FRICTION,
    SLOTS_VIEWPORT_WIDTH,
} from './constants';

@Injectable()
export class RouletteService {
    nextRollTime: number;
    accelerationTime: number;
    roultetteOffsetLeft: number;

    constructor() {
        this.nextRollTime = Date.now();
        this.accelerationTime = Math.floor(Math.random() * 400 + 100);
        this.roultetteOffsetLeft =
            (-1 * (SLOTS_NUMBER * SLOTS_PX_WIDTH - SLOTS_VIEWPORT_WIDTH)) / 2;
    }

    nextRoll() {
        return this.nextRollTime;
    }

    getAccelerationTime() {
        return this.accelerationTime;
    }

    getRouletteProps() {
        return {
            slotsNumber: SLOTS_NUMBER,
            slotsPxWidth: SLOTS_PX_WIDTH,
            slotsRollAcceleration: SLOTS_ROLL_ACCELERATION,
            slotsRollFriction: SLOTS_ROLL_FRICTION,
            slotsMaxSpeed: SLOTS_MAX_SPEED,
            slotsViewportWidth: SLOTS_VIEWPORT_WIDTH,
            rouletteOffsetLeft: this.roultetteOffsetLeft,
        };
    }

    private calculateRouletteOffsetleft() {
        let time = 0;
        let velocity = 0;
        let friction = SLOTS_ROLL_FRICTION;

        while (true) {
            if (time++ < this.accelerationTime) {
                velocity +=
                    velocity < SLOTS_MAX_SPEED ? SLOTS_ROLL_ACCELERATION : 0;
                this.roultetteOffsetLeft = this.roultetteOffsetLeft + velocity;
            } else if (velocity > 0.1) {
                velocity *= friction;
                friction -= velocity < 3 ? 0.00066 : 0.00006;
                this.roultetteOffsetLeft = this.roultetteOffsetLeft + velocity;
            } else {
                break;
            }

            if (this.roultetteOffsetLeft > 0 - SLOTS_PX_WIDTH) {
                this.roultetteOffsetLeft -= SLOTS_PX_WIDTH;
            }

            this.roultetteOffsetLeft = Math.floor(this.roultetteOffsetLeft);
        }
    }

    @Cron('*/20 * * * * *')
    setNextRollData() {
        this.nextRollTime = Date.now() + 20000;
        this.accelerationTime = Math.floor(Math.random() * 400 + 100);
        this.calculateRouletteOffsetleft();
    }
}
