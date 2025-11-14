// Type definitions for Mind Map application

export interface MindMapNode {
  id: string;
  type: 'subject' | 'topic' | 'subtopic';
  data: {
    label: string;
    description?: string;
    color?: string;
  };
  position: { x: number; y: number };
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
}

export interface MindMap {
  id: string;
  title: string;
  subject: string;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

// Sample subjects data
export const SUBJECTS: Subject[] = [
  { id: 'math', name: 'Mathematics', color: 'hsl(221, 83%, 53%)', icon: '📐' },
  { id: 'literature', name: 'Literature', color: 'hsl(271, 81%, 56%)', icon: '📚' },
  { id: 'english', name: 'English', color: 'hsl(25, 95%, 53%)', icon: '✍️' },
  { id: 'physics', name: 'Physics', color: 'hsl(0, 84%, 60%)', icon: '⚛️' },
  { id: 'chemistry', name: 'Chemistry', color: 'hsl(142, 71%, 45%)', icon: '🧪' },
  { id: 'history', name: 'History', color: 'hsl(45, 93%, 47%)', icon: '🏛️' },
];
