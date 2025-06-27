import React, { useState } from 'react';
import { Organization } from '../types';
import { Building2, Users, MapPin, Calendar, Edit2, Trash2, Plus } from 'lucide-react';
import OrganizationModal from './OrganizationModal';

interface OrganizationListProps {
  organizations: Organization[];
  onEdit: (org: Organization) => void;
  onDelete: (id: string) => void;
  onAdd: (org: Omit<Organization, 'id'>) => void;
  searchTerm: string;
}

const OrganizationList: React.FC<OrganizationListProps> = ({
  organizations,
  onEdit,
  onDelete,
  onAdd,
  searchTerm
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.manager?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || org.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      company: '公司',
      department: '部门',
      team: '团队',
      branch: '分支机构'
    };
    return labels[type] || type;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: '活跃',
      inactive: '非活跃',
      pending: '待审核'
    };
    return labels[status] || status;
  };

  const handleAdd = () => {
    setEditingOrg(null);
    setIsModalOpen(true);
  };

  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    setIsModalOpen(true);
  };

  const handleSave = (orgData: Omit<Organization, 'id'>) => {
    if (editingOrg) {
      onEdit({ ...orgData, id: editingOrg.id });
    } else {
      onAdd(orgData);
    }
    setIsModalOpen(false);
    setEditingOrg(null);
  };

  return (
    <div className="space-y-6">
      {/* 过滤器 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="all">全部类型</option>
            <option value="company">公司</option>
            <option value="department">部门</option>
            <option value="team">团队</option>
            <option value="branch">分支机构</option>
          </select>
          <div className="text-sm text-gray-600">
            共 {filteredOrganizations.length} 个组织
          </div>
        </div>
        
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>新增组织</span>
        </button>
      </div>

      {/* 组织列表 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  组织信息
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  类型
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  负责人
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  人员数量
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrganizations.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <Building2 className="w-5 h-5 text-gray-400 mt-1" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{org.name}</div>
                        {org.description && (
                          <div className="text-sm text-gray-500">{org.description}</div>
                        )}
                        {org.location && (
                          <div className="flex items-center mt-1 text-xs text-gray-400">
                            <MapPin className="w-3 h-3 mr-1" />
                            {org.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getTypeLabel(org.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {org.manager || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <Users className="w-4 h-4 mr-1 text-gray-400" />
                      {org.employeeCount}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(org.status)}`}>
                      {getStatusLabel(org.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(org.createdAt).toLocaleDateString('zh-CN')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(org)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                        title="编辑"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(org.id)}
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

      {/* 组织编辑/新增模态框 */}
      {isModalOpen && (
        <OrganizationModal
          organization={editingOrg}
          organizations={organizations}
          onSave={handleSave}
          onClose={() => {
            setIsModalOpen(false);
            setEditingOrg(null);
          }}
        />
      )}
    </div>
  );
};

export default OrganizationList;