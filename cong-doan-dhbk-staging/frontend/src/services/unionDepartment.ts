import axiosClient from './httpClient';
import {
  UnionDepartment,
  GetAllUnionDepartmentDto,
  CreateUnionDepartmentDto,
  EditUnionDepartmentDto,
  DeleteUnionDepartmentDto,
} from '@/types/unionDepartment';

export interface MetaData {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemCount: number;
  page: number;
  pageCount: number;
  take: number;
}

export interface ApiResponse<T> {
  status?: number;
  message?: string;
  data?: T;
  metaData?: MetaData;
}

const UnionDepartmentAPI = {
  create: async (data: CreateUnionDepartmentDto): Promise<ApiResponse<UnionDepartment>> => {
    try {
      const response = await axiosClient.post('/union-department/create', data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  get: async (params: GetAllUnionDepartmentDto): Promise<ApiResponse<UnionDepartment[]>> => {
    try {
      const response = await axiosClient.get('/union-department', { params });
      return {
        status: response.status,
        message: response.data.msg,
        data: response.data.data.data,
        metaData: response.data.data.meta,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  edit: async (data: EditUnionDepartmentDto): Promise<ApiResponse<UnionDepartment>> => {
    try {
      const response = await axiosClient.post('/union-department/edit', data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  delete: async (data: DeleteUnionDepartmentDto): Promise<ApiResponse<UnionDepartment>> => {
    try {
      const response = await axiosClient.post('/union-department/delete', data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getOne: async (id: string): Promise<ApiResponse<UnionDepartment>> => {
    try {
      const response = await axiosClient.get(`/union-department/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getAll: async (): Promise<ApiResponse<UnionDepartment[]>> => {
    try {
      const response = await axiosClient.get('/union-department/all');
      return {
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};

export default UnionDepartmentAPI;
