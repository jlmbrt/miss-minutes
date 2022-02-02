import { Chrono } from "../src/Chrono";

describe("Constructor", () => {
    describe("Create constructor", () => {
        test("Should create new Chrono instance", () => {
            const c = Chrono.create();

            expect(c).toBeDefined();
            expect(c).toBeInstanceOf(Chrono);
        });
    });

    describe("Start constructor", () => {
        test("Should create new Chrono instance", () => {
            const c = Chrono.start();

            expect(c).toBeDefined();
            expect(c).toBeInstanceOf(Chrono);
        });

        test("Should start the new created Chrono", () => {
            const c = Chrono.start();

            expect(c.isStarted).toBeTruthy();
        });
    });
});

describe("Test ID generation of the Chrono", () => {
    describe("Auto generated ID", () => {
        test("must be set if not id is provided", () => {
            const c = Chrono.create();

            expect(c.id).toBeDefined();
            expect(c.id === "").toBeFalsy();
        });

        test("must be unique", () => {
            const nb = 100; // number of created Chrono

            // Create Array(nb) fill with 0
            // Map => create Chrono and keep id only
            const ids = Array(nb)
                .fill(0)
                .map(() => {
                    const c = Chrono.create();
                    return c.id;
                });

            // Set => no duplicate
            const set = new Set(ids);

            // ids array and set must be the same length
            expect(set.size).toEqual(ids.length);
        });
    });

    test("Id must be set correctly if provided", () => {
        const id = "myUniqueId";

        const c = Chrono.create(id);

        expect(c.id).toBeDefined();
        expect(c.id === "").toBeFalsy();
        expect(c.id).toEqual(id);
    });
});

describe("Test start/stop method", () => {
    describe(".start method", () => {
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

        describe("should re-start a stopped chrono", () => {
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

    describe(".stop method", () => {
        describe("should stop a running chrono", () => {
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

        describe("should do nothing on unstarted chrono", () => {
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

        test("should return value of the chrono if started", async () => {
            const c = Chrono.create();
            c.start();
            await sleep();
            const result = c.stop();

            expect(result).toBeDefined();
            expect(result).toBeGreaterThan(0);
        });

        test("should return DEFAULT VALUE if chrono is not started", () => {
            const c = Chrono.create();
            const result = c.stop();

            expect(result).toEqual(Chrono.DEFAULT_VALUE);
        });
    });
});

describe("Test Chrono state", () => {
    describe("Not started Chrono", () => {
        let c: Chrono;
        beforeEach(() => {
            c = Chrono.create();
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

        test("state is 'not started'", () => {
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

        test("is started", () => {
            expect(c.isStarted).toBeTruthy();
        });

        test("is running", () => {
            expect(c.isRunning).toBeTruthy();
        });

        test("is not stopped", () => {
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

        test("is started", () => {
            expect(c.isStarted).toBeTruthy();
        });

        test("is not running", () => {
            expect(c.isRunning).toBeFalsy();
        });

        test("is stopped", () => {
            expect(c.isStopped).toBeTruthy();
        });

        test("state is 'stopped", () => {
            expect(c.state).toBe("stopped");
        });
    });
});

describe("Getting value of the Chrono", () => {
    describe("Not started Chrono", () => {
        let c: Chrono;
        beforeEach(() => {
            c = Chrono.create();
        });
        test(`value must be equal to ${Chrono.DEFAULT_VALUE}`, () => {
            const c = Chrono.create();

            expect(c.value).toEqual(Chrono.DEFAULT_VALUE);
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

            expect(c.value).toBeGreaterThan(0);
        });

        test("value must be greater over time", async () => {
            const nbTest = 100;
            const c = Chrono.start();
            const tests: number[] = [];

            for (let i = 0; i <= nbTest; i++) {
                await sleep();
                tests.push(c.value);
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

            expect(c.value).toBeGreaterThan(0);
        });

        test("value must be equal over time", async () => {
            const nbTest = 100;
            const c = Chrono.start();
            const tests: number[] = [];

            await sleep();
            c.stop();

            for (let i = 0; i <= nbTest; i++) {
                await sleep();
                tests.push(c.value);
            }

            tests.reduce((last, curr) => {
                expect(curr).toEqual(last);
                return curr;
            }, c.value);
        });
    });
});

function sleep(ms = 10) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
