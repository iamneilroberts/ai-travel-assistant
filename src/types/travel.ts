export interface TravelCommand {
  command: string;
  prompt?: string; // Add optional prompt field
  timestamp: Date;
  status: 'pending' | 'success' | 'error';
}

export interface TravelResponse {
  id: string;
  content: string;
  created_at: Date;
  metadata: {
    location?: string;
    duration?: string;
    budget?: string;
    activities?: string[];
  };
}

export interface TravelDiff {
  field: string;
  oldValue: any;
  newValue: any;
  type: 'added' | 'removed' | 'modified';
}
