export interface DirectoryQuery {
  page: number;
  size: number;
  search: string;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}
