import Joi from "joi";

class joiService {
  constructor() {
    this.joi = Joi;
  }
  async validateUserData(data) {
    const schema = this.joi.object({
      username: this.joi.string().min(5).max(15).required(),
      password: this.joi.string().min(6).max(15).required(),
      email: this.joi
        .string()
        .regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/)
        .required(),
      age: this.joi.number().required(),
      role: this.joi.string(),
    });

    await schema.validateAsync(data);
  }
}

export default joiService;
