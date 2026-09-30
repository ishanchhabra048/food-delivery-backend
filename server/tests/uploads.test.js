const request = require("supertest");
const { Writable } = require("stream");
const cloudinary = require("../src/config/cloudinary");
const app = require("../src/app");
const User = require("../src/models/user.model");

// Mock cloudinary uploader directly
cloudinary.uploader.upload_stream = vi.fn((options, callback) => {
    const stream = new Writable({
        write(chunk, encoding, next) {
            next();
        },
        final(cb) {
            callback(null, {
                secure_url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
                public_id: "food-delivery/sample_123"
            });
            cb();
        }
    });
    return stream;
});

cloudinary.uploader.destroy = vi.fn().mockResolvedValue({ result: "ok" });

describe("Uploads Test Suite", () => {
    it("should reject non-image file uploads with 400", async () => {
        const owner = await User.create({
            fullName: "Upload Tester",
            email: "uploader@test.com",
            password: "Password123!",
            phoneNumber: "9876543210",
            role: "restaurantOwner"
        });
        const token = owner.generateAccessToken();

        const res = await request(app)
            .post("/api/uploads/image")
            .set("Cookie", [`accessToken=${token}`])
            .attach("image", Buffer.from("fake text file"), "test.txt");

        expect(res.statusCode).toBe(400);
    });

    it("should accept valid image and return cloudinary url and publicId", async () => {
        const owner = await User.create({
            fullName: "Upload Tester 2",
            email: "uploader2@test.com",
            password: "Password123!",
            phoneNumber: "9876543210",
            role: "restaurantOwner"
        });
        const token = owner.generateAccessToken();

        const res = await request(app)
            .post("/api/uploads/image?type=restaurant")
            .set("Cookie", [`accessToken=${token}`])
            .attach("image", Buffer.from([0xff, 0xd8, 0xff, 0xe0]), "test.jpg");

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.url).toBeDefined();
        expect(res.body.data.publicId).toBeDefined();
    });
});
