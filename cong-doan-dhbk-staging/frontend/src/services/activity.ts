import axiosClient from './httpClient';

import { AllCg } from './category';
import { DepartmentsInfo } from './user';

export interface AllAct {
  id: string;
  name: string;
  imgURL: string;
  activityStartDate: string;
  activityEndDate: string;
  description: string;
  updateAt: string;

  category: AllCg;
  unionDept: DepartmentsInfo;

  ids: [string];
  participants: [string];
}
//obj TS
export const ActivityAPI = {
  //methods thêm async-await để đồng bộ JS
  getAll: async () => {
    try {
      const response = await axiosClient.get('/activity/all');
      return response.data;
    } catch (error) {
      console.log(error);
      return;
    }
  },
  getId: async (idAct: string) => {
    try {
      const response = await axiosClient.get(`/activity/${idAct}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return;
    }
  },
  del: async (idAct: string) => {
    try {
      const response = await axiosClient.delete(`/activity/delete`, {
        data: { id: idAct },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return;
    }
  },
  create: async (params: AllAct) => {
    try {
      console.log(params);
      return await axiosClient.post('/activity/create', {
        name: params.name,
        imgURL: params.imgURL,
        activityStartDate: params.activityStartDate,
        activityEndDate: params.activityEndDate,
        categoryId: params.category.id,
        unionDeptId: params.unionDept.id,
        description: params.description,
      });
    } catch (error) {
      console.log(error);
      return;
    }
  },
  update: async (params: AllAct) => {
    try {
      console.log(params);
      return await axiosClient.patch('/activity/edit', {
        id: params.id,
        name: params.name,
        imgURL: params.imgURL,
        activityStartDate: params.activityStartDate,
        activityEndDate: params.activityEndDate,
        categoryId: params.category.id,
        unionDeptId: params.unionDept.id,
        description: params.description,
      });
    } catch (error) {
      console.log(error);
      return;
    }
  },
  AddParticipantModal: async (params: AllAct) => {
    try {
      await axiosClient.post('/activity/participants', {
        activityId: params.id,
        participants: [params.participants],
      });
    } catch (error) {
      console.log(error);
      return;
    }
  },
  filterUnion: async (params: AllAct) => {
    try {
      await axiosClient.post('/activity/filter/unionDepts', {
        ids: [params.ids],
        startDate: params.activityStartDate,
        endDate: params.activityEndDate,
      });
    } catch (error) {
      console.log(error);
      return;
    }
  },
  filterPart: async (params: AllAct) => {
    try {
      await axiosClient.post('/activity/filter/unionDepts', {
        ids: [params.ids],
        startDate: params.activityStartDate,
        endDate: params.activityEndDate,
      });
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
