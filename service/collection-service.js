const CollectionModel = require('../models/collection-model');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
const UserModel = require('../models/user-model');

class CollectionService {
  async getAllCollections() {
    const collections = CollectionModel.find();
    return collections;
  }

  async createCollection(
    ownerId,
    ownerName,
    collectionTitle,
    collectionDescription,
    country,
    city,
    date
  ) {
    const user = await UserModel.findById(ownerId);

    if (!user) {
      throw ApiError.BadRequest('This user does not exist in the system');
    }

    const collection = await CollectionModel.create({
      ownerId,
      ownerName,
      collectionTitle,
      collectionDescription,
      country,
      city,
      date,
    });

    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto._id, tokens.refreshToken);

    return {
      ...tokens,
      collection: collection,
    };
  }

  async deleteCollection(id) {
    await CollectionModel.findByIdAndDelete({ _id: id });
    return id;
  }

  async updateCollection(
    id,
    ownerId,
    ownerName,
    collectionTitle,
    collectionDescription,
    country,
    city,
    date
  ) {
    const collection = await CollectionModel.findById(id);
    if (!collection) {
      throw ApiError.BadRequest(`Collection was not found`);
    }
    await CollectionModel.findByIdAndUpdate(
      { _id: id },
      {
        $set: {
          ownerId: ownerId,
          ownerName: ownerName,
          collectionTitle: collectionTitle,
          collectionDescription: collectionDescription,
          country: country,
          city: city,
          date: date,
        },
      }
    );

    const currentUser = await UserModel.findById({ _id: ownerId });
    const updatedCollection = await CollectionModel.findById({ _id: id });
    const userDto = new UserDto(currentUser);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      collection: updatedCollection,
    };
  }
}

module.exports = new CollectionService();
