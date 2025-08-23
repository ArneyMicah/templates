import logger from '../utils/logger.js';
import { HTTP_STATUS } from '../constants/http-status.js';

export class BaseController {
  constructor(service) {
    this.service = service;
  }

  // 成功响应
  success(ctx, data = null, message = 'Success', status = HTTP_STATUS.OK) {
    ctx.status = status;
    ctx.body = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    };
  }

  // 错误响应
  error(ctx, message = 'Internal Server Error', status = HTTP_STATUS.INTERNAL_SERVER_ERROR, error = null) {
    ctx.status = status;
    ctx.body = {
      success: false,
      message,
      error: error?.message || error,
      timestamp: new Date().toISOString()
    };
    
    if (error) {
      logger.error(`Controller error: ${message}`, error);
    }
  }

  // 分页响应
  paginated(ctx, data, page, limit, total, message = 'Success') {
    ctx.status = HTTP_STATUS.OK;
    ctx.body = {
      success: true,
      message,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      timestamp: new Date().toISOString()
    };
  }

  // 创建资源
  async create(ctx) {
    try {
      const data = ctx.request.body;
      const result = await this.service.create(data);
      this.success(ctx, result, 'Created successfully', HTTP_STATUS.CREATED);
    } catch (error) {
      this.error(ctx, 'Failed to create resource', HTTP_STATUS.BAD_REQUEST, error);
    }
  }

  // 获取单个资源
  async getById(ctx) {
    try {
      const { id } = ctx.params;
      const result = await this.service.findById(id);
      this.success(ctx, result, 'Resource found');
    } catch (error) {
      if (error.message.includes('not found')) {
        this.error(ctx, 'Resource not found', HTTP_STATUS.NOT_FOUND, error);
      } else {
        this.error(ctx, 'Failed to get resource', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
      }
    }
  }

  // 获取所有资源
  async getAll(ctx) {
    try {
      const { page = 1, limit = 10, ...filters } = ctx.query;
      const offset = (page - 1) * limit;
      
      const [data, total] = await Promise.all([
        this.service.findAll({ ...filters, limit: parseInt(limit), offset }),
        this.service.count(filters)
      ]);
      
      this.paginated(ctx, data, page, limit, total, 'Resources retrieved successfully');
    } catch (error) {
      this.error(ctx, 'Failed to get resources', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // 更新资源
  async update(ctx) {
    try {
      const { id } = ctx.params;
      const data = ctx.request.body;
      const result = await this.service.update(id, data);
      this.success(ctx, result, 'Updated successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        this.error(ctx, 'Resource not found', HTTP_STATUS.NOT_FOUND, error);
      } else {
        this.error(ctx, 'Failed to update resource', HTTP_STATUS.BAD_REQUEST, error);
      }
    }
  }

  // 删除资源
  async delete(ctx) {
    try {
      const { id } = ctx.params;
      const result = await this.service.delete(id);
      this.success(ctx, result, 'Deleted successfully');
    } catch (error) {
      if (error.message.includes('not found')) {
        this.error(ctx, 'Resource not found', HTTP_STATUS.NOT_FOUND, error);
      } else {
        this.error(ctx, 'Failed to delete resource', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
      }
    }
  }

  // 批量操作
  async bulkOperation(ctx, operation) {
    try {
      const { ids, ...data } = ctx.request.body;
      
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return this.error(ctx, 'Invalid IDs provided', HTTP_STATUS.BAD_REQUEST);
      }
      
      const results = await Promise.all(
        ids.map(id => operation(id, data))
      );
      
      this.success(ctx, results, 'Bulk operation completed successfully');
    } catch (error) {
      this.error(ctx, 'Bulk operation failed', HTTP_STATUS.INTERNAL_SERVER_ERROR, error);
    }
  }

  // 验证请求数据
  validateRequest(ctx, schema) {
    try {
      const { error, value } = schema.validate(ctx.request.body);
      if (error) {
        this.error(ctx, 'Validation failed', HTTP_STATUS.BAD_REQUEST, error);
        return false;
      }
      ctx.request.body = value;
      return true;
    } catch (error) {
      this.error(ctx, 'Validation error', HTTP_STATUS.BAD_REQUEST, error);
      return false;
    }
  }
}



