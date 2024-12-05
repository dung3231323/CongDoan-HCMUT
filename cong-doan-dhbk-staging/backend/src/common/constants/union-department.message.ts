export enum UNION_DEPARTMENT_MESSAGE{
    SUCCESS = 'Success',

    FAIL_GET_ALL = 'Can not get all union department',
    FAIL_GET_ONE = 'Can not get this union department',
    FAIL_CREATE = 'Can not create union department',
    FAIL_EDIT = 'Can not edit this union department',
    FAIL_DELETE = 'Can not delete this union department',

    NOT_FOUND_UNIONDEPT = 'Không tìm thấy công đoàn bộ phận này trên database',
    NO_UNIONDEPT_EXISTING = 'Không tồn tại bất kỳ khoa phòng ban nào',
    ID_NOT_FOUND = 'Không tìm thấy công đoàn bộ phận có ID này'
}