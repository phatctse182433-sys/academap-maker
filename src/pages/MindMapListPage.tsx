import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import MindMapCard from '@/components/MindMapCard';
import { useMindMapContext } from '@/store/MindMapContext';
import { SUBJECTS } from '@/types/mindmap';
import MainLayout from '@/layouts/MainLayout';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

/**
 * Page displaying list of all mind maps with search and filter
 */
export default function MindMapListPage() {
  const { mindMaps, addMindMap, deleteMindMap } = useMindMapContext();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // New mind map form
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');

  // Filter mind maps
  const filteredMindMaps = mindMaps.filter((mm) => {
    const matchesSearch = mm.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'all' || mm.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const handleCreateMindMap = () => {
    if (!newTitle.trim()) {
      toast.error('Please enter a title for your mind map');
      return;
    }
    if (!newSubject) {
      toast.error('Please select a subject');
      return;
    }

    addMindMap({
      title: newTitle,
      subject: newSubject,
      nodes: [],
      edges: [],
    });

    toast.success('Mind map created successfully!');
    setIsCreateDialogOpen(false);
    setNewTitle('');
    setNewSubject('');
  };

  const handleDelete = (id: string) => {
    deleteMindMap(id);
    toast.success('Mind map deleted');
  };

  return (
    <MainLayout>
      <div className="container py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Mind Maps</h1>
          <p className="text-muted-foreground">
            Create and manage your academic mind maps
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search mind maps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter by subject */}
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {SUBJECTS.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.icon} {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Create New Button */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Create New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Mind Map</DialogTitle>
                <DialogDescription>
                  Enter a title and select a subject for your new mind map
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Algebraic Equations"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={newSubject} onValueChange={setNewSubject}>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.icon} {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateMindMap}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Mind Maps Grid */}
        {filteredMindMaps.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-2">No mind maps found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || filterSubject !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first mind map to get started'}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Mind Map
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredMindMaps.map((mindMap) => (
              <MindMapCard
                key={mindMap.id}
                mindMap={mindMap}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
