/**
 * 基础服务函数
 * 提供通用的服务方法
 */

// 存储数据的数组
let data = [];

/**
 * 初始化数据
 * @param {Array} initialData - 初始数据
 */
export const initializeData = (initialData = []) => {
    data = [...initialData];
};

/**
 * 创建记录
 * @param {Object} recordData - 要创建的数据
 * @returns {Object} 创建的记录
 */
export const create = (recordData) => {
    const newRecord = {
        id: data.length + 1,
        ...recordData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    data.push(newRecord);
    return newRecord;
};

/**
 * 根据ID查找记录
 * @param {number} id - 记录ID
 * @returns {Object|null} 找到的记录或null
 */
export const findById = (id) => {
    return data.find(item => item.id === parseInt(id)) || null;
};

/**
 * 获取所有记录
 * @param {Object} options - 查询选项
 * @returns {Array} 记录列表
 */
export const findAll = (options = {}) => {
    let result = [...data];
    
    // 简单的分页处理
    if (options.limit && options.offset !== undefined) {
        result = result.slice(options.offset, options.offset + options.limit);
    }
    
    return result;
};

/**
 * 更新记录
 * @param {number} id - 记录ID
 * @param {Object} recordData - 要更新的数据
 * @returns {Object|null} 更新后的记录或null
 */
export const update = (id, recordData) => {
    const index = data.findIndex(item => item.id === parseInt(id));
    
    if (index === -1) {
        return null;
    }
    
    data[index] = {
        ...data[index],
        ...recordData,
        id: parseInt(id),
        updatedAt: new Date().toISOString()
    };
    
    return data[index];
};

/**
 * 删除记录
 * @param {number} id - 记录ID
 * @returns {Object|null} 删除的记录或null
 */
export const deleteRecord = (id) => {
    const index = data.findIndex(item => item.id === parseInt(id));
    
    if (index === -1) {
        return null;
    }
    
    return data.splice(index, 1)[0];
};

/**
 * 统计记录数量
 * @param {Object} filters - 过滤条件
 * @returns {number} 记录数量
 */
export const count = (filters = {}) => {
    return data.length;
};

/**
 * 获取所有数据
 * @returns {Array} 所有数据
 */
export const getAllData = () => {
    return [...data];
};

/**
 * 清空数据
 */
export const clearData = () => {
    data = [];
};

// 保持向后兼容性，导出BaseService对象
export const BaseService = {
    initializeData,
    create,
    findById,
    findAll,
    update,
    delete: deleteRecord,
    count,
    getAllData,
    clearData
};



