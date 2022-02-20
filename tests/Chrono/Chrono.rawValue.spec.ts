import { Chrono } from "../../src/Chrono";

describe("Chrono - rawValue propertie", () => {
    describe("Not started Chrono", () => {
        test(`value must be equal to ${Chrono.DEFAULT_VALUE}`, () => {
            const c = Chrono.create();

            expect(c.rawValue).toEqual(Chrono.DEFAULT_VALUE);
        });
    });

    describe("Running Chrono", () => {
        let c: Chrono;
        beforeEach(() => {
            c = Chrono.create();
            c.start();
        });

        test("value must be greater than 0", async () => {
            const c = Chrono.start();
            await sleep();

            expect(c.rawValue).toBeGreaterThan(0);
        });

        test("value must be greater over time", async () => {
            const nbTest = 10;
            const c = Chrono.start();
            const tests: number[] = [];

            for (let i = 0; i <= nbTest; i++) {
                await sleep();
                tests.push(c.rawValue);
            }

            tests.reduce((last, curr) => {
                expect(curr).toBeGreaterThan(last);
                return curr;
            }, Chrono.DEFAULT_VALUE);
        });
    });

    describe("Stopped Chrono", () => {
        let c: Chrono;
        beforeEach(() => {
            c = Chrono.create();
            c.start();
            c.stop();
        });

        test("value must be greater than 0", async () => {
            const c = Chrono.start();
            await sleep();
            c.stop();

            expect(c.rawValue).toBeGreaterThan(0);
        });

        test("value must be equal over time", async () => {
            const nbTest = 10;
            const c = Chrono.start();
            const tests: number[] = [];

            await sleep();
            c.stop();

            for (let i = 0; i <= nbTest; i++) {
                await sleep();
                tests.push(c.rawValue);
            }

            tests.reduce((last, curr) => {
                expect(curr).toEqual(last);
                return curr;
            }, c.rawValue);
        });
    });
});

function sleep(ms = 10) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
