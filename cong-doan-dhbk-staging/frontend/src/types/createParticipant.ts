import { Faculty } from './faculty';
import { UnionDepartment } from './unionDepartment';
import { Children } from './children';
import { Gender } from './gender';
import { WorkingStatus } from './workingStatus';

export interface CreateParticipant {
  familyName: string;
  givenName: string;
  email: string;
  phone: string;
  sID: string;
  dob: string;
  faculty?: Faculty;
  facultyName: string;
  facultyId?: string;
  gender?: Gender;
  isUnionMember: boolean;
  uID?: string;
  workingStatus?: WorkingStatus;
  unionDept?: UnionDepartment;
  unionDeptId?: string;
  unionJoinDate?: string;
  numOfChildren: number;
  children?: Children[];
}

export interface CreateParticipants {
  participants: CreateParticipant[];
}
