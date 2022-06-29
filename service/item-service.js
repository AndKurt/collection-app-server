const ItemModel = require('../models/item-model');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const UserModel = require('../models/user-model');

class ItemService {
  async getAllItems() {
    const items = ItemModel.find();
    return items;
  }

  async createItem(ownerId, collectionId, ownerName, itemTitle, itemDescription, imgLink) {
    const user = await UserModel.findById(ownerId);

    if (!user) {
      throw ApiError.BadRequest('This user does not exist in the system');
    }

    const item = await ItemModel.create({
      ownerId,
      collectionId,
      ownerName,
      itemTitle,
      itemDescription,
      imgLink,
    });

    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto._id, tokens.refreshToken);

    return {
      ...tokens,
      items: item,
    };
  }

  async deleteItem(id) {
    await ItemModel.findByIdAndDelete({ _id: id });
    return id;
  }

  async updateItem(id, ownerId, collectionId, ownerName, itemTitle, itemDescription, imgLink) {
    const item = await ItemModel.findById(id);
    if (!item) {
      throw ApiError.BadRequest(`Item was not found`);
    }
    await ItemModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          ownerId: ownerId,
          collectionId: collectionId,
          ownerName: ownerName,
          itemTitle: itemTitle,
          itemDescription: itemDescription,
          imgLink: imgLink,
        },
      }
    );

    const currentUser = await UserModel.findById({ _id: ownerId });
    const updatedItem = await ItemModel.findById({ _id: id });
    const userDto = new UserDto(currentUser);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      items: updatedItem,
    };
  }
}

module.exports = new ItemService();
