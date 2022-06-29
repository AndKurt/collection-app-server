const itemService = require('../service/item-service');

class ItemController {
  async getAllItems(req, res, next) {
    try {
      const items = await itemService.getAllItems();
      return res.json(items);
    } catch (error) {
      next(error);
    }
  }

  async createItem(req, res, next) {
    try {
      const { ownerId, collectionId, ownerName, itemTitle, itemDescription, imgLink } = req.body;
      const itemData = await itemService.createItem(
        ownerId,
        collectionId,
        ownerName,
        itemTitle,
        itemDescription,
        imgLink
      );

      res.cookie('refreshToken', itemData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(itemData);
    } catch (error) {
      next(error);
    }
  }

  async deleteItem(req, res, next) {
    try {
      const { id } = req.body;
      const itemData = await itemService.deleteItem(id);

      return res.json(itemData);
    } catch (error) {
      next(error);
    }
  }

  async updateCollection(req, res, next) {
    try {
      const { id, ownerId, collectionId, ownerName, itemTitle, itemDescription, imgLink } =
        req.body;
      const itemData = await itemService.updateItem(
        id,
        ownerId,
        collectionId,
        ownerName,
        itemTitle,
        itemDescription,
        imgLink
      );

      res.cookie('refreshToken', itemData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.json(itemData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ItemController();
