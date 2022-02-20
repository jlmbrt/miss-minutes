import { Chrono } from "../../src/Chrono";

describe("Chrono - start method", () => {
    describe("Should start a not started chrono", () => {
        let c: Chrono;
        beforeEach(() => {
            c = Chrono.create();
            c.start();
        });

        test("is started", () => {
            expect(c.isStarted).toBeTruthy();
        });

        test("is running", () => {
            expect(c.isRunning).toBeTruthy();
        });

        test("is not stopped", () => {
            expect(c.isStopped).toBeFalsy();
        });
    });

    describe("Should re-start a stopped chrono", () => {
        let c: Chrono;
        beforeEach(() => {
            c = Chrono.create();
            c.start();
            c.stop();
            c.start();
        });

        test("is started", () => {
            expect(c.isStarted).toBeTruthy();
        });

        test("is running", () => {
            expect(c.isRunning).toBeTruthy();
        });

        test("is not stopped", () => {
            expect(c.isStopped).toBeFalsy();
        });
    });
});
