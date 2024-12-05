import unionDepartmentData from '@/tests/unionDepartment/unionDepartmentData.json';
import UnionDepartmentAPI from '@/services/unionDepartment';

interface UnionDepartment {
  code: string;
  name: string;
}

const uploadData = async () => {
  const data: UnionDepartment[] = unionDepartmentData;

  for (const department of data) {
    try {
      const response = await UnionDepartmentAPI.create({
        code: department.code,
        name: department.name,
      });

      if (response.status === 201) {
        console.log(`Successfully uploaded: ${department.name}`);
      } else {
        console.log(`Failed to upload: ${department.name}`);
      }
    } catch (error) {
      console.error(`Error uploading ${department.name}:`, error);
    }
  }
};

uploadData();
