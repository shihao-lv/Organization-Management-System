import React, { useState, useEffect } from 'react';
import { Organization } from '../types';
import { X, Building2 } from 'lucide-react';

interface OrganizationModalProps {
  organization: Organization | null;
  organizations: Organization[];
  onSave: (org: Omit<Organization, 'id'>) => void;
  onClose: () => void;
  defaultParentId?: string;
}

const OrganizationModal: React.FC<OrganizationModalProps> = ({
  organization,
  organizations,
  onSave,
  onClose,
  defaultParentId
}) => {
  // 表单数据状态
  const [formData, setFormData] = useState({
    name: '',
    type: 'department' as Organization['type'],
    parentId: defaultParentId || '',
    description: '',
    establishedDate: '',
    status: 'active' as Organization['status'],
    location: '',
    manager: '',
    employeeCount: 0
  });

  // 表单验证错误状态
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 初始化表单数据
  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name,
        type: organization.type,
        parentId: organization.parentId || '',
        description: organization.description || '',
        establishedDate: organization.establishedDate,
        status: organization.status,
        location: organization.location || '',
        manager: organization.manager || '',
        employeeCount: organization.employeeCount
      });
    } else if (defaultParentId) {
      setFormData(prev => ({ ...prev, parentId: defaultParentId }));
    }
  }, [organization, defaultParentId]);

  // 表单验证函数
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 必填字段验证
    if (!formData.name.trim()) {
      newErrors.name = '组织名称不能为空';
    }

    if (!formData.establishedDate) {
      newErrors.establishedDate = '成立日期不能为空';
    }

    // 人员数量验证
    if (formData.employeeCount < 0) {
      newErrors.employeeCount = '人员数量不能为负数';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 表单提交处理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    if (!validateForm()) {
      return;
    }
    
    // 构建组织数据
    const orgData: Omit<Organization, 'id'> = {
      ...formData,
      createdBy: '系统管理员',
      createdAt: organization?.createdAt || new Date().toISOString(),
      updatedBy: organization ? '系统管理员' : undefined,
      updatedAt: organization ? new Date().toISOString() : undefined
    };

    onSave(orgData);
  };

  // 输入框变化处理
  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    // 清除对应字段的错误信息
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  // 获取可选的上级组织（排除自身和团队类型）
  const availableParents = organizations.filter(org => 
    org.id !== organization?.id && org.type !== 'team'
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* 模态框头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              {organization ? '编辑组织' : '新增组织'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 组织名称 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                组织名称 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="请输入组织名称"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* 组织类型 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                组织类型 *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value as Organization['type'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="company">公司</option>
                <option value="department">部门</option>
                <option value="team">团队</option>
                <option value="branch">分支机构</option>
              </select>
            </div>

            {/* 上级组织 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                上级组织
              </label>
              <select
                value={formData.parentId}
                onChange={(e) => handleInputChange('parentId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">无上级组织</option>
                {availableParents.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 成立日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                成立日期 *
              </label>
              <input
                type="date"
                value={formData.establishedDate}
                onChange={(e) => handleInputChange('establishedDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.establishedDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.establishedDate && <p className="mt-1 text-sm text-red-600">{errors.establishedDate}</p>}
            </div>

            {/* 状态 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as Organization['status'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="active">活跃</option>
                <option value="inactive">非活跃</option>
                <option value="pending">待审核</option>
              </select>
            </div>

            {/* 负责人 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                负责人
              </label>
              <input
                type="text"
                value={formData.manager}
                onChange={(e) => handleInputChange('manager', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="请输入负责人姓名"
              />
            </div>

            {/* 所在地点 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                所在地点
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="请输入所在地点"
              />
            </div>

            {/* 人员数量 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                人员数量
              </label>
              <input
                type="number"
                min="0"
                value={formData.employeeCount}
                onChange={(e) => handleInputChange('employeeCount', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.employeeCount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="请输入人员数量"
              />
              {errors.employeeCount && <p className="mt-1 text-sm text-red-600">{errors.employeeCount}</p>}
            </div>
          </div>

          {/* 组织描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              组织描述
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="请输入组织描述"
            />
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              {organization ? '保存修改' : '创建组织'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrganizationModal;