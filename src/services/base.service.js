import logger from '../utils/logger.js';

export class BaseService {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    try {
      const result = await this.model.create(data);
      logger.info(`Created ${this.model.name} with ID: ${result.id}`);
      return result;
    } catch (error) {
      logger.error(`Failed to create ${this.model.name}:`, error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const result = await this.model.findByPk(id);
      if (!result) {
        throw new Error(`${this.model.name} not found with ID: ${id}`);
      }
      return result;
    } catch (error) {
      logger.error(`Failed to find ${this.model.name} by ID ${id}:`, error);
      throw error;
    }
  }

  async findAll(options = {}) {
    try {
      const { where, order, limit, offset, include } = options;
      const result = await this.model.findAll({
        where,
        order,
        limit,
        offset,
        include
      });
      return result;
    } catch (error) {
      logger.error(`Failed to find all ${this.model.name}:`, error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      const [updatedCount] = await this.model.update(data, {
        where: { id }
      });
      
      if (updatedCount === 0) {
        throw new Error(`${this.model.name} not found with ID: ${id}`);
      }
      
      logger.info(`Updated ${this.model.name} with ID: ${id}`);
      return await this.findById(id);
    } catch (error) {
      logger.error(`Failed to update ${this.model.name} with ID ${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const deletedCount = await this.model.destroy({
        where: { id }
      });
      
      if (deletedCount === 0) {
        throw new Error(`${this.model.name} not found with ID: ${id}`);
      }
      
      logger.info(`Deleted ${this.model.name} with ID: ${id}`);
      return { success: true, deletedCount };
    } catch (error) {
      logger.error(`Failed to delete ${this.model.name} with ID ${id}:`, error);
      throw error;
    }
  }

  async count(where = {}) {
    try {
      return await this.model.count({ where });
    } catch (error) {
      logger.error(`Failed to count ${this.model.name}:`, error);
      throw error;
    }
  }

  async findOne(where = {}) {
    try {
      return await this.model.findOne({ where });
    } catch (error) {
      logger.error(`Failed to find one ${this.model.name}:`, error);
      throw error;
    }
  }

  async bulkCreate(dataArray) {
    try {
      const result = await this.model.bulkCreate(dataArray);
      logger.info(`Bulk created ${result.length} ${this.model.name} records`);
      return result;
    } catch (error) {
      logger.error(`Failed to bulk create ${this.model.name}:`, error);
      throw error;
    }
  }

  async transaction(callback) {
    try {
      return await this.model.sequelize.transaction(callback);
    } catch (error) {
      logger.error(`Transaction failed for ${this.model.name}:`, error);
      throw error;
    }
  }
}



