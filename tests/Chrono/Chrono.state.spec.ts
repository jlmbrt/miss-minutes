import { Chrono } from "../../src/Chrono";

describe("Chrono - states properties", () => {
    describe("Not started Chrono", () => {
        let c: Chrono;
        beforeEach(() => {
            c = Chrono.create();
        });

        test("is not started - isStarted === false", () => {
            expect(c.isStarted).toBeFalsy();
        });

        test("is not running - isRunning === false", () => {
            expect(c.isRunning).toBeFalsy();
        });

        test("is not stopped - isStopped === flase", () => {
            expect(c.isStopped).toBeFalsy();
        });

        test("state should be 'not started'", () => {
            expect(c.state).toBe("not started");
        });
    });

    describe("Started Chrono", () => {
        let c: Chrono;
        beforeEach(() => {
            c = Chrono.create();
            c.start();
        });

        beforeEach(() => {
            c.start();
        });

        test("is started - isStated === true", () => {
            expect(c.isStarted).toBeTruthy();
        });

        test("is running - isRunning === true", () => {
            expect(c.isRunning).toBeTruthy();
        });

        test("is not stopped - iStopped === false", () => {
            expect(c.isStopped).toBeFalsy();
        });

        test("state should be 'running'", () => {
            expect(c.state).toBe("running");
        });
    });

    describe("Start then Stopped Chrono", () => {
        let c: Chrono;
        beforeEach(async () => {
            c = Chrono.create();
            c.start();
            await sleep();
            c.stop();
        });

        test("is started - isStarted === true", () => {
            expect(c.isStarted).toBeTruthy();
        });

        test("is not running - isRunning === false", () => {
            expect(c.isRunning).toBeFalsy();
        });

        test("is stopped - isStopped === true", () => {
            expect(c.isStopped).toBeTruthy();
        });

        test("state should be 'stopped", () => {
            expect(c.state).toBe("stopped");
        });
    });
});

function sleep(ms = 10) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
