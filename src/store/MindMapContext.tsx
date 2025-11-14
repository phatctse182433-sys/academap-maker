import { createContext, useContext, ReactNode } from 'react';
import { MindMap, SUBJECTS } from '@/types/mindmap';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { nanoid } from 'nanoid';

interface MindMapContextType {
  mindMaps: MindMap[];
  addMindMap: (mindMap: Omit<MindMap, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMindMap: (id: string, mindMap: Partial<MindMap>) => void;
  deleteMindMap: (id: string) => void;
  getMindMap: (id: string) => MindMap | undefined;
}

const MindMapContext = createContext<MindMapContextType | undefined>(undefined);

// Sample mind maps for demo
const SAMPLE_MINDMAPS: MindMap[] = [
  {
    id: nanoid(),
    title: 'Algebraic Equations',
    subject: 'math',
    nodes: [
      { id: '1', type: 'input', data: { label: 'Linear Equations' }, position: { x: 0, y: 0 } },
      { id: '2', type: 'default', data: { label: 'Quadratic Equations' }, position: { x: 200, y: 0 } },
      { id: '3', type: 'output', data: { label: 'Polynomial Equations' }, position: { x: 400, y: 0 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: nanoid(),
    title: 'Shakespeare Works',
    subject: 'literature',
    nodes: [
      { id: '1', type: 'input', data: { label: 'Hamlet' }, position: { x: 0, y: 0 } },
      { id: '2', type: 'default', data: { label: 'Romeo & Juliet' }, position: { x: 200, y: 0 } },
      { id: '3', type: 'output', data: { label: 'Macbeth' }, position: { x: 400, y: 0 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
    ],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: nanoid(),
    title: 'English Grammar',
    subject: 'english',
    nodes: [
      { id: '1', type: 'input', data: { label: 'Nouns' }, position: { x: 0, y: 0 } },
      { id: '2', type: 'default', data: { label: 'Verbs' }, position: { x: 200, y: 0 } },
      { id: '3', type: 'output', data: { label: 'Adjectives' }, position: { x: 400, y: 0 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
    ],
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
  },
  {
    id: nanoid(),
    title: 'Newton Laws of Motion',
    subject: 'physics',
    nodes: [
      { id: '1', type: 'input', data: { label: 'First Law' }, position: { x: 0, y: 0 } },
      { id: '2', type: 'default', data: { label: 'Second Law' }, position: { x: 200, y: 0 } },
      { id: '3', type: 'output', data: { label: 'Third Law' }, position: { x: 400, y: 0 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
    ],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: nanoid(),
    title: 'Periodic Table Elements',
    subject: 'chemistry',
    nodes: [
      { id: '1', type: 'input', data: { label: 'Hydrogen' }, position: { x: 0, y: 0 } },
      { id: '2', type: 'default', data: { label: 'Helium' }, position: { x: 200, y: 0 } },
      { id: '3', type: 'output', data: { label: 'Lithium' }, position: { x: 400, y: 0 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
    ],
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
  },
  {
    id: nanoid(),
    title: 'Calculus Fundamentals',
    subject: 'math',
    nodes: [
      { id: '1', type: 'input', data: { label: 'Limits' }, position: { x: 0, y: 0 } },
      { id: '2', type: 'default', data: { label: 'Derivatives' }, position: { x: 200, y: 0 } },
      { id: '3', type: 'output', data: { label: 'Integrals' }, position: { x: 400, y: 0 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
    ],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: nanoid(),
    title: 'World War II Events',
    subject: 'history',
    nodes: [
      { id: '1', type: 'input', data: { label: '1939 - War Begins' }, position: { x: 0, y: 0 } },
      { id: '2', type: 'default', data: { label: '1941 - Pearl Harbor' }, position: { x: 200, y: 0 } },
      { id: '3', type: 'output', data: { label: '1945 - War Ends' }, position: { x: 400, y: 0 } },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2' },
      { id: 'e2-3', source: '2', target: '3' },
    ],
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09'),
  },
];

export function MindMapProvider({ children }: { children: ReactNode }) {
  const [mindMaps, setMindMaps] = useLocalStorage<MindMap[]>('mindmaps', SAMPLE_MINDMAPS);

  const addMindMap = (mindMap: Omit<MindMap, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMindMap: MindMap = {
      ...mindMap,
      id: nanoid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMindMaps((prev) => [newMindMap, ...prev]);
  };

  const updateMindMap = (id: string, updates: Partial<MindMap>) => {
    setMindMaps((prev) =>
      prev.map((mm) =>
        mm.id === id ? { ...mm, ...updates, updatedAt: new Date() } : mm
      )
    );
  };

  const deleteMindMap = (id: string) => {
    setMindMaps((prev) => prev.filter((mm) => mm.id !== id));
  };

  const getMindMap = (id: string) => {
    return mindMaps.find((mm) => mm.id === id);
  };

  return (
    <MindMapContext.Provider
      value={{ mindMaps, addMindMap, updateMindMap, deleteMindMap, getMindMap }}
    >
      {children}
    </MindMapContext.Provider>
  );
}

export function useMindMapContext() {
  const context = useContext(MindMapContext);
  if (context === undefined) {
    throw new Error('useMindMapContext must be used within a MindMapProvider');
  }
  return context;
}
