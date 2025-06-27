import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OrganizationList from './components/OrganizationList';
import OrganizationTree from './components/OrganizationTree';
import PersonnelList from './components/PersonnelList';
import StatisticsDashboard from './components/StatisticsDashboard';
import BatchImport from './components/BatchImport';
import SearchResults from './components/SearchResults';
import NotificationModal from './components/NotificationModal';
import { Organization, Personnel, Statistics, SearchResult, BatchImportResult, OperationLog } from './types';
import { mockOrganizations, mockPersonnel, mockOperationLogs } from './data/mockData';

function App() {
  // 登录状态管理
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // 当前激活的页面部分
  const [activeSection, setActiveSection] = useState('org-list');
  // 侧边栏展开项目
  const [expandedItems, setExpandedItems] = useState(new Set(['organizations']));
  // 搜索相关状态
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  // 数据状态管理
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [personnel, setPersonnel] = useState<Personnel[]>(mockPersonnel);
  const [operationLogs, setOperationLogs] = useState<OperationLog[]>(mockOperationLogs);
  // 批量导入相关状态
  const [showBatchImport, setShowBatchImport] = useState(false);
  const [batchImportType, setBatchImportType] = useState<'organization' | 'personnel'>('organization');
  // 通知相关状态
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: '1', title: '系统更新', message: '系统将于今晚进行维护更新', time: '2025-06-15 10:30', read: false },
    { id: '2', title: '数据备份完成', message: '今日数据备份已完成', time: '2025-06-15 09:00', read: true },
    { id: '3', title: '新员工入职', message: '技术部新增3名员工', time: '2025-06-14 16:20', read: false }
  ]);

  // 计算统计数据
  const statistics: Statistics = {
    totalOrganizations: organizations.length,
    totalPersonnel: personnel.length,
    activeOrganizations: organizations.filter(org => org.status === 'active').length,
    activePersonnel: personnel.filter(person => person.status === 'active').length,
    recentOperations: operationLogs.length,
    organizationsByType: organizations.reduce((acc, org) => {
      acc[org.type] = (acc[org.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    personnelByStatus: personnel.reduce((acc, person) => {
      acc[person.status] = (acc[person.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    personnelByDepartment: personnel.reduce((acc, person) => {
      acc[person.department] = (acc[person.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    averageAge: personnel.length > 0 ? 
      personnel.reduce((sum, person) => sum + (person.age || 0), 0) / personnel.length : 0,
    genderDistribution: personnel.reduce((acc, person) => {
      const gender = person.gender || 'male';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    educationDistribution: personnel.reduce((acc, person) => {
      const education = person.education || '未知';
      acc[education] = (acc[education] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    salaryRanges: personnel.reduce((acc, person) => {
      const salary = person.salary || 0;
      const range = salary < 10000 ? '10k以下' :
                   salary < 20000 ? '10k-20k' :
                   salary < 30000 ? '20k-30k' : '30k以上';
      acc[range] = (acc[range] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    monthlyJoinTrend: personnel.reduce((acc, person) => {
      const month = new Date(person.joinDate).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  // 搜索功能实现
  useEffect(() => {
    if (searchTerm.trim()) {
      const results: SearchResult[] = [];
      
      // 搜索组织
      organizations.forEach(org => {
        const matchedFields: string[] = [];
        const term = searchTerm.toLowerCase();
        
        if (org.name.toLowerCase().includes(term)) matchedFields.push('名称');
        if (org.description?.toLowerCase().includes(term)) matchedFields.push('描述');
        if (org.manager?.toLowerCase().includes(term)) matchedFields.push('负责人');
        if (org.location?.toLowerCase().includes(term)) matchedFields.push('地点');
        
        if (matchedFields.length > 0) {
          results.push({
            type: 'organization',
            id: org.id,
            name: org.name,
            details: org,
            matchedFields
          });
        }
      });
      
      // 搜索人员
      personnel.forEach(person => {
        const matchedFields: string[] = [];
        const term = searchTerm.toLowerCase();
        
        if (person.name.toLowerCase().includes(term)) matchedFields.push('姓名');
        if (person.position.toLowerCase().includes(term)) matchedFields.push('职位');
        if (person.email.toLowerCase().includes(term)) matchedFields.push('邮箱');
        if (person.phone.includes(term)) matchedFields.push('电话');
        if (person.department.toLowerCase().includes(term)) matchedFields.push('部门');
        
        if (matchedFields.length > 0) {
          results.push({
            type: 'personnel',
            id: person.id,
            name: person.name,
            details: person,
            matchedFields
          });
        }
      });
      
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchTerm, organizations, personnel]);

  // 添加操作日志的辅助函数
  const addOperationLog = (log: Omit<OperationLog, 'id' | 'timestamp'>) => {
    const newLog: OperationLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setOperationLogs(prev => [newLog, ...prev]);
  };

  // 登录处理
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  // 退出处理
  const handleLogout = () => {
    setIsLoggedIn(false);
    setSearchTerm('');
    setShowSearchResults(false);
  };

  // 侧边栏展开/收起处理
  const handleToggleExpand = (item: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(item)) {
      newExpanded.delete(item);
    } else {
      newExpanded.add(item);
    }
    setExpandedItems(newExpanded);
  };

  // 新增按钮处理
  const handleNewItem = () => {
    if (activeSection.includes('org')) {
      setBatchImportType('organization');
    } else if (activeSection.includes('personnel')) {
      setBatchImportType('personnel');
    }
    console.log('New item for section:', activeSection);
  };

  // 导入按钮处理
  const handleImport = () => {
    if (activeSection.includes('org')) {
      setBatchImportType('organization');
    } else if (activeSection.includes('personnel')) {
      setBatchImportType('personnel');
    }
    setShowBatchImport(true);
  };

  // 导出按钮处理
  const handleExport = () => {
    let dataToExport: any[] = [];
    let filename = '';
    
    if (activeSection.includes('org')) {
      // 导出组织数据
      dataToExport = organizations.map(org => ({
        '组织名称': org.name,
        '组织类型': org.type === 'company' ? '公司' : 
                   org.type === 'department' ? '部门' : 
                   org.type === 'team' ? '团队' : '分支机构',
        '上级组织': organizations.find(p => p.id === org.parentId)?.name || '无',
        '描述': org.description || '',
        '成立日期': org.establishedDate,
        '状态': org.status === 'active' ? '活跃' : 
               org.status === 'inactive' ? '非活跃' : '待审核',
        '地点': org.location || '',
        '负责人': org.manager || '',
        '人员数量': org.employeeCount,
        '创建时间': new Date(org.createdAt).toLocaleString('zh-CN')
      }));
      filename = `组织数据_${new Date().toISOString().slice(0, 10)}.xlsx`;
    } else if (activeSection.includes('personnel')) {
      // 导出人员数据
      dataToExport = personnel.map(person => ({
        '姓名': person.name,
        '职位': person.position,
        '所属组织': organizations.find(org => org.id === person.organizationId)?.name || '未知',
        '邮箱': person.email,
        '电话': person.phone,
        '入职日期': person.joinDate,
        '状态': person.status === 'active' ? '在职' : 
               person.status === 'inactive' ? '离职' : '请假',
        '部门': person.department,
        '直属领导': person.manager || '',
        '薪资': person.salary || 0,
        '年龄': person.age || 0,
        '性别': person.gender === 'male' ? '男' : '女',
        '学历': person.education || '',
        '创建时间': new Date(person.createdAt).toLocaleString('zh-CN')
      }));
      filename = `人员数据_${new Date().toISOString().slice(0, 10)}.xlsx`;
    }

    // 使用动态导入xlsx库
    import('xlsx').then(XLSX => {
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, filename);
      
      // 添加操作日志
      addOperationLog({
        type: 'create',
        entityType: activeSection.includes('org') ? 'organization' : 'personnel',
        entityId: 'export',
        operatorName: '系统管理员',
        operatorId: 'admin',
        description: `导出${activeSection.includes('org') ? '组织' : '人员'}数据，共${dataToExport.length}条记录`
      });
    });
  };

  // 组织编辑处理
  const handleEditOrganization = (org: Organization) => {
    setOrganizations(organizations.map(o => o.id === org.id ? org : o));
    
    // 添加操作日志
    addOperationLog({
      type: 'update',
      entityType: 'organization',
      entityId: org.id,
      operatorName: '系统管理员',
      operatorId: 'admin',
      description: `更新组织信息: ${org.name}`
    });
  };

  // 组织删除处理
  
  const handleDeleteOrganization = (id: string) => {
    // 根据id找到对应的组织
    const org = organizations.find(o => o.id === id);
    // 弹出确认框，询问是否确定删除
    if (window.confirm('确定要删除此组织吗？这将同时删除该组织下的所有人员。')) {
      // 更新组织列表，删除对应id的组织
      setOrganizations(organizations.filter(org => org.id !== id));
      // 更新人员列表，删除对应组织id的人员
      setPersonnel(personnel.filter(person => person.organizationId !== id));
      
      // 添加操作日志
      addOperationLog({
        type: 'delete',
        entityType: 'organization',
        entityId: id,
        operatorName: '系统管理员',
        operatorId: 'admin',
        description: `删除组织: ${org?.name || '未知组织'}`
      });
    }
  };

  // 组织新增处理
  // 添加组织
  const handleAddOrganization = (orgData: Omit<Organization, 'id'>) => {
    // 创建新组织
    const newOrg: Organization = {
      ...orgData,
      id: Date.now().toString()
    };
    // 更新组织列表
    setOrganizations([...organizations, newOrg]);
    
    // 添加操作日志
    addOperationLog({
      type: 'create',
      entityType: 'organization',
      entityId: newOrg.id,
      operatorName: '系统管理员',
      operatorId: 'admin',
      description: `创建新组织: ${newOrg.name}`
    });
  };

  // 人员编辑处理
  const handleEditPersonnel = (person: Personnel) => {
    setPersonnel(personnel.map(p => p.id === person.id ? person : p));
    
    // 同步更新组织的人员数量
    const orgId = person.organizationId;
    const orgPersonnelCount = personnel.filter(p => p.organizationId === orgId).length;
    setOrganizations(orgs => orgs.map(org => 
      org.id === orgId ? { ...org, employeeCount: orgPersonnelCount } : org
    ));
    
    // 添加操作日志
    addOperationLog({
      type: 'update',
      entityType: 'personnel',
      entityId: person.id,
      operatorName: '系统管理员',
      operatorId: 'admin',
      description: `更新人员信息: ${person.name}`
    });
  };

  // 人员删除处理
  // 删除人员
  const handleDeletePersonnel = (id: string) => {
    // 根据id找到要删除的人员
    const person = personnel.find(p => p.id === id);
    // 弹出确认框，询问是否确定删除
    if (window.confirm('确定要删除此人员吗？')) {
      // 更新人员列表，删除要删除的人员
      setPersonnel(personnel.filter(person => person.id !== id));
      
      // 同步更新组织的人员数量
      if (person) {
        // 找到要删除的人员所在组织的其他人员数量
        const orgPersonnelCount = personnel.filter(p => p.organizationId === person.organizationId && p.id !== id).length;
        // 更新组织列表，更新要删除的人员所在组织的员工数量
        setOrganizations(orgs => orgs.map(org => 
          org.id === person.organizationId ? { ...org, employeeCount: orgPersonnelCount } : org
        ));
      }
      
      // 添加操作日志
      addOperationLog({
        type: 'delete',
        entityType: 'personnel',
        entityId: id,
        operatorName: '系统管理员',
        operatorId: 'admin',
        description: `删除人员: ${person?.name || '未知人员'}`
      });
    }
  };

  // 人员新增处理
  // 添加人员
  const handleAddPersonnel = (personData: Omit<Personnel, 'id'>) => {
    // 创建新的Personnel对象，并设置id为当前时间的毫秒数
    const newPerson: Personnel = {
      ...personData,
      id: Date.now().toString()
    };
    // 将新的Personnel对象添加到personnel数组中
    setPersonnel([...personnel, newPerson]);
    
    // 同步更新组织的人员数量
    // 过滤出与新增人员相同organizationId的人员数量，并加1
    const orgPersonnelCount = personnel.filter(p => p.organizationId === personData.organizationId).length + 1;
    // 更新organizations数组中对应organizationId的employeeCount
    setOrganizations(orgs => orgs.map(org => 
      org.id === personData.organizationId ? { ...org, employeeCount: orgPersonnelCount } : org
    ));
    
    // 添加操作日志
    addOperationLog({
      type: 'create',
      entityType: 'personnel',
      entityId: newPerson.id,
      operatorName: '系统管理员',
      operatorId: 'admin',
      description: `新增人员: ${newPerson.name}`
    });
  };

  // 批量导入处理
  const handleBatchImport = async (data: any[]): Promise<BatchImportResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let successCount = 0;
        let failedCount = 0;
        const errors: Array<{ row: number; field: string; message: string }> = [];

        if (batchImportType === 'organization') {
          // 处理组织批量导入
          data.forEach((item, index) => {
            try {
              if (!item.name || item.name.trim() === '') {
                errors.push({ row: index + 1, field: 'name', message: '组织名称不能为空' });
                failedCount++;
                return;
              }

              const newOrg: Organization = {
                id: (Date.now() + index).toString(),
                name: item.name,
                type: item.type || 'department',
                parentId: item.parentId || '',
                description: item.description || '',
                establishedDate: item.establishedDate || new Date().toISOString().slice(0, 10),
                status: item.status || 'active',
                location: item.location || '',
                manager: item.manager || '',
                employeeCount: parseInt(item.employeeCount) || 0,
                createdBy: '系统管理员',
                createdAt: new Date().toISOString()
              };

              setOrganizations(prev => [...prev, newOrg]);
              successCount++;
            } catch (error) {
              errors.push({ row: index + 1, field: 'general', message: '数据格式错误' });
              failedCount++;
            }
          });
        } else {
          // 处理人员批量导入
          data.forEach((item, index) => {
            try {
              if (!item.name || item.name.trim() === '') {
                errors.push({ row: index + 1, field: 'name', message: '姓名不能为空' });
                failedCount++;
                return;
              }

              if (!item.email || !item.email.includes('@')) {
                errors.push({ row: index + 1, field: 'email', message: '邮箱格式不正确' });
                failedCount++;
                return;
              }

              const newPerson: Personnel = {
                id: (Date.now() + index).toString(),
                name: item.name,
                position: item.position || '',
                organizationId: item.organizationId || '1',
                email: item.email,
                phone: item.phone || '',
                joinDate: item.joinDate || new Date().toISOString().slice(0, 10),
                status: item.status || 'active',
                department: item.department || '',
                manager: item.manager || '',
                salary: parseInt(item.salary) || 0,
                age: parseInt(item.age) || 0,
                gender: item.gender || 'male',
                education: item.education || '',
                createdBy: '系统管理员',
                createdAt: new Date().toISOString()
              };

              setPersonnel(prev => [...prev, newPerson]);
              
              // 同步更新组织人员数量
              setOrganizations(orgs => orgs.map(org => {
                if (org.id === newPerson.organizationId) {
                  return { ...org, employeeCount: org.employeeCount + 1 };
                }
                return org;
              }));
              
              successCount++;
            } catch (error) {
              errors.push({ row: index + 1, field: 'general', message: '数据格式错误' });
              failedCount++;
            }
          });
        }

        // 添加操作日志
        addOperationLog({
          type: 'batch-import',
          entityType: batchImportType,
          entityId: 'batch_' + Date.now(),
          operatorName: '系统管理员',
          operatorId: 'admin',
          description: `批量导入${batchImportType === 'organization' ? '组织' : '人员'}，成功${successCount}条，失败${failedCount}条`,
          batchSize: data.length
        });

        const result: BatchImportResult = {
          success: successCount,
          failed: failedCount,
          errors
        };
        resolve(result);
      }, 2000);
    });
  };

  // 通知处理
  const handleNotificationClick = () => {
    setShowNotifications(true);
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  // 渲染主要内容区域
  const renderContent = () => {
    switch (activeSection) {
      case 'org-list':
        return (
          <OrganizationList
            organizations={organizations}
            onEdit={handleEditOrganization}
            onDelete={handleDeleteOrganization}
            onAdd={handleAddOrganization}
            searchTerm={searchTerm}
          />
        );
      case 'org-tree':
        return (
          <OrganizationTree
            organizations={organizations}
            personnel={personnel}
            onEditOrganization={handleEditOrganization}
            onDeleteOrganization={handleDeleteOrganization}
            onAddOrganization={handleAddOrganization}
            onEditPersonnel={handleEditPersonnel}
            onDeletePersonnel={handleDeletePersonnel}
            onAddPersonnel={handleAddPersonnel}
            searchTerm={searchTerm}
          />
        );
      case 'batch-org-import':
        setShowBatchImport(true);
        setBatchImportType('organization');
        setActiveSection('org-list');
        return null;
      case 'personnel-list':
        return (
          <PersonnelList
            personnel={personnel}
            organizations={organizations}
            onEdit={handleEditPersonnel}
            onDelete={handleDeletePersonnel}
            onAdd={handleAddPersonnel}
            searchTerm={searchTerm}
          />
        );
      case 'batch-personnel-import':
        setShowBatchImport(true);
        setBatchImportType('personnel');
        setActiveSection('personnel-list');
        return null;
      case 'personnel-export':
        handleExport();
        setActiveSection('personnel-list');
        return null;
      case 'operation-stats':
      case 'personnel-stats':
      case 'org-stats':
      case 'statistics':
        return (
          <StatisticsDashboard
            statistics={statistics}
            operationLogs={operationLogs}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">功能开发中</h3>
              <p className="text-gray-600">还不会捏~~~该功能正在开发中，敬请期待...</p>
            </div>
          </div>
        );
    }
  };

  // 如果未登录，显示登录页面
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* 左侧边栏 */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        expandedItems={expandedItems}
        onToggleExpand={handleToggleExpand}
      />
      
      {/* 右侧主要内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部搜索和操作栏 */}
        <div className="relative">
          <Header
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onNewItem={handleNewItem}
            onImport={handleImport}
            onExport={handleExport}
            onNotificationClick={handleNotificationClick}
            activeSection={activeSection}
            onLogout={handleLogout}
            unreadCount={notifications.filter(n => !n.read).length}
          />
          
          {/* 搜索结果下拉框 */}
          {showSearchResults && (
            <div className="absolute top-full left-6 right-6 z-50">
              <div className="relative">
                <SearchResults
                  results={searchResults}
                  onClose={() => setShowSearchResults(false)}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* 主要内容区域 */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* 批量导入模态框 */}
      {showBatchImport && (
        <BatchImport
          type={batchImportType}
          onImport={handleBatchImport}
          onClose={() => setShowBatchImport(false)}
        />
      )}

      {/* 通知模态框 */}
      {showNotifications && (
        <NotificationModal
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAsRead={handleMarkAsRead}
          onDelete={handleDeleteNotification}
        />
      )}
    </div>
  );
}

export default App;