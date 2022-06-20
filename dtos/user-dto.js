// Data transfer object

module.exports = class UserDto {
  id;
  login;
  email;
  password;
  firstName;
  lastName;
  isLocked;
  isAdmin;

  constructor(model) {
    this.id = model._id;
    this.login = model.login;
    this.email = model.email;
    this.password = model.password;
    this.firstName = model.firstName;
    this.lastName = model.lastName;
    this.isLocked = model.isLocked;
    this.isAdmin = model.isAdmin;
  }
};
