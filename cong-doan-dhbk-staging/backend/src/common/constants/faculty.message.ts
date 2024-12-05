export enum FACULTY_MESSAGE{
    SUCCESS= 'Success',

    FAIL_GET_ALL = 'Can not get all faculty',
    FAIL_GET_ONE = 'Can not get this faculty',
    FAIL_CREATE = 'Can not create faculty',
    FAIL_EDIT = 'Can not edit this faculty',
    FAIL_DELETE = 'Can not delete this faculty',
    
    USER_HAS_NO_PERMISSION = 'Người dùng không có quyền thực hiện thao tác này',
    NOT_FOUND_FACULTY = 'Khoa/phòng ban này không tồn tại',
    NO_FACULTY_EXISTING = 'Không tồn tại khoa/phòng ban nào',
    ID_NOT_FOUND = 'ID của khoa/phòng ban này không tồn tại'
}