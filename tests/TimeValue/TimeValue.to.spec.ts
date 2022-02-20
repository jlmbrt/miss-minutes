import { TimeUnits, TimeValue } from "../../src";

const globalTestSet: [number, number, TimeUnits][] = [
    [1, 1, "ms"],
    [1, 0.001, "s"],
    [1, 0.000016666666666666667, "min"],
    [1, 2.7777777777777776e-7, "h"],
    [12, 12, "ms"],
    [12, 0.012, "s"],
    [12, 0.0002, "min"],
    [12, 0.0000033333333333333333, "h"],
    [123, 123, "ms"],
    [123, 0.123, "s"],
    [123, 0.00205, "min"],
    [123, 0.000034166666666666666, "h"],
    [1234, 1234, "ms"],
    [1234, 1.234, "s"],
    [1234, 0.020566666666666667, "min"],
    [1234, 0.0003427777777777778, "h"],
    [12345, 12345, "ms"],
    [12345, 12.345, "s"],
    [12345, 0.20575, "min"],
    [12345, 0.0034291666666666667, "h"],
    [123456, 123456, "ms"],
    [123456, 123.456, "s"],
    [123456, 2.0576, "min"],
    [123456, 0.034293333333333335, "h"],
    [1234567, 1234567, "ms"],
    [1234567, 1234.567, "s"],
    [1234567, 20.576116666666667, "min"],
    [1234567, 0.34293527777777777, "h"],
    [12345678, 12345678, "ms"],
    [12345678, 12345.678, "s"],
    [12345678, 205.7613, "min"],
    [12345678, 3.429355, "h"],
    [123456789, 123456789, "ms"],
    [123456789, 123456.789, "s"],
    [123456789, 2057.61315, "min"],
    [123456789, 34.2935525, "h"],
    [1234567890, 1234567890, "ms"],
    [1234567890, 1234567.89, "s"],
    [1234567890, 20576.1315, "min"],
    [1234567890, 342.935525, "h"],
];

describe("Simple conversion to another unit", () => {
    test.each(globalTestSet)("%i ms give %f %s", (input: number, expected: number, outputUnit: TimeUnits) => {
        const t = TimeValue.from(input);
        const val = t.to(outputUnit);

        expect(val).toBe(expected);
    });
});

describe("Adjust the number of decimal", () => {
    const numberOfDecimal = Array(6)
        .fill("")
        .map((_, i) => i);

    describe.each(numberOfDecimal)("Keep only %i decimal", (decimal: number) => {
        const testSet: [number, number, TimeUnits][] = globalTestSet.map(([input, expected, unit]) => {
            const pow = 10 ** decimal;
            expected = Math.round(expected * pow) / pow;

            return [input, expected, unit];
        });

        test.each(testSet)("%i ms give %f %s", (input: number, expected: number, outputUnit: TimeUnits) => {
            const t = TimeValue.from(input);
            const val = t.to({ unit: outputUnit, decimal: decimal });

            expect(val).toBe(expected);
        });
    });

    describe("Decimal set to false", () => {
        const testSet: [number, number, TimeUnits][] = globalTestSet.map(([input, expected, unit]) => {
            return [input, Math.round(expected), unit];
        });

        test.each(testSet)("%i ms give %f %s", (input: number, expected: number, outputUnit: TimeUnits) => {
            const t = TimeValue.from(input);
            const val = t.to({ unit: outputUnit, decimal: false });

            expect(val).toBe(expected);
        });
    });

    describe('Decimal set to "trunc"', () => {
        const testSet: [number, number, TimeUnits][] = globalTestSet.map(([input, expected, unit]) => {
            return [input, Math.trunc(expected), unit];
        });

        test.each(testSet)("%i ms give %f %s", (input: number, expected: number, outputUnit: TimeUnits) => {
            const t = TimeValue.from(input);
            const val = t.to({ unit: outputUnit, decimal: "trunc" });

            expect(val).toBe(expected);
        });
    });
});

describe("Bound output value", () => {
    const testSet: [number, number, TimeUnits][] = globalTestSet.map(([input, expected, unit]) => {
        switch (unit) {
            case "ms":
                expected = expected % 1000;
                break;
            case "s":
                expected = expected % 60;
                break;
            case "min":
                expected = expected % 60;
                break;
            default:
        }

        return [input, expected, unit];
    });

    test.each(testSet)("%i ms give %f %s", (input: number, expected: number, unit: TimeUnits) => {
        const t = TimeValue.from(input);
        const val = t.to({ unit: unit, bounded: true });

        expect(val).toBe(expected);
    });
});
