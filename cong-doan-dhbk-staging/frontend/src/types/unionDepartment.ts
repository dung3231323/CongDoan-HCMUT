export interface UnionDepartment {
  id: string;
  code: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  facultyCount?: number;
}

export interface GetAllUnionDepartmentDto {
  page?: number;
  pagesize?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface CreateUnionDepartmentDto {
  code: string;
  name: string;
}

export interface EditUnionDepartmentDto {
  id: string;
  code: string;
  name: string;
}

export interface DeleteUnionDepartmentDto {
  id: string;
  code?: string;
  name?: string;
}
