import joi from "joi";

export const registerSchema = joi.object({
  fullName: joi.string().min(2).max(50).trim().required().messages({
    "string.empty": "Full name is required.",
    "string.min": "Full name must be at least 2 characters long.",
    "string.max": "Full name cannot exceed 50 characters.",
  }),
  username: joi
    .string()
    .alphanum()
    .min(3)
    .max(30)
    .lowercase()
    .trim()
    .required()
    .messages({
      "string.empty": "Username is required.",
      "string.alphanum": "Username must contain only letters and numbers.",
      "string.min": "Username must be at least 3 characters long.",
      "string.max": "Username cannot exceed 30 characters.",
    }),
  email: joi
    .string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .trim()
    .required()
    .messages({
      "string.email": "Please provide a valid email address.",
      "string.empty": "Email is required.",
    }),
  password: joi
    .string()
    .min(6)
    .max(128)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must have 1 uppercase, 1 lowercase letter, and 1 number.",
      "string.min": "Password must be at least 6 characters long.",
      "string.max": "Password cannot exceed 128 characters.",
      "any.required": "Password is a required field.",
    }),
});

export const loginSchema = joi
  .object({
    username: joi.string().lowercase().trim(),
    email: joi.string().email().lowercase().trim(),
    password: joi.string().required().messages({
      "any.required": "Password is required to login.",
    }),
  })
  .xor("email", "username")
  .messages({
    "object.xor": "Provide either email or username, not both.",
  });

export const changePasswordSchema = joi.object({
  oldPassword: joi.string().min(6).required().messages({
    "string.empty": "Old password is required.",
    "string.min": "Old password must be at least 6 characters long.",
  }),
  newPassword: joi
    .string()
    .min(6)
    .max(128)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"))
    .disallow(joi.ref("oldPassword")) // prevent same as old
    .required()
    .messages({
      "string.pattern.base":
        "New password must have 1 uppercase, 1 lowercase letter, and 1 number.",
      "string.min": "New password must be at least 6 characters long.",
      "string.max": "New password cannot exceed 128 characters.",
      "any.required": "New password is required.",
      "any.invalid": "New password cannot be the same as old password.",
    }),
});

export const updateAccountSchema = joi
  .object({
    fullName: joi.string().min(2).max(50).trim().optional().messages({
      "string.min": "Full name must be at least 2 characters long.",
      "string.max": "Full name cannot exceed 50 characters.",
    }),
    email: joi
      .string()
      .email({ tlds: { allow: false } })
      .lowercase()
      .trim()
      .optional()
      .messages({
        "string.email": "Please provide a valid email address.",
      }),
  })
  .or("fullName", "email") // require at least one field
  .messages({
    "object.missing": "At least one field (fullName or email) is required.",
  });
