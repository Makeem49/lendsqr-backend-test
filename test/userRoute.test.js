const app = require("../index")
const chaiHttp = require("chai-http")
const chai = require("chai")
const expect = chai.expect;
const {dummy, new_dummy_data} = require('../src/helpers/dummy_data')
const User = require("../src/database/Users.model")

// Assert style 
chai.should()

chai.use(chaiHttp)



describe("API Users endpoint testing", function () {
    
    before(async (done) => {
        await User.deleteMany({}, function (err) {})
    })


    it("return all user", function (done) {
        chai.request("http://localhost:3000/api/v1/users")
        .get("/")
        .end((err, response) => {
            if (err) throw err 
            response.should.have.status(200);
            response.body.should.be.a("array");
            done()
        })
    })


    it("return error 401 error if token not provided to get a user", function (done) {
        chai.request("http://localhost:3000/api/v1/users/631a6a5cb4e1411bc6095a83")
        .get("/")
        .end((err, response) => {
            if (err) throw err 
            response.should.have.status(401);
            response.body.should.be.a("object");
            const errorValue = response.body.error.message 
            expect(errorValue).to.be.equal("Unauthorized")
            done()
        })
    })


    it("return error 401 error if token provided has expired", function (done) {
        chai.request("http://localhost:3000/api/v1/users/631a6a5cb4e1411bc6095a83")
        .get("/").set('AUthorization', "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjI1MjU4OTcsImV4cCI6MTY2MjUyNTk5NywiYXVkIjoiNjMxN2E5MDI1OWE2ODFmNTNkYjZiNTJkIiwiaXNzIjoid3d3LkxlbmRzcXIuY29tIn0.S7XA-jsYmhEddbHyJZT1AimC5Sg5uA4orMrz6m2GDUA")
        .end((err, response) => {
            if (err) throw err 
            response.should.have.status(401)
            response.body.should.be.a("object");
            const errorValue = response.body.error.message 
            expect(errorValue).to.be.equal("jwt expired")
            done()
        })
    })

    it("return 409 error if user with a unique data like email, bvn, username e.t.c already exist", function(done) {
        chai.request("http://localhost:3000/api/v1/users")
        .post("/")
        .send(dummy)
        .end((err, res) => {
            res.should.have.status(409)
            done()
        })
    })


    it("return 201 if a new user with no existing data in the database is registered", function(done) {
        chai.request("http://localhost:3000/api/v1/users")
        .post('/')
        .send(new_dummy_data)
        .end((err, res) => {
            res.should.have.status(201)
            done()
        })
    })

})

