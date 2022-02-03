type ChronoState = "running" | "stopped" | "not started";

export class Chrono {
    readonly id: string;

    private _start = BigInt(0);
    private _end = BigInt(0);
    private _laps: bigint[] = [];

    private static NUM_INSTANCE = 0;
    static readonly DEFAULT_VALUE = 0;

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

    private elapsedTime(value: bigint, start: bigint = this._start): number {
        return Math.round(Number(value - start) * 1e-6);
    }

    start(): void {
        this._end = BigInt(0);
        this._start = process.hrtime.bigint();
    }

    stop(): number {
        const t = process.hrtime.bigint();

        if (this.isRunning) {
            this._end = t;
        }

        return this.value;
    }

    lap(): [number, number] {
        const lap = process.hrtime.bigint();
        const last = this._laps[this._laps.length] || this._start;

        this._laps.push(lap);

        return [this.elapsedTime(lap, last), this.elapsedTime(lap)];
    }

    get isStarted(): boolean {
        return this._start !== BigInt(0);
    }

    get isRunning(): boolean {
        return this.isStarted && this._end === BigInt(0);
    }

    get isStopped(): boolean {
        return this._start !== BigInt(0) && this._end !== BigInt(0);
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

    get value(): number {
        switch (this.state) {
            case "running":
                return this.elapsedTime(process.hrtime.bigint());
            case "stopped":
                return this.elapsedTime(this._end);
            default:
                return Chrono.DEFAULT_VALUE;
        }
    }

    get laps(): number[][] {
        return this._laps.map((lap, i, laps) => {
            const last = i == 0 ? this._start : laps[i - 1];

            return [this.elapsedTime(lap, last), this.elapsedTime(lap)];
        });
    }

    toString(): string {
        return `${Chrono.name} ${this.id} - ${this.state}: ${this.value} ms`;
    }

    valueOf(): number {
        return this.value;
    }

    toJSON() {
        return {
            id: this.id,
            state: this.state,
            value: this.value,
        };
    }
}

export default Chrono;
