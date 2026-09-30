const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

beforeAll(async () => {
    process.env.NODE_ENV = "test";
    process.env.JWT_ACCESS_SECRET = "test_jwt_access_secret_123456789";
    process.env.JWT_REFRESH_SECRET = "test_jwt_refresh_secret_123456789";
    process.env.JWT_ACCESS_EXPIRY = "1h";
    process.env.JWT_REFRESH_EXPIRY = "7d";
    process.env.LOG_LEVEL = "silent";

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) {
        await mongoServer.stop();
    }
});

beforeEach(async () => {
    if (mongoose.connection.readyState === 1) {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
    }
});
