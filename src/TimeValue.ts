/**
 * All available Time units
 */
export type TimeUnits = "h" | "min" | "s" | "ms";

/**
 * Utils value
 * bound is the max value (in a 'clock system')
 * ms_rapport is the divider to use for convert millisecond to the actual unit
 */
const infos: UnitInfos = {
    h: { bound: +Infinity, ms_rapport: 1e3 * 60 * 60 },
    min: { bound: 60, ms_rapport: 1e3 * 60 },
    s: { bound: 60, ms_rapport: 1e3 },
    ms: { bound: 1e3, ms_rapport: 1 },
};

/**
 * TimeValue class
 *
 * Hold a raw time value in millisecond and can convert it in another unit (hour, minute, seconde)
 *
 * Instanciate it with `TimeValue.from()` passe the raw value and the unit of this raw value (think like `Buffer.from(str,encoding)`)
 * ```js
 * // raw value in millisecond
 * const raw_value_in_ms = 354
 * const value = TimeValue.from(raw_value_in_ms,"ms")
 *
 * // raw value in minutes
 * const raw_value_in_min = 75
 * const value = TimeValue.from(raw_value_in_min,"min")
 * ```
 */
export class TimeValue {
    /**
     *
     *
     * @private
     *
     * Hold the raw value in millisecond
     */
    private _rawValue = 0;

    /**
     *
     *
     * @readonly
     * @type {number}
     *
     * Return the raw value
     */
    get rawValue(): number {
        return this._rawValue;
    }

    private constructor(opt: TimeValueConstructor) {
        Object.keys(opt).forEach((k) => {
            const key = k as TimeUnits;
            const val = opt[key] || 0;

            this._rawValue += val * infos[key].ms_rapport;
        });

        this._rawValue = Math.round(this._rawValue);
    }

    /**
     *
     * Constructor, build a new TimeValue
     *
     * `TimeValue.from(value,[unit])`
     * * `value` the initial value
     * * `unit` the unit of the initial value (default `"ms"`)
     *
     * Or for more complexe situation, you can specify multiple composante:
     *
     * `TimeValue.from({h?:number,min?:number,s?:number,ms?:number})`
     *
     *
     */
    static from(value: number, unit?: TimeUnits): TimeValue;
    static from(opt: TimeValueConstructor): TimeValue;
    static from(value: TimeValueConstructor | number, unit: TimeUnits = "ms"): TimeValue {
        if (typeof value === "number") {
            return new TimeValue({ [unit]: value });
        }

        return new TimeValue(value);
    }

    /**
     * Return the value in the specified unit
     *
     * ```js
     * const initial = 1.245 // value in sec
     * const time = TimeValue.from(initial,"s") // build the timevalue
     *
     * time.to("ms")
     * // return the value in millisecond
     * // output: 1245
     * ```
     *
     * The returned value is simply the stored raw value (in `ms`) divided by the correct value (1000 for `sec`, 60000 for `min` and  3600000 for `h`)
     *
     * So the returned value can have a decimal part:
     * `75 sec == 1.25 min`
     *
     * And can be 'out of bound':
     * `65000 ms == 65 sec` but in clock system, sec are bound to 60 !
     *
     * You can adjust the returned value:
     * ```
     * time.to({
     * 		unit?: "h" | "min" | "s" | "ms"
     * 		decimal?: boolean | number | "trunc"
     * 		bounded?: boolean
     * })
     * ```
     *
     * * default `unit`is `"ms"`
     * * `decimal`: round the result to the specified number of decimal (0 if `false`) or truncate the result (get the interger part) if `"trunc"`
     * * `bounded`: bound the value (ex: 65 sec == 5 sec if bounded)
     */
    to(unit?: TimeUnits): number;
    to(opt: ValueOpt): number;
    to(opt: TimeUnits | ValueOpt | undefined): number {
        if (opt === undefined) {
            return this.computeValue({ unit: "ms" });
        }

        if (typeof opt === "string") {
            return this.computeValue({ unit: opt });
        }

        return this.computeValue(opt);
    }

    /**
     * Decompose the raw value into multiple unit
     *
     * It is exactly the same as call `to()` many time with different `unit`
     *
     * ```
     * const ms = time.to("ms")
     * const sec = time.to("s")
     * const min = time.to("min")
     * const hour = time.to("h")
     *
     * // or in one call
     *
     * const [hour,min,sec,ms] = time.decompose(["h","min","sec","ms"])
     *
     * ```
     *
     * You can use complexe option for adjust a value
     * ```
     * time.decompose([{unit:"min",bounded:true,decimal:4}])
     * ```
     * And passe the same unit many time
     * ```
     * time.decompose(["min",{unit:"min",bounded:true,decimal:4}])
     * ```
     */
    decompose(opt: Array<TimeUnits | ValueOpt>): number[] {
        return opt.map((o) => {
            if (typeof o === "object") {
                return this.to(o);
            } else {
                return this.to(o);
            }
        });
    }

    private computeValue(opt: ValueOpt): number {
        // unit to use (default "ms")
        opt.unit = opt.unit || "ms";
        // compute the value in the correct unit
        let val = this._rawValue / infos[opt.unit].ms_rapport;

        // if bounded take the rest (%)
        if (opt.bounded) {
            val = val % infos[opt.unit].bound;
        }

        // adjust decimal
        switch (typeof opt.decimal) {
            case "boolean":
                // true ==> return full value
                // false ==>  round to integer
                val = opt.decimal ? val : Math.round(val);
                break;
            case "number":
                // keep only n decimal(s) (value is rounded)
                val = Math.round(val * 10 ** opt.decimal) / 10 ** opt.decimal;
                break;
            case "string":
                // string == "trunc"
                // keep only the integer part (truncate)
                val = Math.trunc(val);
                break;

            default:
        }

        return val;
    }
}
export default TimeValue;

type UnitInfos = Record<
    TimeUnits,
    {
        bound: number;
        ms_rapport: number;
    }
>;

export type TimeValueConstructor = Partial<Record<TimeUnits, number>>;
interface ValueOpt {
    unit?: TimeUnits;
    bounded?: boolean;
    decimal?: boolean | number | "trunc";
}
