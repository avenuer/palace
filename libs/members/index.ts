export interface TableHeader<T> {
  text: string;
  align?: string;
  value: keyof T;
  sortable?: boolean;
}

export interface TablePagination<T> {
  descending: number;
  page: number;
  rowsPerPage: number;
  sortBy?: keyof T;
  totalItems: number;
}
