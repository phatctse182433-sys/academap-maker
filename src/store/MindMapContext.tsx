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
    nodes: [],
    edges: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: nanoid(),
    title: 'Shakespeare Works',
    subject: 'literature',
    nodes: [],
    edges: [],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: nanoid(),
    title: 'Grammar Rules',
    subject: 'english',
    nodes: [],
    edges: [],
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
  },
  {
    id: nanoid(),
    title: 'Newton Laws',
    subject: 'physics',
    nodes: [],
    edges: [],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: nanoid(),
    title: 'Periodic Table',
    subject: 'chemistry',
    nodes: [],
    edges: [],
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11'),
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
