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
}

export default userController;
