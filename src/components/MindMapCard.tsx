import { MindMap, SUBJECTS } from '@/types/mindmap';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface MindMapCardProps {
  mindMap: MindMap;
  onDelete: (id: string) => void;
}

/**
 * Card component displaying mind map preview
 */
export default function MindMapCard({ mindMap, onDelete }: MindMapCardProps) {
  const subject = SUBJECTS.find((s) => s.id === mindMap.subject);
  
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]">
      <CardHeader className="pb-4">
        {/* Subject badge */}
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 rounded-full px-3 py-1 text-sm font-medium text-white"
            style={{ backgroundColor: subject?.color }}
          >
            <span>{subject?.icon}</span>
            <span>{subject?.name}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Mind map preview placeholder */}
        <div 
          className="mb-4 h-32 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="text-4xl mb-2">{subject?.icon}</div>
            <p className="text-sm text-muted-foreground">
              {mindMap.nodes.length} nodes
            </p>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold line-clamp-2 mb-2">
          {mindMap.title}
        </h3>

        {/* Date */}
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4" />
          <span>Created {format(new Date(mindMap.createdAt), 'MMM d, yyyy')}</span>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link to={`/mind-map/editor/${mindMap.id}`} className="flex-1">
          <Button variant="default" className="w-full">
            <Eye className="mr-2 h-4 w-4" />
            Open
          </Button>
        </Link>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Mind Map?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete "{mindMap.title}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(mindMap.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
