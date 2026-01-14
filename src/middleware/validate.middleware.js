import { ApiError } from "../utils/apiError.js";

export const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    errors: {
      wrap: {
        label: "",
      },
    },
  });

  if (error) {
    const errorDetails = error.details.map((details) => ({
      field: details.path[0],
      message: details.message.replace(/['"]/g, ""),
    }));

    return next(new ApiError(400, "Validation Failed", errorDetails));
  }

  req.body = value;

  next();
};
