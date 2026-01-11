
export interface DayProps {
  index: number;
  isCompleted: boolean;
  note?: string;
  onToggle: (index: number) => void;
  onSaveNote: (index: number, note: string) => void;
}

export interface WeekProps {
  weekIndex: number;
  days: number[];
  completedIndices: number[];
  dayNotes: Record<number, string>;
  onToggle: (index: number) => void;
  onSaveNote: (index: number, note: string) => void;
}
