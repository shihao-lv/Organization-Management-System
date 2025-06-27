import React from 'react';
import { Search, Plus, Download, Upload, Bell, LogOut } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onNewItem: () => void;
  onImport: () => void;
  onExport: () => void;
  onNotificationClick: () => void;
  activeSection: string;
  onLogout: () => void;
  unreadCount: number;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchChange,
  onNewItem,
  onImport,
  onExport,
  onNotificationClick,
  activeSection,
  onLogout,
  unreadCount
}) => {
  // 根据当前页面获取标题
  const getSectionTitle = (section: string) => {
    const titles: Record<string, string> = {
      'org-list': '组织列表管理',
      'org-tree': '组织架构树',
      'batch-org-import': '批量导入组织',
      'personnel-list': '人员列表管理',
      'batch-personnel-import': '批量导入人员',
      'personnel-export': '人员数据导出',
      'operation-stats': '数据统计分析',
      'personnel-stats': '数据统计分析',
      'org-stats': '数据统计分析',
      'statistics': '数据统计分析'
    };
    return titles[section] || '企业组织管理';
  };

  // 根据当前页面获取操作按钮
  const getActionButtons = (section: string) => {
    // 只在列表页面和组织树页面显示操作按钮
    if (section.includes('list') || section === 'org-tree') {
      return (
        <>
          {/* 导入按钮 */}
          <button 
            onClick={onImport}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>导入</span>
          </button>
          {/* 导出按钮 */}
          <button 
            onClick={onExport}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>导出</span>
          </button>
        </>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* 左侧标题和日期 */}
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-gray-900">{getSectionTitle(activeSection)}</h2>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </div>
        </div>

        {/* 右侧搜索和操作区域 */}
        <div className="flex items-center space-x-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索组织或人员..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          
          {/* 动态操作按钮 */}
          {getActionButtons(activeSection)}
          
          {/* 通知按钮 */}
          <button 
            onClick={onNotificationClick}
            className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Bell className="w-5 h-5" />
            {/* 未读通知数量徽章 */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          
          {/* 退出登录按钮 */}
          <button 
            onClick={onLogout}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            title="退出登录"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;