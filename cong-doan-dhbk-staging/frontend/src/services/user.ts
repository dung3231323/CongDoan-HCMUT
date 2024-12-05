import axiosClient from './httpClient';

export interface User {
  id: string;
  email: string;
  familyName: string;
  givenName: string;
  lastname: string;
  role: string;
  createAt: string;
  updateAt: string;
  unionDeptId: string;
}
export interface MetaData {
  hasNextPage: boolean; // có trang tiếp theo hay không
  hasPreviousPage: boolean; // có trang trước hay không (trang 1 thì không có trang trước)
  itemCount: number; // tổng số bản ghi account
  page: number; // trang hiện tại
  pageCount: number; // tổng số trang đang có (= itemCount/take)
  take: number; // (số bản ghi trong một trang)
  totalItem: number;
}

export interface ApiResponse {
  status: number;
  data: User[];
  metadata: MetaData;
}

export interface CreateManyResult {
  email: string;
  result: string;
  reason: string;
}

export interface DepartmentsInfo {
  id: string;
  name: string;
}

export interface DepartmentsApiResponse {
  msg: string;
  data: DepartmentsInfo[];
}

export interface CreateParams {
  email: string;
  role: string;
  unionDeptId: string | undefined;
}

export interface EditParams {
  id: string;
  familyName: string;
  givenName: string;
  role: string;
  unionDeptId: string | undefined;
}

const UserAPI = {
  get: async (page = 1, take = 10, order = 'desc') => {
    try {
      const response = await axiosClient.get('/users', {
        params: { order, page, take },
      });
      const result: ApiResponse = {
        status: response.status,
        data: response.data.data,
        metadata: response.data.meta,
      };
      return result;
    } catch (error) {
      console.log(error);
      return;
    }
  },
  getListOfUnionDepartments: async () => {
    try {
      const response = await axiosClient.get('union-department/all-name');
      if (response) {
        const result: DepartmentsApiResponse = {
          msg: response.data.message,
          data: response.data.data,
        };
        return result;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  },
  create: async (params: CreateParams) => {
    try {
      return await axiosClient.post('/users/create', {
        email: params.email,
        role: params.role,
        unionDeptId: params.unionDeptId,
      });
    } catch (error) {
      console.log(error);
      return;
    }
  },
  createMany: async (list: CreateParams[]) => {
    try {
      const response = await axiosClient.post('users/createMany', {
        users: list,
      });
      if (response) {
        const resultList: CreateManyResult[] = response.data.users;
        return resultList;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  },
  edit: async (params: EditParams) => {
    try {
      return await axiosClient.patch('/users/edit', {
        id: params.id,
        familyName: params.familyName,
        givenName: params.givenName,
        role: params.role,
        unionDeptId: params.unionDeptId,
      });
    } catch (error) {
      console.log(error);
    }
  },
  delete: async (id: string) => {
    try {
      return await axiosClient.delete('/users/delete', { params: { id: id } });
    } catch (error) {
      console.log(error);
    }
  },
};
export default UserAPI;
