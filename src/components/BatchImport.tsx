import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { BatchImportResult } from '../types';

interface BatchImportProps {
  type: 'organization' | 'personnel';
  onImport: (data: any[]) => Promise<BatchImportResult>;
  onClose: () => void;
}

const BatchImport: React.FC<BatchImportProps> = ({ type, onImport, onClose }) => {
  // 文件上传相关状态
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<BatchImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 拖拽处理函数
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // 文件拖拽放置处理
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // 文件选择处理
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Excel文件解析函数
  const parseExcelFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      // 动态导入xlsx库
      import('xlsx').then(XLSX => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            resolve(jsonData);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error('文件读取失败呜呜'));
        reader.readAsArrayBuffer(file);
      }).catch(reject);
    });
  };

  // CSV文件解析函数（备用）
  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      data.push(row);
    }

    return data;
  };

  // 导入处理函数
  const handleImport = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      let data: any[] = [];
      
      // 根据文件类型选择解析方法
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        data = await parseExcelFile(file);
      } else if (file.name.endsWith('.csv')) {
        const text = await file.text();
        data = parseCSV(text);
      } else {
        throw new Error('不支持的文件格式T-T');
      }

      // 执行导入
      const importResult = await onImport(data);
      setResult(importResult);
    } catch (error) {
      console.error('Import error:', error);
      setResult({
        success: 0,
        failed: 1,
        errors: [{ row: 0, field: 'file', message: '文件解析失败T-T: ' + (error as Error).message }]
      });
    } finally {
      setIsUploading(false);
    }
  };

  // 下载模板文件
  const downloadTemplate = () => {
    // 动态导入xlsx库
    import('xlsx').then(XLSX => {
      let templateData: any[] = [];
      let filename = '';
      
      if (type === 'organization') {
        // 组织模板数据
        templateData = [
          {
            'name': '示例公司',
            'type': 'company',
            'parentId': '',
            'description': '这是一个示例公司',
            'establishedDate': '2025-06-01',
            'status': 'active',
            'location': '北京市',
            'manager': '张总',
            'employeeCount': 100
          },
          {
            'name': '技术部',
            'type': 'department',
            'parentId': '1',
            'description': '技术研发部门',
            'establishedDate': '2025-06-15',
            'status': 'active',
            'location': '北京市朝阳区',
            'manager': '李部长',
            'employeeCount': 50
          }
        ];
        filename = '组织导入模板.xlsx';
      } else {
        // 人员模板数据
        templateData = [
          {
            'name': '张三',
            'position': '软件工程师',
            'organizationId': '1',
            'email': 'zhang.san@company.com',
            'phone': '13800138001',
            'joinDate': '2025-06-01',
            'status': 'active',
            'department': '技术部',
            'manager': '李部长',
            'salary': 15000,
            'age': 28,
            'gender': 'male',
            'education': '本科'
          },
          {
            'name': '李四',
            'position': '产品经理',
            'organizationId': '1',
            'email': 'li.si@company.com',
            'phone': '13800138002',
            'joinDate': '2025-06-15',
            'status': 'active',
            'department': '产品部',
            'manager': '王部长',
            'salary': 18000,
            'age': 30,
            'gender': 'female',
            'education': '硕士'
          }
        ];
        filename = '人员导入模板.xlsx';
      }

      // 创建工作表
      const ws = XLSX.utils.json_to_sheet(templateData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      
      // 下载文件
      XLSX.writeFile(wb, filename);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* 模态框头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Upload className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              批量导入{type === 'organization' ? '组织' : '人员'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!result ? (
            <>
              {/* 下载模板区域 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-blue-900">下载导入模板</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      请先下载模板文件，按照模板格式填写数据后再上传。支持 Excel (.xlsx, .xls) 和 CSV 格式。
                    </p>
                    <button
                      onClick={downloadTemplate}
                      className="mt-2 flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>下载模板</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 文件上传区域 */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-900">
                    {file ? file.name : '拖拽文件到此处或点击选择文件'}
                  </p>
                  <p className="text-sm text-gray-500">
                    支持 Excel (.xlsx, .xls) 和 CSV 格式文件，最大 10MB
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    选择文件
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleImport}
                  disabled={!file || isUploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                >
                  {isUploading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>导入中...</span>
                    </div>
                  ) : (
                    '开始导入'
                  )}
                </button>
              </div>
            </>
          ) : (
            /* 导入结果显示 */
            <div className="space-y-6">
              <div className="text-center">
                {result.success > 0 ? (
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                ) : (
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                )}
                <h3 className="text-lg font-medium text-gray-900 mb-2">导入完成</h3>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-600">{result.success}</div>
                    <div className="text-sm text-green-700">成功导入</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-2xl font-bold text-red-600">{result.failed}</div>
                    <div className="text-sm text-red-700">导入失败</div>
                  </div>
                </div>
              </div>

              {/* 错误详情 */}
              {result.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-red-900 mb-3">错误详情</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {result.errors.map((error, index) => (
                      <div key={index} className="text-sm text-red-700">
                        第 {error.row} 行，字段 "{error.field}": {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 完成按钮 */}
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  完成
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatchImport;