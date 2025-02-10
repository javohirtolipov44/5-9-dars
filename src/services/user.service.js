import userModel from "../models/user.model.js";
import joiService from "./joi.service.js";
import jwtService from "./jwt.service.js";
import bcrypt from "bcrypt";

class userService {
  constructor() {
    this.userModel = userModel;
    this.jwtService = new jwtService();
    this.joiService = new joiService();
  }

  async signUp(body) {
    const findUser = await this.userModel.findOne({
      username: body.username,
    });
    if (findUser) throw new Error("username already existed");
    await this.joiService.validateUserData(body);
    const hashedPassword = await bcrypt.hash(body.password, 12);
    const user = await this.userModel.create({
      ...body,
      password: hashedPassword,
    });
    const token = this.jwtService.generateToken(user._id);
    const data = {
      success: true,
      token,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
    return data;
  }

  async login(body) {
    const findUser = await this.userModel.findOne({ username: body.username });
    if (findUser) {
      const comparePassword = await bcrypt.compare(
        body.password,
        findUser.password
      );
      if (comparePassword) {
        const token = this.jwtService.generateToken(findUser._id);
        const data = {
          success: true,
          token,
          user: {
            username: findUser.username,
            email: findUser.email,
            role: findUser.role,
          },
        };
        return data;
      } else {
        throw new Error("password incorrect");
      }
    } else {
      throw new Error("user not found");
    }
  }

  async authProfile(TOKEN) {
    const token = this.jwtService.verifyToken(TOKEN);
    const id = token.user_id;
    const user = await this.userModel.findOne({ _id: id });
    const data = {
      success: true,
      user: {
        username: user.username,
        email: user.email,
        age: user.age,
        role: user.role,
      },
    };
    return data;
  }
}
export default userService;
