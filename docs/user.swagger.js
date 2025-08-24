/**
 * 用户API Swagger文档
 */

export const userPaths = {
  '/api/users': {
    get: {
      tags: ['用户管理'],
      summary: '获取用户列表',
      description: '获取用户列表，支持分页',
      parameters: [
        {
          name: 'page',
          in: 'query',
          description: '页码',
          required: false,
          schema: {
            type: 'integer',
            default: 1,
            minimum: 1
          }
        },
        {
          name: 'limit',
          in: 'query',
          description: '每页数量',
          required: false,
          schema: {
            type: 'integer',
            default: 10,
            minimum: 1,
            maximum: 100
          }
        }
      ],
      responses: {
        200: {
          description: '成功获取用户列表',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true
                  },
                  message: {
                    type: 'string',
                    example: '获取用户列表成功'
                  },
                  data: {
                    type: 'object',
                    properties: {
                      list: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/User'
                        }
                      },
                      pagination: {
                        $ref: '#/components/schemas/Pagination'
                      }
                    }
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['用户管理'],
      summary: '创建新用户',
      description: '创建新的用户账户',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['username', 'email'],
              properties: {
                username: {
                  type: 'string',
                  description: '用户名',
                  minLength: 3,
                  maxLength: 50
                },
                email: {
                  type: 'string',
                  format: 'email',
                  description: '邮箱地址'
                },
                password: {
                  type: 'string',
                  description: '密码',
                  minLength: 6
                },
                firstName: {
                  type: 'string',
                  description: '名',
                  maxLength: 50
                },
                lastName: {
                  type: 'string',
                  description: '姓',
                  maxLength: 50
                },
                phone: {
                  type: 'string',
                  description: '电话号码'
                },
                role: {
                  type: 'string',
                  enum: ['admin', 'user'],
                  default: 'user',
                  description: '用户角色'
                },
                status: {
                  type: 'string',
                  enum: ['active', 'inactive', 'suspended'],
                  default: 'active',
                  description: '用户状态'
                },
                avatar: {
                  type: 'string',
                  format: 'uri',
                  description: '头像URL'
                }
              }
            },
            examples: {
              basic: {
                summary: '基础用户信息',
                value: {
                  username: 'newuser',
                  email: 'newuser@example.com',
                  password: 'password123',
                  firstName: '张',
                  lastName: '三',
                  phone: '13800138000'
                }
              }
            }
          }
        }
      },
      responses: {
        201: {
          description: '用户创建成功',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true
                  },
                  message: {
                    type: 'string',
                    example: '用户创建成功'
                  },
                  data: {
                    $ref: '#/components/schemas/User'
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        },
        400: {
          description: '请求参数错误',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  },
  '/api/users/{id}': {
    get: {
      tags: ['用户管理'],
      summary: '根据ID获取用户详情',
      description: '根据用户ID获取用户的详细信息',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: '用户ID',
          schema: {
            type: 'integer',
            minimum: 1
          }
        }
      ],
      responses: {
        200: {
          description: '成功获取用户详情',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true
                  },
                  message: {
                    type: 'string',
                    example: '获取用户成功'
                  },
                  data: {
                    $ref: '#/components/schemas/User'
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        },
        404: {
          description: '用户不存在',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    put: {
      tags: ['用户管理'],
      summary: '更新用户信息',
      description: '更新指定用户的详细信息',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: '用户ID',
          schema: {
            type: 'integer',
            minimum: 1
          }
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                username: {
                  type: 'string',
                  description: '用户名',
                  minLength: 3,
                  maxLength: 50
                },
                email: {
                  type: 'string',
                  format: 'email',
                  description: '邮箱地址'
                },
                firstName: {
                  type: 'string',
                  description: '名',
                  maxLength: 50
                },
                lastName: {
                  type: 'string',
                  description: '姓',
                  maxLength: 50
                },
                phone: {
                  type: 'string',
                  description: '电话号码'
                },
                role: {
                  type: 'string',
                  enum: ['admin', 'user'],
                  description: '用户角色'
                },
                status: {
                  type: 'string',
                  enum: ['active', 'inactive', 'suspended'],
                  description: '用户状态'
                },
                avatar: {
                  type: 'string',
                  format: 'uri',
                  description: '头像URL'
                }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: '用户更新成功',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true
                  },
                  message: {
                    type: 'string',
                    example: '用户更新成功'
                  },
                  data: {
                    $ref: '#/components/schemas/User'
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        },
        404: {
          description: '用户不存在',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    delete: {
      tags: ['用户管理'],
      summary: '删除用户',
      description: '删除指定的用户',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          description: '用户ID',
          schema: {
            type: 'integer',
            minimum: 1
          }
        }
      ],
      responses: {
        200: {
          description: '用户删除成功',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: {
                    type: 'boolean',
                    example: true
                  },
                  message: {
                    type: 'string',
                    example: '用户删除成功'
                  },
                  data: {
                    $ref: '#/components/schemas/User'
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time'
                  }
                }
              }
            }
          }
        },
        404: {
          description: '用户不存在',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    }
  }
};

export const userSchemas = {
  User: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        description: '用户ID'
      },
      username: {
        type: 'string',
        description: '用户名'
      },
      email: {
        type: 'string',
        format: 'email',
        description: '邮箱地址'
      },
      firstName: {
        type: 'string',
        description: '名'
      },
      lastName: {
        type: 'string',
        description: '姓'
      },
      phone: {
        type: 'string',
        description: '电话号码'
      },
      role: {
        type: 'string',
        enum: ['admin', 'user'],
        description: '用户角色'
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive', 'suspended'],
        description: '用户状态'
      },
      avatar: {
        type: 'string',
        format: 'uri',
        description: '头像URL'
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: '创建时间'
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        description: '更新时间'
      }
    }
  },
  Pagination: {
    type: 'object',
    properties: {
      total: {
        type: 'integer',
        description: '总记录数'
      },
      page: {
        type: 'integer',
        description: '当前页码'
      },
      limit: {
        type: 'integer',
        description: '每页数量'
      },
      totalPages: {
        type: 'integer',
        description: '总页数'
      },
      hasNext: {
        type: 'boolean',
        description: '是否有下一页'
      },
      hasPrev: {
        type: 'boolean',
        description: '是否有上一页'
      }
    }
  },
  Error: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false
      },
      message: {
        type: 'string',
        description: '错误消息'
      },
      data: {
        type: 'object',
        description: '错误详情',
        nullable: true
      },
      timestamp: {
        type: 'string',
        format: 'date-time'
      }
    }
  }
};
