import axiosClient from './httpClient';
import { Faculty } from '@/types/faculty';

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

const FacultyAPI = {
  create: async (data: { name: string; unionDept: string; code: string }): Promise<ApiResponse<Faculty>> => {
    try {
      const response = await axiosClient.post('/faculty/create', data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  get_with_paging: async (
    page: number = 1,
    pagesize: number = 10,
    sortBy: string = 'id',
    order: string = 'DESC',
  ): Promise<ApiResponse<Faculty[]>> => {
    try {
      const { status, data } = await axiosClient.get('/faculty/all-paging', {
        params: { page, pagesize, sortBy, order },
      });
      return {
        status,
        message: data.message,
        data: data.data.data,
        metaData: {
          hasNextPage: data.data.page < data.data.lastPage ? true : false,
          hasPreviousPage: data.data.page > 1 ? true : false,
          itemCount: data.data.total,
          page: data.data.page,
          pageCount: data.data.lastPage,
          take: data.data.limit,
        },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  edit: async (data: { id: string; name: string; unionDept: string; code: string }): Promise<ApiResponse<Faculty>> => {
    try {
      const response = await axiosClient.post('/faculty/edit', data);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  delete: async (id: string): Promise<ApiResponse<Faculty>> => {
    try {
      const response = await axiosClient.post('/faculty/delete', { id });
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getOne: async (id: string): Promise<ApiResponse<Faculty>> => {
    try {
      const response = await axiosClient.get(`/faculty/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  getAll: async (): Promise<ApiResponse<Faculty[]>> => {
    try {
      const response = await axiosClient.get('/faculty/all');
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

export default FacultyAPI;
