import userService from "../services/user.service.js";

class userController {
  constructor() {
    this.userService = new userService();
  }

  async signUpController(req, res) {
    try {
      const body = req.body;
      const user = await this.userService.signUp(body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async loginController(req, res) {
    try {
      const body = req.body;
      const user = await this.userService.login(body);
      res.json(user);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async authProfileController(req, res) {
    try {
      const TOKEN = req.headers.authorization.split(" ")[1];
      const user = await this.userService.authProfile(TOKEN);
      res.json(user);
    } catch (error) {
      res.status(403).json({
        success: false,
        message: error.message,
      });
    }
  }

  async putAuthProfileController(req, res) {
    try {
      const TOKEN = req.headers.authorization.split(" ")[1];
      const body = req.body;
      const user = await this.userService.putAuthProfile(TOKEN, body);
      res.json(user);
    } catch (error) {
      res.status(403).json({
        success: false,
        message: error.message,
      });
    }
  }

  async changePasswordController(req, res) {
    try {
      const TOKEN = req.headers.authorization.split(" ")[1];
      const body = req.body;
      const user = await this.userService.changePassword(TOKEN, body);
      res.json(user);
    } catch (error) {
      res.status(403).json({
        success: false,
        message: error.message,
      });
    }
  }

  async checkEmailController(req, res) {
    try {
      const params = req.params;
      const email = await this.userService.checkEmail(params);
      res.json(email);
    } catch (error) {
      res.status(403).json({
        success: false,
        message: error.message,
      });
    }
  }

  async logOutController(req, res) {
    try {
      const TOKEN = req.headers.authorization.split(" ")[1];
      const user = await this.userService.logOut(TOKEN);
      res.json(user);
    } catch (error) {
      res.status(403).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deleteProfileController(req, res) {
    try {
      const TOKEN = req.headers.authorization.split(" ")[1];
      const user = await this.userService.deleteProfile(TOKEN);
      res.json(user);
    } catch (error) {
      res.status(403).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default userController;
