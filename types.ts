
export interface Employee {
  id: string;
  name: string;
}

export interface Group {
  id: string;
  name: string;
  members: Employee[];
  motto?: string;
}

export type TabType = 'list' | 'lottery' | 'grouping';
