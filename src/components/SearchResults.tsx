import React from 'react';
import { SearchResult } from '../types';
import { Building2, User, Mail, Phone, MapPin, Calendar, Users } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  onClose: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onClose }) => {
  if (results.length === 0) {
    return (
      <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 p-4 z-50">
        <p className="text-gray-500 text-center">未找到匹配的结果</p>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-96 overflow-y-auto z-50">
      <div className="p-2">
        <div className="flex items-center justify-between mb-2 px-2">
          <span className="text-sm font-medium text-gray-700">搜索结果 ({results.length})</span>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-sm"
          >
            关闭
          </button>
        </div>
        
        <div className="space-y-1">
          {results.map((result) => (
            <div
              key={`${result.type}-${result.id}`}
              className="p-3 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
            >
              {result.type === 'organization' ? (
                <OrganizationResult result={result} />
              ) : (
                <PersonnelResult result={result} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const OrganizationResult: React.FC<{ result: SearchResult }> = ({ result }) => {
  const org = result.details as any;
  
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <Building2 className="w-5 h-5 text-blue-600 mt-1" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="text-sm font-medium text-gray-900 truncate">{org.name}</h3>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {org.type === 'company' ? '公司' : 
             org.type === 'department' ? '部门' : 
             org.type === 'team' ? '团队' : '分支机构'}
          </span>
        </div>
        
        <div className="space-y-1">
          {org.description && (
            <p className="text-xs text-gray-600">{org.description}</p>
          )}
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
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
        
        {result.matchedFields.length > 0 && (
          <div className="mt-2">
            <span className="text-xs text-blue-600">
              匹配字段: {result.matchedFields.join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const PersonnelResult: React.FC<{ result: SearchResult }> = ({ result }) => {
  const person = result.details as any;
  
  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-blue-600" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className="text-sm font-medium text-gray-900">{person.name}</h3>
          <span className="text-xs text-gray-600">- {person.position}</span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            person.status === 'active' ? 'bg-green-100 text-green-800' :
            person.status === 'inactive' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {person.status === 'active' ? '在职' : 
             person.status === 'inactive' ? '离职' : '请假'}
          </span>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-gray-600">{person.department}</p>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              <Mail className="w-3 h-3 mr-1" />
              {person.email}
            </span>
            <span className="flex items-center">
              <Phone className="w-3 h-3 mr-1" />
              {person.phone}
            </span>
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            入职时间: {new Date(person.joinDate).toLocaleDateString('zh-CN')}
          </div>
        </div>
        
        {result.matchedFields.length > 0 && (
          <div className="mt-2">
            <span className="text-xs text-blue-600">
              匹配字段: {result.matchedFields.join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;