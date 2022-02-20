import { Chrono } from "../../src";

describe("Chrono - laps", () => {
    test("laps should return empty array on instanciate", () => {
        const c = Chrono.create();

        expect(c.laps.length).toBe(0);
    });

    describe("Each call to lap() should create a new lap, and only one", () => {
        const c = Chrono.start();

        test.each(Range(5))("Call #%# - laps should contain %i values", (expected) => {
            c.lap();

            expect(c.laps.length).toBe(expected);
        });
    });

    describe("Should not create lap on not running Chrono", () => {
        test("Not started chrono can't create lap", () => {
            const c = Chrono.create();
            c.lap();

            expect(c.laps.length).toBe(0);
        });

        test("Stopped chrono can't create lap ", () => {
            const c = Chrono.start();
            c.stop();
            c.lap();

            expect(c.laps.length).toBe(0);
        });
    });

    describe("Call start method should reset laps", () => {
        test("Running Chrono with laps", () => {
            const c = Chrono.start();
            Range(10).forEach(() => c.lap());

            c.start();

            expect(c.laps.length).toBe(0);
        });

        test("Stopped Chrono with laps", () => {
            const c = Chrono.start();
            Range(10).forEach(() => c.lap());
            c.stop();
            c.start();

            expect(c.laps.length).toBe(0);
        });
    });
});

function Range(n: number): number[] {
    return Array(n)
        .fill("")
        .map((_, i) => i + 1);
}
