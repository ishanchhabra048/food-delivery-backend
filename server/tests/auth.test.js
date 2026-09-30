const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");

describe("Auth & RBAC Test Suite", () => {
    const testUserData = {
        fullName: "Test Customer",
        email: "customer@test.com",
        password: "Password123!",
        phoneNumber: "9876543210",
        role: "User"
    };

    it("should register a new user successfully", async () => {
        const res = await request(app)
            .post("/api/users/register")
            .send(testUserData);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.email).toBe(testUserData.email);
        expect(res.body.data.password).toBeUndefined();
    });

    it("should login registered user and set httpOnly cookies", async () => {
        await User.create(testUserData);

        const res = await request(app)
            .post("/api/users/login")
            .send({
                email: testUserData.email,
                password: testUserData.password
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.headers["set-cookie"]).toBeDefined();
        
        const cookies = res.headers["set-cookie"].join(";");
        expect(cookies).toContain("accessToken=");
        expect(cookies).toContain("refreshToken=");
        expect(cookies).toContain("HttpOnly");
    });

    it("should reject login with wrong password", async () => {
        await User.create(testUserData);

        const res = await request(app)
            .post("/api/users/login")
            .send({
                email: testUserData.email,
                password: "WrongPassword!"
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it("should block a regular User from restaurantOwner routes (RBAC)", async () => {
        const user = await User.create(testUserData);
        const token = user.generateAccessToken();

        const res = await request(app)
            .post("/api/restaurants")
            .set("Cookie", [`accessToken=${token}`])
            .send({
                name: "Forbidden Bistro",
                address: "123 Nowhere St"
            });

        expect(res.statusCode).toBe(403);
    });

    it("should logout and clear cookies", async () => {
        const user = await User.create(testUserData);
        const token = user.generateAccessToken();

        const res = await request(app)
            .post("/api/users/logout")
            .set("Cookie", [`accessToken=${token}`]);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });
});
