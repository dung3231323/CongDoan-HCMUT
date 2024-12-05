export class CreateUserMeta {
    readonly userCount: number;
    readonly successCount: number;


    constructor(userCount: number, successCount: number) {
        this.userCount = userCount;
        this.successCount = successCount;
    }
}