const ApiError = require("../utils/ApiError");

const validate = (schema, source = "body") => {

    return (req, res, next) => {

        const dataToValidate =
            source === "query"
                ? req.query
                : source === "params"
                ? req.params
                : req.body;

        const result = schema.safeParse(dataToValidate);

        if (!result.success) {

            const errors = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message
            }));

            return next(
                new ApiError(
                    400,
                    "Validation failed",
                    errors
                )
            );
        }

        // Store validated and transformed data
        if (source === "query") {
            req.query = result.data;
        } else if (source === "params") {
            req.params = result.data;
        } else {
            req.body = result.data;
        }

        next();
    };
};

validate.validate = validate;

module.exports = validate;