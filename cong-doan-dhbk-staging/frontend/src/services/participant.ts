import axiosClient from './httpClient';
import { Participant } from '@/types/participant';
import { AxiosError } from 'axios';
import { CreateParticipant } from '@/types/createParticipant';
import { FilterParticipant } from '@/types/filterParticipant';

export interface MetaData {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemCount: number;
  page: number;
  pageCount: number;
  take?: number;
}

export interface ApiResponse<T> {
  status?: number;
  message?: string;
  data?: T;
  metaData?: MetaData;
}

const ParticipantApi = {
  getAll: async (page: number, take: number): Promise<ApiResponse<Participant[]>> => {
    try {
      const response = await axiosClient.get('/participant/all', {
        params: {
          page,
          limit: take,
          order: 'DESC',
          sortBy: 'createdAt',
        },
      });
      const result: ApiResponse<Participant[]> = {
        status: response.status,
        data: response.data.data,
        metaData: {
          hasNextPage: response.data.page < response.data.lastPage ? true : false,
          hasPreviousPage: response.data.page > 1 ? true : false,
          itemCount: response.data.total,
          page: response.data.page,
          pageCount: response.data.lastPage,
          take: response.data.limit,
        },
      };

      return result;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error response:', error.response);
        return {
          data: [],
          status: error.response?.data.status || 500,
          message: error.message || 'An error occurred',
          metaData: {
            hasNextPage: false,
            hasPreviousPage: false,
            itemCount: 0,
            page: 1,
            pageCount: 1,
            take: 10,
          },
        };
      } else {
        console.error('Unexpected error:', error);
        return {
          data: [],
          status: 500,
          message: 'An unexpected error occurred',
          metaData: {
            hasNextPage: false,
            hasPreviousPage: false,
            itemCount: 0,
            page: 1,
            pageCount: 1,
            take: 10,
          },
        };
      }
    }
  },

  getWithFilter: async (filterParticipant: Partial<FilterParticipant>): Promise<ApiResponse<Participant[]>> => {
    try {
      const response = await axiosClient.post('/participant/filter', filterParticipant);
      const result: ApiResponse<Participant[]> = {
        status: response.status,
        data: response.data.data,
        metaData: {
          hasNextPage: response.data.page < response.data.lastPage ? true : false,
          hasPreviousPage: response.data.page > 1 ? true : false,
          itemCount: response.data.total,
          page: response.data.page,
          pageCount: response.data.lastPage,
          take: filterParticipant?.limit,
        },
      };

      return result;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error response:', error.response);
        return {
          data: [],
          status: error.response?.data.status || 500,
          message: error.message || 'An error occurred',
          metaData: {
            hasNextPage: false,
            hasPreviousPage: false,
            itemCount: 0,
            page: 1,
            pageCount: 1,
            take: 10,
          },
        };
      } else {
        console.error('Unexpected error:', error);
        return {
          data: [],
          status: 500,
          message: 'An unexpected error occurred',
          metaData: {
            hasNextPage: false,
            hasPreviousPage: false,
            itemCount: 0,
            page: 1,
            pageCount: 1,
            take: 10,
          },
        };
      }
    }
  },

  getParticipantWithId: async (id: string): Promise<ApiResponse<Participant>> => {
    try {
      const response = await axiosClient.get(`/participant/id/${id}`);
      console.log('response', response);
      const result: ApiResponse<Participant> = {
        status: response.status,
        data: response.data,
      };
      return result;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error response:', error.response);
        return {
          data: error.response?.data || null,
          status: error.response?.status || 500,
          message: error.message || 'An error occurred',
        };
      } else {
        console.error('Unexpected error:', error);
        return {
          status: 500,
          message: 'An unexpected error occurred',
        };
      }
    }
  },

  create: async (participant: Partial<Participant>): Promise<ApiResponse<Participant>> => {
    try {
      console.log('participant', participant);
      const reponse = await axiosClient.post('/participant/create', participant);
      console.log('reponse', reponse);
      const result: ApiResponse<Participant> = {
        status: reponse.status,
        data: reponse.data,
        message: reponse.data.msg,
      };
      return result;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error response:', error.response);
        return {
          data: error.response?.data || null,
          status: error.response?.status || 500,
          message: error.message || 'An error occurred',
        };
      } else {
        console.error('Unexpected error:', error);
        return {
          status: 500,
          message: 'An unexpected error occurred',
        };
      }
    }
  },

  createBulk: async (participants: CreateParticipant[]): Promise<ApiResponse<Participant[]>> => {
    try {
      const response = await axiosClient.post('/participants/bulk', participants);
      const result: ApiResponse<Participant[]> = {
        status: response.status,
        data: response.data.data,
        message: response.data.msg,
      };
      return result;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error response:', error.response);
        return {
          data: error.response?.data || [],
          status: error.response?.status || 500,
          message: error.message || 'An error occurred',
        };
      } else {
        console.error('Unexpected error:', error);
        return {
          status: 500,
          message: 'An unexpected error occurred',
        };
      }
    }
  },
  updateParticipantWithId: async (id: string, participant: Partial<Participant>): Promise<ApiResponse<Participant>> => {
    console.log('participant', participant);
    try {
      console.log('participant', participant);
      const response = await axiosClient.patch(`/participant/edit/${id}`, participant);
      const result: ApiResponse<Participant> = {
        status: response.status,
        data: response.data.data,
      };
      return result;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error response:', error.response);
        return {
          data: error.response?.data || null,
          status: error.response?.status || 500,
          message: error.message || 'An error occurred',
        };
      } else {
        console.error('Unexpected error:', error);
        return {
          status: 500,
          message: 'An unexpected error occurred',
        };
      }
    }
  },

  delete: async (id: string): Promise<ApiResponse<Participant>> => {
    try {
      const response = await axiosClient.delete(`/participant/${id}`);
      const result: ApiResponse<Participant> = {
        status: response.status,
        data: response.data.data,
        message: response.data.msg,
      };
      return result;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error response:', error.response);
        return {
          data: error.response?.data || null,
          status: error.response?.status || 500,
          message: error.message || 'An error occurred',
        };
      } else {
        console.error('Unexpected error:', error);
        return {
          status: 500,
          message: 'An unexpected error occurred',
        };
      }
    }
  },
};

export default ParticipantApi;
