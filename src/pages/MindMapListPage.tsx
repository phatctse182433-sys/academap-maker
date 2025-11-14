import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  
  // Scroll accumulation for smoother scrolling
  const scrollAccumulation = useRef(0);
  const lastScrollTime = useRef(0);
  
  // New mind map form
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');

  // Filter mind maps
  const filteredMindMaps = mindMaps.filter((mm) => {
    const matchesSearch = mm.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'all' || mm.subject === filterSubject;
    return matchesSearch && matchesSubject;
  });
  // Handle keyboard navigation with reduced sensitivity
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling) return;
      
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setIsScrolling(true);
        setCurrentCardIndex(prev => {
          const newIndex = Math.min(filteredMindMaps.length - 1, prev + 1);
          return newIndex;
        });
        setTimeout(() => setIsScrolling(false), 1000);
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setIsScrolling(true);
        setCurrentCardIndex(prev => {
          const newIndex = Math.max(0, prev - 1);
          return newIndex;
        });
        setTimeout(() => setIsScrolling(false), 1000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isScrolling, filteredMindMaps.length]);

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
      <div className="h-screen overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 px-6 pt-6 pb-4 bg-background/80 backdrop-blur-sm border-b">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">My Mind Maps</h1>
            <p className="text-muted-foreground">
              Create and manage your academic mind maps
            </p>
          </div>
        </div>

        {/* Controls - Fixed */}
        <div className="flex-shrink-0 px-6 py-4 bg-background/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
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
                <Button onClick={handleCreateMindMap}>Create</Button>              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        </div>        {/* Mind Maps Scroll Stack - Takes remaining space */}
        <div className="flex-1 relative overflow-hidden">
          {filteredMindMaps.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
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
            </div>
          ) : (
            <div 
              className="scroll-stack-container h-full relative"              onWheel={(e) => {
                e.preventDefault();
                
                // Prevent scroll if already scrolling
                if (isScrolling) return;
                
                const now = Date.now();
                const timeDiff = now - lastScrollTime.current;
                
                // Reset accumulation if too much time has passed
                if (timeDiff > 100) {
                  scrollAccumulation.current = 0;
                }
                
                // Accumulate scroll delta
                scrollAccumulation.current += Math.abs(e.deltaY);
                lastScrollTime.current = now;
                
                // Much higher threshold for less sensitivity
                const threshold = 15;
                if (scrollAccumulation.current < threshold) return;
                
                // Reset accumulation
                scrollAccumulation.current = 0;
                
                const delta = e.deltaY > 0 ? 1 : -1;
                
                setIsScrolling(true);
                setCurrentCardIndex(prev => {
                  const newIndex = Math.max(0, Math.min(filteredMindMaps.length - 1, prev + delta));
                  return newIndex;
                });
                
                // Reset scrolling state after animation with longer delay
                setTimeout(() => {
                  setIsScrolling(false);
                }, 1200);
              }}
            >              <div className="scroll-stack-wrapper h-full flex items-center justify-center relative">
                {filteredMindMaps.slice(0, 8).map((mindMap, index) => {
                  const subject = SUBJECTS.find(s => s.id === mindMap.subject);
                  
                  // Different gradient colors for each card
                  const gradients = [
                    'from-purple-500 via-pink-500 to-red-500',
                    'from-blue-500 via-purple-500 to-pink-500', 
                    'from-green-500 via-blue-500 to-purple-500',
                    'from-yellow-500 via-orange-500 to-red-500',
                    'from-teal-500 via-green-500 to-blue-500',
                    'from-indigo-500 via-purple-500 to-pink-500',
                    'from-pink-500 via-red-500 to-orange-500',
                    'from-cyan-500 via-blue-500 to-purple-500'
                  ];
                    // Calculate card position based on current index
                  let opacity = 0;
                  let yOffset = 0;
                  let scale = 1;
                  let zIndex = 0;
                  
                  if (index === currentCardIndex) {
                    // Current active card - fully visible
                    opacity = 1;
                    yOffset = 0;
                    scale = 1;
                    zIndex = 100;
                  } else if (index === currentCardIndex - 1) {
                    // Previous card - moving out
                    opacity = 0;
                    yOffset = -100;
                    scale = 0.9;
                    zIndex = 50;
                  } else if (index === currentCardIndex + 1) {
                    // Next card - barely visible
                    opacity = 0.3;
                    yOffset = 50;
                    scale = 0.95;
                    zIndex = 90;
                  } else if (index < currentCardIndex) {
                    // Cards that are behind
                    opacity = 0;
                    yOffset = -100;
                    scale = 0.9;
                    zIndex = 0;
                  } else {
                    // Cards that are ahead
                    opacity = 0;
                    yOffset = 100;
                    scale = 0.9;
                    zIndex = 0;
                  }
                  
                  return (
                    <div
                      key={mindMap.id}
                      className={`scroll-stack-item absolute w-full max-w-lg transition-all duration-700 ease-out cursor-pointer`}
                      style={{
                        transform: `translateY(${yOffset}px) scale(${scale})`,
                        opacity: opacity,
                        zIndex: zIndex,
                      }}
                      onClick={() => navigate(`/mind-map/${mindMap.id}`)}
                    >
                      <div className={`bg-gradient-to-br ${gradients[index % gradients.length]} p-8 rounded-3xl shadow-2xl text-white transform hover:scale-105 transition-all duration-300 min-h-[320px] flex flex-col justify-between relative overflow-hidden`}>
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full animate-shimmer"></div>
                        
                        <div className="relative z-10">
                          <h2 className="text-3xl font-bold mb-4 leading-tight drop-shadow-lg">{mindMap.title}</h2>
                          <div className="flex items-center gap-3 mb-6">
                            <span className="text-2xl drop-shadow-lg">{subject?.icon || '📚'}</span>
                            <p className="text-white/90 text-lg font-medium drop-shadow-md">
                              {subject?.name || mindMap.subject}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between relative z-10">
                          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 flex-1 mr-4 border border-white/30">
                            <div className="flex items-center justify-center mb-3">
                              <div className="w-16 h-12 bg-white/30 rounded-xl flex items-center justify-center border-4 border-white/40">
                                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-b-[20px] border-b-white border-r-[12px] border-r-transparent transform rotate-90"></div>
                              </div>
                            </div>
                            <p className="text-center text-sm font-semibold">
                              {mindMap.nodes?.length || 0} nodes
                            </p>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20 rounded-full w-12 h-12 p-0 border border-white/30 hover:border-white/50 transition-all duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(mindMap.id);
                            }}
                          >
                            <Plus className="h-5 w-5 rotate-45" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>              {/* Scroll Indicator */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-muted-foreground z-50">
                <div className="flex flex-col items-center mb-4">
                  <div className="w-1 h-20 bg-border rounded-full overflow-hidden mb-3">
                    <div 
                      className="w-full bg-gradient-to-b from-purple-500 to-pink-500 transition-all duration-300 rounded-full"
                      style={{ height: `${((currentCardIndex + 1) / filteredMindMaps.length) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs font-medium">Scroll to explore</p>
                </div>
                
                {/* Navigation Dots */}
                <div className="flex items-center gap-2 mb-2">
                  {filteredMindMaps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentCardIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentCardIndex 
                          ? 'bg-purple-500 scale-125' 
                          : 'bg-border hover:bg-purple-300'
                      }`}
                    />
                  ))}
                </div>
                
                {/* Card counter */}
                <div className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full border text-sm font-medium">
                  {currentCardIndex + 1} / {filteredMindMaps.length}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
