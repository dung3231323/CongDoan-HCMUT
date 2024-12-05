import axiosClient from './httpClient';

export interface AllCg {
  id: string;
  name: string;
  updatedAt: string;
}
export const CategoryAPI = {
  create: async (params: string | undefined) => {
    try {
      console.log(params);
      return await axiosClient.post('/category/create', {
        name: params,
      });
    } catch (error) {
      console.error('Error creating category:', error);
      throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
  },
  update: async (params: AllCg) => {
    try {
      console.log(params);
      return await axiosClient.patch('/category/edit', {
        name: params.name,
        id: params.id,
      });
    } catch (error) {
      console.error('Error updating category:', error);
      throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
  },
  getAll: async () => {
    try {
      const response = await axiosClient.get('/category/all');
      return response.data;
    } catch (error) {
      console.error('Error fetching all categories:', error);
      throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
  },
  del: async (idCg: string) => {
    try {
      console.log('Deleting category with ID:', idCg);
      return await axiosClient.delete('/category/delete', {
        data: { id: idCg },
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
  },
  getId: async (id: string) => {
    try {
      const response = await axiosClient.get(`/category/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all categories:', error);
      throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
  },
};
