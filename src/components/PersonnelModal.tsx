import React, { useState, useEffect } from 'react';
import { Personnel, Organization } from '../types';
import { X, User } from 'lucide-react';

interface PersonnelModalProps {
  personnel: Personnel | null;
  organizations: Organization[];
  onSave: (person: Omit<Personnel, 'id'>) => void;
  onClose: () => void;
  defaultOrganizationId?: string;
}

const PersonnelModal: React.FC<PersonnelModalProps> = ({
  personnel,
  organizations,
  onSave,
  onClose,
  defaultOrganizationId
}) => {
  // 表单数据状态
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    organizationId: defaultOrganizationId || '',
    email: '',
    phone: '',
    joinDate: '',
    status: 'active' as Personnel['status'],
    department: '',
    manager: '',
    salary: 0,
    age: 0,
    gender: 'male' as Personnel['gender'],
    education: ''
  });

  // 表单验证错误状态
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 初始化表单数据
  useEffect(() => {
    if (personnel) {
      setFormData({
        name: personnel.name,
        position: personnel.position,
        organizationId: personnel.organizationId,
        email: personnel.email,
        phone: personnel.phone,
        joinDate: personnel.joinDate,
        status: personnel.status,
        department: personnel.department,
        manager: personnel.manager || '',
        salary: personnel.salary || 0,
        age: personnel.age || 0,
        gender: personnel.gender || 'male',
        education: personnel.education || ''
      });
    } else if (defaultOrganizationId) {
      setFormData(prev => ({ ...prev, organizationId: defaultOrganizationId }));
    }
  }, [personnel, defaultOrganizationId]);

  // 表单验证函数
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 必填字段验证
    if (!formData.name.trim()) {
      newErrors.name = '姓名不能为空';
    }

    if (!formData.position.trim()) {
      newErrors.position = '职位不能为空';
    }

    if (!formData.organizationId) {
      newErrors.organizationId = '请选择所属组织';
    }

    if (!formData.email.trim()) {
      newErrors.email = '邮箱不能为空';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '电话不能为空';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '电话格式不正确';
    }

    if (!formData.joinDate) {
      newErrors.joinDate = '入职日期不能为空';
    }

    // 年龄验证
    if (formData.age && (formData.age < 16 || formData.age > 100)) {
      newErrors.age = '年龄应在16-100之间';
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
    
    // 获取选中的组织信息
    const selectedOrg = organizations.find(org => org.id === formData.organizationId);
    
    // 构建人员数据
    const personData: Omit<Personnel, 'id'> = {
      ...formData,
      department: selectedOrg?.name || formData.department,
      createdBy: '系统管理员',
      createdAt: personnel?.createdAt || new Date().toISOString(),
      updatedBy: personnel ? '系统管理员' : undefined,
      updatedAt: personnel ? new Date().toISOString() : undefined
    };

    onSave(personData);
  };

  // 输入框变化处理
  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    // 清除对应字段的错误信息
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* 模态框头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              {personnel ? '编辑人员' : '新增人员'}
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
            {/* 姓名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                姓名 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="请输入姓名"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* 职位 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                职位 *
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.position ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="请输入职位"
              />
              {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
            </div>

            {/* 所属组织 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                所属组织 *
              </label>
              <select
                value={formData.organizationId}
                onChange={(e) => handleInputChange('organizationId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.organizationId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">请选择组织</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
              {errors.organizationId && <p className="mt-1 text-sm text-red-600">{errors.organizationId}</p>}
            </div>

            {/* 邮箱 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                邮箱 *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="请输入邮箱"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* 电话 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                电话 *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="请输入电话号码"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            {/* 入职日期 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                入职日期 *
              </label>
              <input
                type="date"
                value={formData.joinDate}
                onChange={(e) => handleInputChange('joinDate', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.joinDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.joinDate && <p className="mt-1 text-sm text-red-600">{errors.joinDate}</p>}
            </div>

            {/* 状态 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as Personnel['status'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="active">在职</option>
                <option value="inactive">离职</option>
                <option value="on-leave">请假</option>
              </select>
            </div>

            {/* 直属领导 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                直属领导
              </label>
              <input
                type="text"
                value={formData.manager}
                onChange={(e) => handleInputChange('manager', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="请输入直属领导"
              />
            </div>

            {/* 薪资 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                薪资 (元)
              </label>
              <input
                type="number"
                min="0"
                value={formData.salary}
                onChange={(e) => handleInputChange('salary', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="请输入薪资"
              />
            </div>

            {/* 年龄 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                年龄
              </label>
              <input
                type="number"
                min="16"
                max="100"
                value={formData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                  errors.age ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="请输入年龄"
              />
              {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
            </div>

            {/* 性别 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                性别
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value as Personnel['gender'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>

            {/* 学历 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                学历
              </label>
              <select
                value={formData.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="">请选择学历</option>
                <option value="高中">高中</option>
                <option value="大专">大专</option>
                <option value="本科">本科</option>
                <option value="硕士">硕士</option>
                <option value="博士">博士</option>
              </select>
            </div>
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
              {personnel ? '保存修改' : '创建人员'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonnelModal;