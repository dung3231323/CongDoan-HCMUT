import { Module } from '@nestjs/common';
import { ResponseClient } from './response.entity';

@Module({
    providers: [
        {
            provide: ResponseClient,
            useValue: new ResponseClient("", null,null)
        }
    ],
    exports:[ResponseClient]
})
export class ResponseModule {}
