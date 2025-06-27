import React from 'react';
import { Building2, Users, BarChart3, ChevronDown, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  expandedItems: Set<string>;
  onToggleExpand: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  expandedItems,
  onToggleExpand
}) => {
  // 菜单项配置
  const menuItems = [
    {
      id: 'organizations',
      label: '组织架构管理',
      icon: Building2,
      children: [
        { id: 'org-list', label: '组织列表' },
        { id: 'org-tree', label: '组织树' },
        { id: 'batch-org-import', label: '批量导入组织' }
      ]
    },
    {
      id: 'personnel',
      label: '人员管理',
      icon: Users,
      children: [
        { id: 'personnel-list', label: '人员列表' },
        { id: 'batch-personnel-import', label: '批量导入人员' },
        { id: 'personnel-export', label: '数据导出' }
      ]
    },
    {
      id: 'statistics',
      label: '数据统计',
      icon: BarChart3,
      children: [
        { id: 'statistics', label: '统计分析' }
      ]
    }
  ];

  return (
    <div className="w-64 bg-black text-white h-full flex flex-col">
      {/* 系统标题区域 */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <Building2 className="w-8 h-8 text-blue-400" />
          <div>
            <h1 className="text-lg font-bold">南平铝业组织管理系统</h1>
            <p className="text-xs text-gray-400">Organization Management</p>
          </div>
        </div>
      </div>

      {/* 导航菜单区域 */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <div key={item.id}>
            {/* 主菜单项 */}
            <button
              onClick={() => onToggleExpand(item.id)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
              {/* 展开/收起图标 */}
              {expandedItems.has(item.id) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            
            {/* 子菜单项 */}
            {expandedItems.has(item.id) && (
              <div className="ml-6 mt-2 space-y-1">
                {item.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => onSectionChange(child.id)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      activeSection === child.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* 底部用户信息区域 */}
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500">
          <p>当前用户: 组织管理小组（T2201）</p>
          <p>登录时间: {new Date().toLocaleString('zh-CN')}</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;