type ChronoState = "running" | "stopped" | "not started";

/**
 *
 * Chronometer class
 *
 * Instanciate with:
 * `Chrono.create()` or `Chrono.start()`
 *
 * You can specify and `id` to identify them:
 * ```js
 * Chrono.create("my-super-id")
 * Chrono.start("my-awesome-id")
 * ```
 * if no `id` is passed to constructor, an automatique id is set based on an auto-increment static propertie
 */
export class Chrono {
    /**
     * id of the Chrono
     *
     * can be passed to constructor or set automaticaly
     */
    readonly id: string;

    /**
     * store the hrtime when Chrono is started
     */
    private _start = BigInt(0);

    /**
     * store the hrtime when Chrono is stopped
     */
    private _end = BigInt(0);

    /**
     * store current hrtime each time the lap method is call
     */
    private _laps: bigint[] = [];

    /**
     * Total of instanciated Chrono since app start
     *
     * Auto-incremented in constructor, used for create auto unique id
     */
    private static NUM_INSTANCE = 0;

    /**
     *
     * Default value returned if Chrono is not started
     */
    static readonly DEFAULT_VALUE = 0;

    /**
     *
     * Instanciate a new Chrono
     *
     * With `id` if specified
     */
    static create(id?: string): Chrono {
        return new Chrono(id);
    }

    /**
     *
     * Instanciate a new Chrono
     *
     * Identique to `Chrono.create` but immediately start the Chrono
     */
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

    /**
     *
     * @private
     *
     * calculate the elapsed time between value and start
     *
     * result is rounded to millisecond _(hrtime.bigint return value is nanosecond!)_
     *
     * if `start` is no passed, use `this._start`
     */
    private elapsedTime(value: bigint, start: bigint = this._start): number {
        return Math.round(Number(value - start) * 1e-6);
    }

    /**
     *
     * Start the Chrono, store current hrtime
     *
     * Re-start a running or stopped Chrono (RAZ)
     *
     * Chrono `state` become `running`
     */
    start(): void {
        this._laps = [];
        this._end = BigInt(0);
        this._start = process.hrtime.bigint();
    }

    /**
     *
     * Stop a running Chrono and return the final value is millisecond
     *
     * Chrono `state` become `stopped`
     *
     * if Chrono is `not started` or already `stopped` nothing happens
     */
    stop(): number {
        const t = process.hrtime.bigint();

        if (this.isRunning) {
            this._end = t;
        }

        return this.value;
    }

    /**
     *
     * Create a new lap, the current `hrtime` is stored,
     * return the elapsed time since last lap (relative) and the elapsed time since start (absolute)
     *
     * => [number,number] == [relative, absolute]
     *
     */
    lap(): [number, number] {
        if (!this.isRunning) {
            return [0, 0];
        }

        const lap = process.hrtime.bigint();
        const last = this._laps.length > 0 ? this._laps[this._laps.length - 1] : this._start;

        this._laps.push(lap);

        return [this.elapsedTime(lap, last), this.elapsedTime(lap)];
    }

    /**
     * @readonly
     *
     * Return `true` if the Chrono was started
     *
     * Chrono could have been stopped since, still return `true`
     */
    get isStarted(): boolean {
        return this._start !== BigInt(0);
    }

    /**
     * @readonly
     *
     * Return `true` if the Chrono is actually running
     *
     * (Chrono was started but never stopped)
     */
    get isRunning(): boolean {
        return this.isStarted && this._end === BigInt(0);
    }

    /**
     * @readonly
     *
     * Return `true` if the Chrono was started and stopped at least once
     */
    get isStopped(): boolean {
        return this._start !== BigInt(0) && this._end !== BigInt(0);
    }

    /**
     * @readonly
     *
     * Return the actual state of the Chrono
     *
     * * `not started` : the Chrono has never been started
     * * `running` : the Chrono has been started and is currently running
     * * `stopped`: the Chrono has beed started (at least once) and stopped
     */
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

    /**
     * Elapsed time since start if `running`or Elapsed time between start and stop if `stopped` (return 0 if `not started`)
     *
     * _value in millisecond_
     */
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

    /**
     * Return all laps stored
     *
     * Each row is a lap [relative,absolute] (see `lap()` method )
     */
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
