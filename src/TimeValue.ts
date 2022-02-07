export type TimeUnits = "h" | "min" | "s" | "ms";

const infos: UnitInfos = {
    h: { bound: +Infinity, ms_rapport: 1e3 * 60 * 60 },
    min: { bound: 60, ms_rapport: 1e3 * 60 },
    s: { bound: 60, ms_rapport: 1e3 },
    ms: { bound: 1e3, ms_rapport: 1 },
};

export class TimeValue {
    private _baseValue = 0;

    get basValue(): number {
        return this._baseValue;
    }

    private constructor(opt: TimeValueConstructor) {
        Object.keys(opt).forEach((k) => {
            const key = k as TimeUnits;
            const val = opt[key] || 0;

            this._baseValue += val * infos[key].ms_rapport;
        });
    }

    static from(opt: TimeValueConstructor): TimeValue;
    static from(value: number, unit?: TimeUnits): TimeValue;
    static from(value: TimeValueConstructor | number, unit: TimeUnits = "ms"): TimeValue {
        if (typeof value === "number") {
            return new TimeValue({ [unit]: value });
        }

        return new TimeValue(value);
    }

    value(unit?: TimeUnits): number;
    value(opt: ValueOpt): number;
    value(opt: TimeUnits | ValueOpt | undefined): number {
        if (opt === undefined) {
            return this.computeValue({ unit: "ms" });
        }

        if (typeof opt === "string") {
            return this.computeValue({ unit: opt });
        }

        return this.computeValue(opt);
    }

    decompose(opt: DecomposeOpt): DecomposeResponse {
        const res: DecomposeResponse = {};

        Object.keys(opt).forEach((k) => {
            const key = k as TimeUnits;

            const o = opt[key];
            if (o) {
                res[key] = this.computeValue(o);
            }
        });

        return res;
    }

    private computeValue(opt: ValueOpt): number {
        opt.unit = opt.unit || "ms";
        let val = this._baseValue / infos[opt.unit].ms_rapport;

        if (opt.bounded) {
            val = val % infos[opt.unit].bound;
        }

        switch (typeof opt.decimal) {
            case "boolean":
                val = opt.decimal ? val : Math.round(val);
                break;
            case "number":
                val = Math.round(val * 10 ** opt.decimal) / 10 ** opt.decimal;
                break;
            case "string":
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

type TimeValueConstructor = Partial<Record<TimeUnits, number>>;
interface ValueOpt {
    unit?: TimeUnits;
    bounded?: boolean;
    decimal?: boolean | number | "trunc";
}

type DecomposeOpt = Partial<Record<TimeUnits, ValueOpt>>;
type DecomposeResponse = Partial<Record<TimeUnits, number>>;
