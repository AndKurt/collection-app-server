const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const tokenModel = require('../models/token-model');

class UserService {
  async registration(login, email, password, firstName, lastName) {
    const candidateLogin = await UserModel.findOne({ login });
    const candidateEmail = await UserModel.findOne({ email });
    if (candidateLogin) {
      throw ApiError.BadRequest(`User with login '${login}' already exists`);
    }
    if (candidateEmail) {
      throw ApiError.BadRequest(`User with email address '${email}' already exists`);
    }

    const salt = bcrypt.genSaltSync();
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await UserModel.create({
      login,
      email,
      password: hashPassword,
      firstName,
      lastName,
    });

    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto._id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async login(login, password) {
    const user = await UserModel.findOne({ login });
    if (!user) {
      throw ApiError.BadRequest(`User with login '${login}' was not found`);
    }

    if (user.isLocked) {
      throw ApiError.BadRequest(`Access is denied. You have to contact the administrator`);
    }

    const isPassEquals = await bcrypt.compare(password, user.password);
    if (!isPassEquals) {
      throw ApiError.BadRequest(`Incorrect password`);
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto._id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken);

    return token;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDataBase = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDataBase) {
      throw ApiError.UnauthorizedError();
    }

    const user = await UserModel.findById(userData._id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto._id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
    };
  }

  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }

  async deleteUser(id, refreshToken) {
    await UserModel.findByIdAndDelete({ _id: id });
    const userRefreshToken = await tokenModel
      .findOne({ user: id })
      .then((user) => user.refreshToken);
    await tokenService.removeToken(userRefreshToken);
    return id;
  }

  async updateUser(id, login, email, password, firstName, lastName, isLocked, isAdmin, currentId) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw ApiError.BadRequest(`User was not found`);
    }

    let hashPassword = user.password;
    if (password) {
      const salt = bcrypt.genSaltSync();
      hashPassword = await bcrypt.hash(password, salt);
    }
    await UserModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          login: login,
          email: email,
          password: hashPassword,
          firstName: firstName,
          lastName: lastName,
          isLocked: isLocked,
          isAdmin: isAdmin,
        },
      }
    );

    const currentUser = await UserModel.findById({ _id: currentId });
    const updatedUser = await UserModel.findById({ _id: id });

    const userDto = new UserDto(currentUser);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: updatedUser,
    };
  }
}

module.exports = new UserService();
