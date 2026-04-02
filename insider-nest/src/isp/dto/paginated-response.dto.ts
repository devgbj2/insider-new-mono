export class PaginationMeta {
  total!: number;
  page!: number;
  limit!: number;
  lastPage!: number;
  hasNextPage!: boolean;
  hasPrevPage!: boolean;
}

export class PaginatedResponseDto<T> {
  success!: true;
  data!: T[];
  meta!: PaginationMeta;

  static of<T>(data: T[], total: number, page: number, limit: number): PaginatedResponseDto<T> {
    const lastPage = Math.ceil(total / limit) || 1;
    const dto = new PaginatedResponseDto<T>();

    dto.success = true;
    dto.data = data;
    dto.meta = {
      total,
      page,
      limit,
      lastPage,
      hasNextPage: page < lastPage,
      hasPrevPage: page > 1,
    };

    return dto;
  }
}