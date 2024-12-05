import { Injectable } from "@nestjs/common";

@Injectable()
export class ResponseClient {
    private message: string;
    private data: any;

    constructor(message: string, data: any, error: any) {
        this.message = message;
        this.data = data;
    }

    public ResponseClient(message: string, data: any) {
        this.message = message;
        this.data = data;
    }
}