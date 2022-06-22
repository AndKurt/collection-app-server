const collectionService = require('../service/collection-service');

class CollectionController {
  async getAllCollections(req, res, next) {
    try {
      const collections = await collectionService.getAllCollections();
      return res.json(collections);
    } catch (error) {
      next(error);
    }
  }

  async createCollection(req, res, next) {
    try {
      const { ownerId, collectionTitle, collectionDescription, country, city, date } = req.body;
      const collectionData = await collectionService.createCollection(
        ownerId,
        collectionTitle,
        collectionDescription,
        country,
        city,
        date
      );

      res.cookie('refreshToken', collectionData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(collectionData);
    } catch (error) {
      next(error);
    }
  }

  async deleteCollection(req, res, next) {
    try {
      const { id } = req.body;
      const userData = await collectionService.deleteCollection(id);

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async updateCollection(req, res, next) {
    try {
      const { id, ownerId, collectionTitle, collectionDescription, country, city, date } = req.body;
      const collectionData = await collectionService.updateCollection(
        id,
        ownerId,
        collectionTitle,
        collectionDescription,
        country,
        city,
        date
      );

      res.cookie('refreshToken', collectionData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(collectionData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CollectionController();
