type ChronoState = "running" | "stopped" | "not started";

export class Chrono {
    readonly id: string;

    private _start?: bigint;
    private _end?: bigint;

    private static NUM_INSTANCE: number = 0;

    static create(id?: string): Chrono {
        return new Chrono(id);
    }

    static start(id?: string): Chrono {
        const c = new Chrono(id);
        c.start();

        return c;
    }

    private constructor(id?: string) {
        if (id == undefined) {
            Chrono.NUM_INSTANCE++;
            id = Chrono.NUM_INSTANCE.toString();
        }

        this.id = id;
    }

    start(): void {
        this._end = undefined;
        this._start = process.hrtime.bigint();
    }

    stop(): bigint {
        const t = process.hrtime.bigint();

        if (this.isRunning) {
            this._end = this._end || t;
        }

        return this.value;
    }

    get isStarted(): boolean {
        return this._start !== undefined;
    }

    get isRunning(): boolean {
        return this.isStarted && this._end === undefined;
    }

    get isStopped(): boolean {
        return this._start !== undefined && this._end !== undefined;
    }

    get state(): ChronoState {
        switch (true) {
            case this.isStopped:
                return "stopped";
            case this.isRunning:
                return "running";
            default:
                return "not started";
        }
    }

    get value(): bigint {
        switch (this.state) {
            case "running":
                return process.hrtime.bigint() - this._start!;
            case "stopped":
                return this._end! - this._start!;
            default:
                return BigInt(0);
        }
    }

    toString(): string {
        return `${Chrono.name} ${this.id} - ${this.state}: ${this.value} ns`;
    }

    valueOf(): bigint {
        return this.value;
    }

    toJSON() {
        return {
            id: this.id,
            state: this.state,
            value: this.value.toString(),
        };
    }
}

export default Chrono;
