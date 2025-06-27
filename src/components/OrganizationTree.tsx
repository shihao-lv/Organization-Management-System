import React, { useState } from 'react';
import { Organization, Personnel } from '../types';
import { 
  Building2, 
  Users, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Edit2, 
  Trash2, 
  MapPin,
  User
} from 'lucide-react';
import OrganizationModal from './OrganizationModal';
import PersonnelModal from './PersonnelModal';

interface OrganizationTreeProps {
  organizations: Organization[];
  personnel: Personnel[];
  onEditOrganization: (org: Organization) => void;
  onDeleteOrganization: (id: string) => void;
  onAddOrganization: (org: Omit<Organization, 'id'>) => void;
  onEditPersonnel: (person: Personnel) => void;
  onDeletePersonnel: (id: string) => void;
  onAddPersonnel: (person: Omit<Personnel, 'id'>) => void;
  searchTerm: string;
}

const OrganizationTree: React.FC<OrganizationTreeProps> = ({
  organizations,
  personnel,
  onEditOrganization,
  onDeleteOrganization,
  onAddOrganization,
  onEditPersonnel,
  onDeletePersonnel,
  onAddPersonnel,
  searchTerm
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1']));
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isPersonnelModalOpen, setIsPersonnelModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [editingPersonnel, setEditingPersonnel] = useState<Personnel | null>(null);
  const [selectedOrgForPersonnel, setSelectedOrgForPersonnel] = useState<string>('');

  // 构建树形结构
  const buildTree = (orgs: Organization[]): Organization[] => {
    const orgMap = new Map<string, Organization>();
    const roots: Organization[] = [];

    // 创建组织映射
    orgs.forEach(org => {
      orgMap.set(org.id, { ...org, children: [] });
    });

    // 构建父子关系
    orgs.forEach(org => {
      const orgNode = orgMap.get(org.id)!;
      if (org.parentId && orgMap.has(org.parentId)) {
        const parent = orgMap.get(org.parentId)!;
        parent.children!.push(orgNode);
      } else {
        roots.push(orgNode);
      }
    });

    return roots;
  };

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getPersonnelByOrg = (orgId: string) => {
    return personnel.filter(p => p.organizationId === orgId);
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      company: '🏢',
      department: '🏛️',
      team: '👥',
      branch: '🌿'
    };
    return icons[type as keyof typeof icons] || '📁';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'text-green-600',
      inactive: 'text-red-600',
      pending: 'text-yellow-600'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600';
  };

  const handleAddOrg = (parentId?: string) => {
    setEditingOrg(null);
    setSelectedOrgForPersonnel(parentId || '');
    setIsOrgModalOpen(true);
  };

  const handleEditOrg = (org: Organization) => {
    setEditingOrg(org);
    setIsOrgModalOpen(true);
  };

  const handleAddPersonnel = (orgId: string) => {
    setEditingPersonnel(null);
    setSelectedOrgForPersonnel(orgId);
    setIsPersonnelModalOpen(true);
  };

  const handleEditPersonnelClick = (person: Personnel) => {
    setEditingPersonnel(person);
    setIsPersonnelModalOpen(true);
  };

  const handleSaveOrg = (orgData: Omit<Organization, 'id'>) => {
    if (editingOrg) {
      onEditOrganization({ ...orgData, id: editingOrg.id });
    } else {
      onAddOrganization(orgData);
    }
    setIsOrgModalOpen(false);
    setEditingOrg(null);
  };

  const handleSavePersonnel = (personData: Omit<Personnel, 'id'>) => {
    if (editingPersonnel) {
      onEditPersonnel({ ...personData, id: editingPersonnel.id });
    } else {
      onAddPersonnel(personData);
    }
    setIsPersonnelModalOpen(false);
    setEditingPersonnel(null);
  };

  const filterTree = (nodes: Organization[], term: string): Organization[] => {
    if (!term) return nodes;
    
    return nodes.filter(node => {
      const matchesNode = node.name.toLowerCase().includes(term.toLowerCase()) ||
                         node.description?.toLowerCase().includes(term.toLowerCase()) ||
                         node.manager?.toLowerCase().includes(term.toLowerCase());
      
      const hasMatchingPersonnel = getPersonnelByOrg(node.id).some(person =>
        person.name.toLowerCase().includes(term.toLowerCase()) ||
        person.position.toLowerCase().includes(term.toLowerCase()) ||
        person.email.toLowerCase().includes(term.toLowerCase())
      );
      
      const hasMatchingChildren = node.children && filterTree(node.children, term).length > 0;
      
      return matchesNode || hasMatchingPersonnel || hasMatchingChildren;
    }).map(node => ({
      ...node,
      children: node.children ? filterTree(node.children, term) : []
    }));
  };

  const renderTreeNode = (org: Organization, level: number = 0) => {
    const isExpanded = expandedNodes.has(org.id);
    const orgPersonnel = getPersonnelByOrg(org.id);
    const hasChildren = org.children && org.children.length > 0;
    const hasPersonnel = orgPersonnel.length > 0;

    return (
      <div key={org.id} className="select-none">
        {/* 组织节点 */}
        <div 
          className="flex items-center py-2 px-3 hover:bg-gray-50 rounded-md group transition-colors"
          style={{ paddingLeft: `${level * 20 + 12}px` }}
        >
          <div className="flex items-center flex-1 min-w-0">
            {(hasChildren || hasPersonnel) && (
              <button
                onClick={() => toggleNode(org.id)}
                className="mr-2 p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </button>
            )}
            
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <span className="text-lg">{getTypeIcon(org.type)}</span>
              <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 truncate">{org.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-gray-100 ${getStatusColor(org.status)}`}>
                    {org.status}
                  </span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                  {org.manager && (
                    <span className="flex items-center">
                      <User className="w-3 h-3 mr-1" />
                      {org.manager}
                    </span>
                  )}
                  {org.location && (
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {org.location}
                    </span>
                  )}
                  <span className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    {org.employeeCount}人
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleAddOrg(org.id)}
              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
              title="添加子组织"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleAddPersonnel(org.id)}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="添加人员"
            >
              <User className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleEditOrg(org)}
              className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
              title="编辑组织"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteOrganization(org.id)}
              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              title="删除组织"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 展开的内容 */}
        {isExpanded && (
          <div>
            {/* 人员列表 */}
            {hasPersonnel && (
              <div style={{ paddingLeft: `${(level + 1) * 20 + 12}px` }}>
                {orgPersonnel.map(person => (
                  <div
                    key={person.id}
                    className="flex items-center py-2 px-3 hover:bg-blue-50 rounded-md group transition-colors ml-6"
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{person.name}</span>
                          <span className="text-sm text-gray-600">- {person.position}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            person.status === 'active' ? 'bg-green-100 text-green-800' :
                            person.status === 'inactive' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {person.status === 'active' ? '在职' : 
                             person.status === 'inactive' ? '离职' : '请假'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {person.email} • {person.phone}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditPersonnelClick(person)}
                        className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                        title="编辑人员"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeletePersonnel(person.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="删除人员"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 子组织 */}
            {hasChildren && org.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const treeData = buildTree(organizations);
  const filteredTree = filterTree(treeData, searchTerm);

  return (
    <div className="space-y-6">
      {/* 工具栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleAddOrg()}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>新增根组织</span>
          </button>
          <div className="text-sm text-gray-600">
            共 {organizations.length} 个组织，{personnel.length} 名人员
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setExpandedNodes(new Set(organizations.map(o => o.id)))}
            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            展开全部
          </button>
          <button
            onClick={() => setExpandedNodes(new Set())}
            className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors"
          >
            收起全部
          </button>
        </div>
      </div>

      {/* 组织树 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4">
          {filteredTree.length > 0 ? (
            <div className="space-y-1">
              {filteredTree.map(org => renderTreeNode(org))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? '未找到匹配的组织或人员' : '暂无组织数据'}
            </div>
          )}
        </div>
      </div>

      {/* 组织编辑模态框 */}
      {isOrgModalOpen && (
        <OrganizationModal
          organization={editingOrg}
          organizations={organizations}
          onSave={handleSaveOrg}
          onClose={() => {
            setIsOrgModalOpen(false);
            setEditingOrg(null);
          }}
          defaultParentId={selectedOrgForPersonnel}
        />
      )}

      {/* 人员编辑模态框 */}
      {isPersonnelModalOpen && (
        <PersonnelModal
          personnel={editingPersonnel}
          organizations={organizations}
          onSave={handleSavePersonnel}
          onClose={() => {
            setIsPersonnelModalOpen(false);
            setEditingPersonnel(null);
          }}
          defaultOrganizationId={selectedOrgForPersonnel}
        />
      )}
    </div>
  );
};

export default OrganizationTree;