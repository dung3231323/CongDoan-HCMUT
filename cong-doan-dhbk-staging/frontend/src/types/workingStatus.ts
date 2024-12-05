export enum WorkingStatus {
  Working = 'WORKING',
  Retired = 'RETIRED',
  Resigned = 'RESIGNATION',
}

export interface WorkingStatusOption {
  value: WorkingStatus;
  label: string;
}
