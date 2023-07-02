import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
    SLOTS_COLOR_BLACK,
    SLOTS_COLOR_RED,
    SLOTS_MAX_SPEED,
    SLOTS_NUMBER,
    SLOTS_PX_WIDTH,
    SLOTS_ROLL_ACCELERATION,
    SLOTS_ROLL_FRICTION,
    SLOTS_VIEWPORT_WIDTH,
} from './constants';
import { Slot } from './models/slot.interface';

@Injectable()
export class RouletteService {
    private nextRollTime: number;
    private accelerationTime: number;
    private rouletteOffsetLeft: number;
    private positionsArray: number[];
    private slotsState: Slot[] = [];
    private nextSlotsState: Slot[] = [];

    constructor() {
        this.generateSlots();
        this.nextRollTime = Date.now();
        this.rouletteOffsetLeft =
            (-1 * (SLOTS_NUMBER * SLOTS_PX_WIDTH - SLOTS_VIEWPORT_WIDTH)) / 2;
        this.setAccelerationTime();
    }

    private generateSlots() {
        for (let i = 0; i < SLOTS_NUMBER; i++) {
            const slot: Slot = {
                number: i,
                color: i % 2 === 0 ? SLOTS_COLOR_RED : SLOTS_COLOR_BLACK,
            };

            this.slotsState.push(slot);
            this.nextSlotsState.push(slot);
        }
    }

    private setAccelerationTime() {
        this.accelerationTime = Math.floor(Math.random() * 400 + 100);
    }

    nextRoll() {
        return {
            nextRollTime: (this.nextRollTime - Date.now()) / 1000,
        };
    }

    getRouletteProps() {
        return {
            slotsNumber: SLOTS_NUMBER,
            slotsPxWidth: SLOTS_PX_WIDTH,
            slotsRollAcceleration: SLOTS_ROLL_ACCELERATION,
            slotsRollFriction: SLOTS_ROLL_FRICTION,
            slotsMaxSpeed: SLOTS_MAX_SPEED,
            slotsViewportWidth: SLOTS_VIEWPORT_WIDTH,
            rouletteOffsetLeft: this.rouletteOffsetLeft,
            slots: this.slotsState,
        };
    }

    getNextRollPositionsArray() {
        return this.positionsArray;
    }

    private setRouletteOffsetLeft() {
        this.rouletteOffsetLeft =
            !!this.positionsArray === false
                ? this.rouletteOffsetLeft
                : this.positionsArray[this.positionsArray.length - 1];
    }

    private setNextRollPositions() {
        const positionsArray = [];

        let time = 0;
        let velocity = 0;
        let friction = SLOTS_ROLL_FRICTION;
        let rollPosition = this.rouletteOffsetLeft;

        while (true) {
            if (time++ < this.accelerationTime) {
                velocity +=
                    velocity < SLOTS_MAX_SPEED ? SLOTS_ROLL_ACCELERATION : 0;
                rollPosition = rollPosition + velocity;
            } else if (velocity > 0.1) {
                velocity *= friction;
                friction -= velocity < 3 ? 0.00066 : 0.00006;
                rollPosition = rollPosition + velocity;
            } else {
                break;
            }

            if (rollPosition > 0 - SLOTS_PX_WIDTH) {
                rollPosition -= SLOTS_PX_WIDTH;
                this.moveLastSlotToFront();
            }

            rollPosition = Math.floor(rollPosition);
            positionsArray.push(rollPosition);
        }

        this.positionsArray = positionsArray;
    }

    private moveLastSlotToFront() {
        this.nextSlotsState.unshift(this.nextSlotsState.pop());
    }

    @Cron('*/20 * * * * *')
    setNextRollData() {
        this.slotsState = [].concat(this.nextSlotsState);
        this.nextRollTime = Date.now() + 20000;
        this.setAccelerationTime();
        this.setRouletteOffsetLeft();
        this.setNextRollPositions();
        console.log(this.rouletteOffsetLeft);
    }
}
