import { useParams } from 'react-router-dom';
import { useMindMapContext } from '@/store/MindMapContext';

/**
 * Mind Map Editor Page (Phase 2 - To be implemented)
 */
export default function MindMapEditorPage() {
  const { id } = useParams<{ id: string }>();
  const { getMindMap } = useMindMapContext();
  
  const mindMap = id ? getMindMap(id) : null;

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Mind Map Editor</h1>
        <p className="text-xl text-muted-foreground mb-6">
          {mindMap ? `Editing: ${mindMap.title}` : 'Creating new mind map'}
        </p>
        <p className="text-muted-foreground">
          Phase 2 - Editor interface with React Flow coming soon!
        </p>
      </div>
    </div>
  );
}
