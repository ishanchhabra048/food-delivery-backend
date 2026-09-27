const CASHFREE_BASE_URL = "https://sandbox.cashfree.com/pg";

const cashfreeHeaders = {
    "Content-Type": "application/json",
    "x-api-version": process.env.CASHFREE_API_VERSION,
    "x-client-id": process.env.CASHFREE_CLIENT_ID,
    "x-client-secret": process.env.CASHFREE_CLIENT_SECRET
};

module.exports = {
    CASHFREE_BASE_URL,
    cashfreeHeaders
};