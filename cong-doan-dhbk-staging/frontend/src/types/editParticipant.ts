import { Children } from "./children";
import { Faculty } from "./faculty";
import { Gender } from "./gender";
import { UnionDepartment } from "./unionDepartment";
import { WorkingStatus } from "./workingStatus";

export interface EditParticipantObject {
    familyName: string;
    givenName: string;
    email: string;
    phone: string;
    sID: string;
    dob: string;
    faculty?: Faculty;
    facultyName?: string;
    facultyId?: string;
    gender?: Gender;
    isUnionMember?: boolean;
    uID: string;
    workingStatus?: WorkingStatus;
    unionDeptId?: string;
    unionDept?: UnionDepartment
    unionJoinDate?: string;
    numOfChildren: number;
    children?: Children[];
};
