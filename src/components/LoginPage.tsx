import React, { useState } from 'react';
import { Building2, User, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

// 定义一个名为LoginPage的函数组件，接收一个名为onLogin的props
const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  // 定义一个名为username的状态变量，初始值为空字符串
  const [username, setUsername] = useState('');
  // 定义一个名为password的状态变量，初始值为空字符串
  const [password, setPassword] = useState('');
  // 定义一个名为showPassword的状态变量，初始值为false
  const [showPassword, setShowPassword] = useState(false);
  // 定义一个名为error的状态变量，初始值为空字符串
  const [error, setError] = useState('');
  // 定义一个名为isLoading的状态变量，初始值为false
  const [isLoading, setIsLoading] = useState(false);

  // 定义一个名为handleSubmit的异步函数，接收一个名为e的参数
  const handleSubmit = async (e: React.FormEvent) => {
    // 阻止表单提交
    e.preventDefault();
    // 清空错误信息
    setError('');
    // 设置isLoading为true
    setIsLoading(true);

    // 模拟登录验证
    setTimeout(() => {
      // 如果账号和密码正确，调用onLogin函数
      if (username === 'zuzhiguanli' && password === '123456') {
        onLogin();
      } else {
        // 否则，设置错误信息
        setError('账号或密码错误，请重新输入');
      }
      // 设置isLoading为false
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">南平铝业组织管理系统</h1>
          <p className="text-gray-400">Organization Management System</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                账号
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="请输入账号"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  placeholder="请输入密码"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  别急~~~登录中...
                </div>
              ) : (
                '登录'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">测试账号信息</p>
              <div className="bg-gray-50 rounded-md p-3 text-xs text-gray-600">
                <p></p>
                <p></p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
             2025 组织管理系统（T2201）.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
