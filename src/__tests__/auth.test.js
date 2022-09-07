const request = require("supertest")
const app = require("../../index")

describe("register", () => {
    it("return status code", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toEqual(201)
    })
})