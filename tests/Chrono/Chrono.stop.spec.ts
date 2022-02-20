import { Chrono } from "../../src/Chrono";

describe("Chrono - stop method", () => {
    describe("Should stop a running chrono", () => {
        let c: Chrono;
        beforeEach(() => {
            c = Chrono.create();
            c.start();
            c.stop();
        });

        test("is started", () => {
            expect(c.isStarted).toBeTruthy();
        });

        test("is not running", () => {
            expect(c.isRunning).toBeFalsy();
        });

        test("is stopped", () => {
            expect(c.isStopped).toBeTruthy();
        });
    });

    describe("Should do nothing on unstarted chrono", () => {
        let c: Chrono;
        beforeEach(() => {
            c = Chrono.create();
            c.stop();
        });

        test("is not started", () => {
            expect(c.isStarted).toBeFalsy();
        });

        test("is not running", () => {
            expect(c.isRunning).toBeFalsy();
        });

        test("is not stopped", () => {
            expect(c.isStopped).toBeFalsy();
        });
    });

    test("Should return value of the chrono if started", async () => {
        const c = Chrono.create();
        c.start();
        await sleep();
        const result = c.stop();

        expect(result).toBeDefined();
        expect(result).toBeGreaterThan(0);
    });

    test("Should return DEFAULT VALUE if chrono is not started", () => {
        const c = Chrono.create();
        const result = c.stop();

        expect(result).toEqual(Chrono.DEFAULT_VALUE);
    });
});

function sleep(ms = 10) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
