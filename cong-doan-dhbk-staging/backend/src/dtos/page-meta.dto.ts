import { ApiProperty } from "@nestjs/swagger";
import { PageMetaDtoParameters } from "./page-meta-dto-parameters.interface";

export class PageMetaDto {
    @ApiProperty()
    readonly page: number;

    @ApiProperty()
    readonly take: number;

    @ApiProperty()
    readonly itemCount: number;

    @ApiProperty()
    readonly totalItem: number;

    @ApiProperty()
    readonly pageCount: number;

    @ApiProperty()
    readonly hasPreviousPage: boolean;

    @ApiProperty()
    readonly hasNextPage: boolean;

    constructor({ pageOptionsDto, itemCount, totalItem }: PageMetaDtoParameters) {
        this.page = pageOptionsDto.page != undefined ? pageOptionsDto.page : 1;
        this.take = pageOptionsDto.take != undefined ? pageOptionsDto.take : 10;     //Fix to 10 in real version
        this.itemCount = itemCount;
        this.totalItem = totalItem;
        this.pageCount = Math.ceil(this.itemCount / this.take);
        this.hasPreviousPage = this.page > 1;
        this.hasNextPage = this.page < this.pageCount;
    }
}
