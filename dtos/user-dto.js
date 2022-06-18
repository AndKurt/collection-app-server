// Data transfer object

module.exports = class UserDto {
  login;
  email;
  id;

  constructor(model) {
    this.login = model.login;
    this.email = model.email;
    this.id = model._id;
  }
};
