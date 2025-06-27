import React, { useState } from 'react';
import { Personnel, Organization } from '../types';
import { User, Mail, Phone, Calendar, Edit2, Trash2, Plus } from 'lucide-react';
import PersonnelModal from './PersonnelModal';

interface PersonnelListProps {
  personnel: Personnel[];
  organizations: Organization[];
  onEdit: (person: Personnel) => void;
  onDelete: (id: string) => void;
  onAdd: (person: Omit<Personnel, 'id'>) => void;
  searchTerm: string;
}

const PersonnelList: React.FC<PersonnelListProps> = ({
  personnel,
  organizations,
  onEdit,
  onDelete,
  onAdd,
  searchTerm
}) => {
  // 模态框状态管理
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<Personnel | null>(null);
  // 筛选状态
  const [selectedOrg, setSelectedOrg] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // 过滤人员列表
  const filteredPersonnel = personnel.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOrg = selectedOrg === 'all' || person.organizationId === selectedOrg;
    const matchesStatus = selectedStatus === 'all' || person.status === selectedStatus;
    return matchesSearch && matchesOrg && matchesStatus;
  });

  // 获取状态颜色样式
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      'on-leave': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // 获取状态标签
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: '在职',
      inactive: '离职',
      'on-leave': '请假'
    };
    return labels[status] || status;
  };

  // 根据组织ID获取组织名称
  const getOrganizationName = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    return org?.name || '未知组织';
  };

  // 新增人员处理
  const handleAdd = () => {
    setEditingPersonnel(null);
    setIsModalOpen(true);
  };

  // 编辑人员处理
  const handleEdit = (person: Personnel) => {
    setEditingPersonnel(person);
    setIsModalOpen(true);
  };

  // 保存人员处理
  const handleSave = (personData: Omit<Personnel, 'id'>) => {
    if (editingPersonnel) {
      onEdit({ ...personData, id: editingPersonnel.id });
    } else {
      onAdd(personData);
    }
    setIsModalOpen(false);
    setEditingPersonnel(null);
  };

  return (
    <div className="space-y-6">
      {/* 过滤器和操作区域 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* 组织筛选 */}
          <select
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="all">全部组织</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
          
          {/* 状态筛选 */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="all">全部状态</option>
            <option value="active">在职</option>
            <option value="inactive">离职</option>
            <option value="on-leave">请假</option>
          </select>
          
          {/* 统计信息 */}
          <div className="text-sm text-gray-600">
            共 {filteredPersonnel.length} 名人员
          </div>
        </div>
        
        {/* 新增按钮 */}
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>新增人员</span>
        </button>
      </div>

      {/* 人员列表表格 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* 表头 */}
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  人员信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  职位
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  所属组织
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  联系方式
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  入职时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            {/* 表体 */}
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPersonnel.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                  {/* 人员信息列 */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{person.name}</div>
                        <div className="text-sm text-gray-500">{person.department}</div>
                      </div>
                    </div>
                  </td>
                  {/* 职位列 */}
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {person.position}
                  </td>
                  {/* 所属组织列 */}
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {getOrganizationName(person.organizationId)}
                  </td>
                  {/* 联系方式列 */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-3 h-3 mr-2" />
                        {person.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-3 h-3 mr-2" />
                        {person.phone}
                      </div>
                    </div>
                  </td>
                  {/* 状态列 */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(person.status)}`}>
                      {getStatusLabel(person.status)}
                    </span>
                  </td>
                  {/* 入职时间列 */}
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(person.joinDate).toLocaleDateString('zh-CN')}
                    </div>
                  </td>
                  {/* 操作列 */}
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(person)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        title="编辑"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(person.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 人员编辑/新增模态框 */}
      {isModalOpen && (
        <PersonnelModal
          personnel={editingPersonnel}
          organizations={organizations}
          onSave={handleSave}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPersonnel(null);
          }}
        />
      )}
    </div>
  );
};

export default PersonnelList;