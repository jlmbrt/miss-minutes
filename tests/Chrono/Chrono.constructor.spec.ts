import { Chrono } from "../../src/Chrono";

describe("Chrono - Constructor", () => {
    test("Create constructor should create new Chrono instance", () => {
        const c = Chrono.create();

        expect(c).toBeDefined();
        expect(c).toBeInstanceOf(Chrono);
    });

    test("Start constructor should create new Chrono instance", () => {
        const c = Chrono.start();

        expect(c).toBeDefined();
        expect(c).toBeInstanceOf(Chrono);
    });

    test("Start contructor Should start the new created Chrono", () => {
        const c = Chrono.start();

        expect(c.isStarted).toBeTruthy();
    });
});

describe("Chrono - ID", () => {
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
