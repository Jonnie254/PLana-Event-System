import Joi from "joi";

// User schema
export const userSchema = Joi.object({
  first_name: Joi.string().min(2).max(30).required(),
  last_name: Joi.string().min(2).max(30).required(),
  password: Joi.string().min(6).max(50).required(),
  email: Joi.string()
    .email()
    .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .required(),
  phone: Joi.string().min(10).max(15).required(),
  profileImage: Joi.string().uri().optional(),
  role: Joi.string().valid("admin", "planner", "user").optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
});
export const requestRoleSchema = Joi.object({
  role: Joi.string().valid("planner").required(),
  user_id: Joi.string().required(),
});
export const passwordResetSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).max(50).required(),
});

export const bookingSchema = Joi.object({
  eventId: Joi.string().required(),
  userId: Joi.string().required(),
  ticketType: Joi.string().valid("single", "group").required(),
  groupEmails: Joi.array()
    .items(Joi.string().email())
    .when("ticketType", {
      is: "group",
      then: Joi.array().length(Joi.ref("groupSize")).required(),
    })
    .optional(),
});
