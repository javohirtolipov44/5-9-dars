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

  async putAuthProfile(TOKEN, body) {
    const token = this.jwtService.verifyToken(TOKEN);
    const id = token.user_id;
    const updateUser = await this.userModel.updateOne(
      { _id: id },
      { username: body.username, age: body.age }
    );
    const user = await this.userModel.findOne({ _id: id });
    if (updateUser.modifiedCount === 1) {
      const data = {
        success: true,
        user: {
          username: user.username,
          email: user.email,
          age: user.age,
        },
      };
      return data;
    } else {
      const data = {
        success: false,
        message: updateUser,
      };
      return data;
    }
  }

  async changePassword(TOKEN, body) {
    const token = this.jwtService.verifyToken(TOKEN);
    const id = token.user_id;
    const findUser = await this.userModel.findOne({ _id: id });
    if (findUser) {
      const comparePassword = await bcrypt.compare(
        body.oldPassword,
        findUser.password
      );
      if (comparePassword) {
        const hashedPassword = await bcrypt.hash(body.newPassword, 12);
        const updateUser = await this.userModel.updateOne(
          { _id: id },
          { password: hashedPassword }
        );
        if (updateUser.modifiedCount === 1) {
          const data = {
            success: true,
            message: "Parol muvaffaqiyatli o'zgartirildi",
          };
          return data;
        } else {
          const data = {
            success: false,
            message: updateUser,
          };
          return data;
        }
      } else {
        throw new Error("Parol mos kelmadi");
      }
    } else {
      throw new Error("user not found");
    }
  }

  async checkEmail(params) {
    await this.joiService.validateEmail(params);
    const user = await this.userModel.findOne({ email: params.email });
    if (user) {
      const data = {
        succes: true,
        exists: true,
        message: "Bu email band",
      };
      return data;
    } else {
      const data = {
        succes: true,
        exists: false,
        message: "Bu email band emas",
      };
      return data;
    }
  }

  async logOut(TOKEN) {
    const token = this.jwtService.verifyToken(TOKEN);
    const id = token.user_id;
    const user = await this.userModel.updateOne(
      { _id: id },
      { isActive: false }
    );
    if (!user) {
      throw new Error("Bunday token mavjud emas");
    }
    const data = {
      succes: true,
      message: "Siz tizimdan chiqdingiz",
    };
    return data;
  }

  async deleteProfile(TOKEN) {
    const token = this.jwtService.verifyToken(TOKEN);
    const id = token.user_id;
    const user = await this.userModel.findOneAndDelete({ _id: id });
    if (!user) {
      throw new Error("Bu tokenda user topilmadi");
    }
    return {
      succes: true,
      message: "Profil o'chirildi",
    };
  }
}
export default userService;
