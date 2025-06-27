export interface Organization {
  id: string;
  name: string;
  type: 'company' | 'department' | 'team' | 'branch';
  parentId?: string;
  description?: string;
  establishedDate: string;
  status: 'active' | 'inactive' | 'pending';
  location?: string;
  manager?: string;
  employeeCount: number;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  children?: Organization[];
}

export interface Personnel {
  id: string;
  name: string;
  position: string;
  organizationId: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'on-leave';
  department: string;
  manager?: string;
  salary?: number;
  age?: number;
  gender?: 'male' | 'female';
  education?: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface OperationLog {
  id: string;
  type: 'create' | 'update' | 'delete' | 'batch-import';
  entityType: 'organization' | 'personnel';
  entityId: string;
  operatorName: string;
  operatorId: string;
  timestamp: string;
  changes?: Record<string, { old: any; new: any }>;
  description: string;
  batchSize?: number;
}

export interface Statistics {
  totalOrganizations: number;
  totalPersonnel: number;
  activeOrganizations: number;
  activePersonnel: number;
  recentOperations: number;
  organizationsByType: Record<string, number>;
  personnelByStatus: Record<string, number>;
  personnelByDepartment: Record<string, number>;
  averageAge: number;
  genderDistribution: Record<string, number>;
  educationDistribution: Record<string, number>;
  salaryRanges: Record<string, number>;
  monthlyJoinTrend: Record<string, number>;
}

export interface SearchResult {
  type: 'organization' | 'personnel';
  id: string;
  name: string;
  details: Organization | Personnel;
  matchedFields: string[];
}

export interface BatchImportResult {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}