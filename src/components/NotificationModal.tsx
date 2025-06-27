import React from 'react';
import { X, Bell, Check, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationModalProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  notifications,
  onClose,
  onMarkAsRead,
  onDelete
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        {/* 模态框头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">通知中心</h2>
            {/* 未读通知数量 */}
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                {notifications.filter(n => !n.read).length} 条未读
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 通知列表 */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>暂无通知</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      {/* 通知标题 */}
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      
                      {/* 通知内容 */}
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      
                      {/* 通知时间 */}
                      <p className="text-xs text-gray-400">
                        {notification.time}
                      </p>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center space-x-1 ml-2">
                      {!notification.read && (
                        <button
                          onClick={() => onMarkAsRead(notification.id)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          title="标记为已读"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(notification.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                        title="删除通知"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 模态框底部 */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                共 {notifications.length} 条通知
              </span>
              <button
                onClick={() => {
                  // 标记所有通知为已读
                  notifications.forEach(n => {
                    if (!n.read) onMarkAsRead(n.id);
                  });
                }}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                全部标记为已读
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;