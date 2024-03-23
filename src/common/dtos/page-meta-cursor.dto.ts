import { ApiProperty } from '@nestjs/swagger';

import { PageCursorDto } from './page-cursor.dto';

interface IPageMetaCursorDtoParameters {
  pageCursorDto: PageCursorDto;
  itemCount: number;
  nextCursor: number;
}

export class PageMetaCursorDto {
  @ApiProperty()
  readonly cursor: number;

  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly nextCursor: number;

  constructor({
    pageCursorDto,
    itemCount,
    nextCursor,
  }: IPageMetaCursorDtoParameters) {
    this.cursor = pageCursorDto.cursor;
    this.take = pageCursorDto.take;
    this.itemCount = itemCount;
    this.nextCursor = nextCursor;
  }
}
