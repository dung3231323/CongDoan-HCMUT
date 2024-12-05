import axiosClient from './httpClient';
import { Achievement } from '@/types/achievement';
import { Faculty } from '@/types/faculty';
// import { isAnyArrayBuffer } from 'util/types';
import { Children } from '@/types/children';
// import { Participant } from '@/components/types/participant';
export interface MetaData {
  hasNextPage: boolean; // có trang tiếp theo hay không
  hasPreviousPage: boolean; // có trang trước hay không (trang 1 thì không có trang trước)
  itemCount: number; // tổng số bản ghi account
  page: number; // trang hiện tại
  pageCount: number; // tổng số trang đang có (= itemCount/take)
  take: number; // (số bản ghi trong một trang)
  totalItem: number;
}
export interface Participant {
  // "id": "58dc3572-86a9-4cc2-bed5-b2704f09bbf3",
  // "createdAt": "2024-07-23T18:04:16.920Z",
  // "updatedAt": "2024-07-23T18:03:12.479Z",
  // "isUnionMember": false,
  // "dob": "2024-07-23T18:01:53.806Z",
  // "email": "Nguyen Van A",
  // "phone": "+012345678",
  // "sID": "1234",
  // "uID": null,
  // "unionJoinDate": null,
  // "familyName": "Nguyen Van ",
  // "givenName": "A",
  // "gender": "MALE",
  // "numOfChildren": 0,
  // "workingStatus": null,
  // "facultyName": "MT",
  // "facultyId": "862d0ccb-c812-4185-822b-6992edea20a5",
  // "unionDeptId": "02fa3b50-66cb-4276-a685-45bc15d96c42",
  // "achievements": [],
  // "childs": []
  id: string;
  createdAt: string;
  updatedAt: string;
  isUnionMember: boolean;
  dob: string;
  email: string;
  phone: string;
  sID: string;
  uID: string;
  unionJoinDate: string;
  familyName: string;
  givenName: string;
  gender: string;
  numOfChildren: number;
  workingStatus: string;
  facultyName: string;
  facultyId: string;
  unionDeptId: string;
  achievements: Achievement[];
  childs: Children[];
}
export interface APIResponse<T> {
  message: string;
  data: T;
}
export interface deleteResponse {
  message: string;
  messagedata: Achievement;
}

export interface createBody {
  content: string;
  no: string;
  signDate: string;
  facultyId: string;
}
export interface editBody {
  content: string;
  no: string;
  signDate: string;
  facultyId: string;
  id: string;
}
export interface filterBody {
  option: string;
  facultyId: string;
  participantId: string;
  content: string;
  endDate: string;
  startDate: string;
}
export interface addParticipantBody {
  id: string;
  participants: string[];
}

export const AchievementAPI = {
  getParticipants: async () => {
    try {
      const response = await axiosClient.get('/participant/all');
      const result: Participant[] = response.data;
      return result;
    } catch (error) {
      console.log(error);

      return;
    }
  },
  getFaculties: async () => {
    try {
      const response = await axiosClient.get('/faculty/all');
      const result: APIResponse<Faculty[]> = {
        message: response.data.message,
        data: response.data.data,
      };
      return result;
    } catch (error) {
      console.log(error);

      return;
    }
  },
  getAll: async (page = 1, take = 10, orderBy = 'createAt', order = 'desc') => {
    try {
      const response = await axiosClient.get('/achievement', {
        params: { order, page, orderBy, take },
      });
      const result: APIResponse<Achievement[]> = {
        message: response.data.message,
        data: response.data.data,
      };
      return result;
    } catch (error) {
      console.log(error);
      return;
    }
  },
  create: async (body: createBody) => {
    try {
      console.log(body);
      return await axiosClient.post('/achievement/create', {
        content: body.content,
        no: body.no,
        signDate: body.signDate,
        facultyId: body.facultyId,
      });
    } catch (error) {
      console.log(error);
      return;
    }
  },
  edit: async (body: editBody) => {
    try {
      console.log(body);
      return await axiosClient.patch('/achievement/edit', {
        content: body.content,
        no: body.no,
        signDate: body.signDate,
        facultyId: body.facultyId,
        id: body.id,
      });
    } catch (error) {
      console.log(error);
      return;
    }
  },
  filter: async (body: filterBody) => {
    try {
      console.log(body);
      return await axiosClient.post('/achievement/filter', {
        option: body.option,
        facultyId: body.facultyId,
        participantId: body.participantId,
        content: body.content,
        endDate: body.endDate,
        startDate: body.startDate,
      });
    } catch (error) {
      console.log(error);
      return;
    }
  },
  delete: async (id: string) => {
    try {
      const response = await axiosClient.delete(`/achievement/delete`, {
        params: { id },
      });
      const result: deleteResponse = {
        message: response.data.message,
        messagedata: response.data.messagedata,
      };
      return result;
    } catch (error) {
      console.log(error);
      return;
    }
  },
  addParticipant: async (body: addParticipantBody) => {
    try {
      console.log(body);
      return await axiosClient.post('/achievement/participants', {
        id: body.id,
        participants: body.participants,
      });
    } catch (error) {
      console.log(error);
      return;
    }
  },
  getByID: async (id: string) => {
    try {
      const response = await axiosClient.get(`/achievement/${id}`, {
        params: { id },
      });
      const result: APIResponse<Achievement> = {
        message: response.data.message,
        data: response.data.data,
      };
      return result;
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
