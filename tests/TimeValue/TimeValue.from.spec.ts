import { randomInt } from "crypto";
import { TimeValue, TimeUnits, TimeValueConstructor } from "../../src";

describe("Build with value only (random input)", () => {
    const testSet = Array(10)
        .fill("")
        .map(() => randomInt(1, 1000000));

    test.each(testSet)("Raw value should be the input value: %i", (input: number) => {
        const t = TimeValue.from(input);
        expect(t.rawValue).toBe(input);
    });
});

describe("Sub-millisecond value should be rounded to millisecond (random input)", () => {
    const testSet = Array(10)
        .fill("")
        .map(() => {
            const input = randomInt(0, 10) + Math.random();
            return [input, Math.round(input)];
        });

    test.each(testSet)("input: %f ms - Raw value: %i ms", (input: number, expected: number) => {
        const t = TimeValue.from(input);
        expect(t.rawValue).toBe(expected);
    });
});

describe("Build with value and unit", () => {
    // [[input,unit,expected rawValue]]
    const testSet: [number, TimeUnits, number][] = [
        [1, "ms", 1],
        [1234, "ms", 1234],
        [2, "s", 2000],
        [3.456, "s", 3456],
        [0.789, "s", 789],
        [1, "min", 60000],
        [1.23, "min", 73800],
        [0.456, "min", 27360],
        [1, "h", 3600000],
        [1.23, "h", 4428000],
        [0.789, "h", 2840400],
    ];

    test.each(testSet)("input: %f %s - raw value: %i ms", (input: number, unit: TimeUnits, expected: number) => {
        const t = TimeValue.from(input, unit);
        expect(t.rawValue).toBe(expected);
    });
});

describe("Build with composite value", () => {
    test("Empty object => should be 0", () => {
        const t = TimeValue.from({});
        expect(t.rawValue).toBe(0);
    });
    describe("One composante only", () => {
        const testSet: [TimeValueConstructor, number][] = [
            [{ h: 123 }, 442800000],
            [{ h: 4.56 }, 16416000],
            [{ h: 0.789 }, 2840400],
            [{ min: 123 }, 7380000],
            [{ min: 4.56 }, 273600],
            [{ min: 0.789 }, 47340],
            [{ s: 123 }, 123000],
            [{ s: 4.56 }, 4560],
            [{ s: 0.789 }, 789],
            [{ ms: 123 }, 123],
            [{ ms: 4.56 }, 5],
            [{ ms: 4.45 }, 4],
            [{ ms: 0.789 }, 1],
            [{ ms: 0.123 }, 0],
        ];
        test.each(testSet)("input: %p - Raw value: %i", (input: TimeValueConstructor, expected: number) => {
            const t = TimeValue.from(input);
            expect(t.rawValue).toEqual(expected);
        });
    });

    describe("Multiple composantes", () => {
        const testSet: [TimeValueConstructor, number][] = [
            [{ h: 123, min: 456, s: 789 }, 470949000],
            [{ h: 1.23, min: 4.56, s: 7.89 }, 4709490],
            [{ h: 0.123, min: 0.456, s: 0.789 }, 470949],
            [{ min: 123, s: 456, ms: 789 }, 7836789],
            [{ min: 1.23, s: 4.56, ms: 7.89 }, 78368],
            [{ min: 0.123, s: 0.456, ms: 0.789 }, 7837],
        ];
        test.each(testSet)("input: %p - Raw value: %i", (input: TimeValueConstructor, expected: number) => {
            const t = TimeValue.from(input);
            expect(t.rawValue).toEqual(expected);
        });
    });
});
