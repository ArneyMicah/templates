import { jest } from '@jest/globals';
import { BaseController } from '../../src/controllers/base.controller.js';

// Mock service
const mockService = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
};

// Mock context
const mockContext = {
  request: {
    body: {},
    query: {}
  },
  params: {},
  status: 200,
  body: {}
};

describe('BaseController', () => {
  let controller;

  beforeEach(() => {
    controller = new BaseController(mockService);
    jest.clearAllMocks();
  });

  describe('success', () => {
    it('should set success response', () => {
      const data = { id: 1, name: 'test' };
      controller.success(mockContext, data, 'Success message', 200);

      expect(mockContext.status).toBe(200);
      expect(mockContext.body).toEqual({
        success: true,
        message: 'Success message',
        data: { id: 1, name: 'test' },
        timestamp: expect.any(String)
      });
    });
  });

  describe('error', () => {
    it('should set error response', () => {
      const error = new Error('Test error');
      controller.error(mockContext, 'Error message', 400, error);

      expect(mockContext.status).toBe(400);
      expect(mockContext.body).toEqual({
        success: false,
        message: 'Error message',
        error: 'Test error',
        timestamp: expect.any(String)
      });
    });
  });

  describe('create', () => {
    it('should create resource successfully', async () => {
      const data = { name: 'test' };
      const result = { id: 1, name: 'test' };
      mockContext.request.body = data;
      mockService.create.mockResolvedValue(result);

      await controller.create(mockContext);

      expect(mockService.create).toHaveBeenCalledWith(data);
      expect(mockContext.status).toBe(201);
      expect(mockContext.body.success).toBe(true);
    });

    it('should handle creation error', async () => {
      const error = new Error('Creation failed');
      mockService.create.mockRejectedValue(error);

      await controller.create(mockContext);

      expect(mockContext.status).toBe(400);
      expect(mockContext.body.success).toBe(false);
    });
  });
});



