/**
 * 基础服务类
 * 提供通用的服务方法
 */
export class BaseService {
    constructor() {
        this.data = [];
    }

    /**
     * 创建记录
     * @param {Object} data - 要创建的数据
     * @returns {Object} 创建的记录
     */
    create(data) {
        const newRecord = {
            id: this.data.length + 1,
            ...data,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.data.push(newRecord);
        return newRecord;
    }

    /**
     * 根据ID查找记录
     * @param {number} id - 记录ID
     * @returns {Object|null} 找到的记录或null
     */
    findById(id) {
        return this.data.find(item => item.id === parseInt(id)) || null;
    }

    /**
     * 获取所有记录
     * @param {Object} options - 查询选项
     * @returns {Array} 记录列表
     */
    findAll(options = {}) {
        let result = [...this.data];
        
        // 简单的分页处理
        if (options.limit && options.offset !== undefined) {
            result = result.slice(options.offset, options.offset + options.limit);
        }
        
        return result;
    }

    /**
     * 更新记录
     * @param {number} id - 记录ID
     * @param {Object} data - 要更新的数据
     * @returns {Object|null} 更新后的记录或null
     */
    update(id, data) {
        const index = this.data.findIndex(item => item.id === parseInt(id));
        
        if (index === -1) {
            return null;
        }
        
        this.data[index] = {
            ...this.data[index],
            ...data,
            id: parseInt(id),
            updatedAt: new Date().toISOString()
        };
        
        return this.data[index];
    }

    /**
     * 删除记录
     * @param {number} id - 记录ID
     * @returns {Object|null} 删除的记录或null
     */
    delete(id) {
        const index = this.data.findIndex(item => item.id === parseInt(id));
        
        if (index === -1) {
            return null;
        }
        
        return this.data.splice(index, 1)[0];
    }

    /**
     * 统计记录数量
     * @param {Object} filters - 过滤条件
     * @returns {number} 记录数量
     */
    count(filters = {}) {
        return this.data.length;
    }
}



