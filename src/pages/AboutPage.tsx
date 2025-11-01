import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle2, BookOpen, Target, Users } from 'lucide-react';

/**
 * About page with application information and features
 */
export default function AboutPage() {
  const features = [
    'Create unlimited mind maps for different subjects',
    'Organize nodes by topic hierarchy',
    'Color-coded subject categories',
    'Visual relationship mapping',
    'Export and share capabilities',
    'Local storage - your data stays private',
  ];

  const subjects = [
    { name: 'Mathematics', icon: '📐', description: 'Map equations, theorems, and formulas' },
    { name: 'Literature', icon: '📚', description: 'Connect themes, characters, and plots' },
    { name: 'English', icon: '✍️', description: 'Organize grammar rules and vocabulary' },
    { name: 'Physics', icon: '⚛️', description: 'Visualize laws and principles' },
    { name: 'Chemistry', icon: '🧪', description: 'Link reactions and compounds' },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-hero">
        <div className="container text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
            About <span className="bg-gradient-primary bg-clip-text text-transparent">MindMapr</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A powerful tool designed to help students visualize and organize 
            their academic knowledge through interactive mind maps
          </p>
        </div>
      </section>

      {/* What is MindMapr */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold">What is MindMapr?</h2>
              </div>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                MindMapr is an intuitive mind mapping application specifically designed 
                for academic use. It helps students create visual representations of 
                their knowledge, making complex subjects easier to understand and remember.
              </p>
              <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                By connecting related concepts and organizing information hierarchically, 
                you can see the big picture while maintaining attention to important details.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-6">Key Features</h3>
              <div className="space-y-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Subjects */}
      <section className="py-20 md:py-32 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Target className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">Supported Subjects</h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Create organized mind maps for all your academic subjects
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <div
                key={subject.name}
                className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{subject.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{subject.name}</h3>
                <p className="text-sm text-muted-foreground">{subject.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Users className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold">How to Get Started</h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Creating your first mind map is easy
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Create</h3>
              <p className="text-sm text-muted-foreground">
                Click "Create New" and choose your subject and title
              </p>
            </div>

            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Design</h3>
              <p className="text-sm text-muted-foreground">
                Add nodes, connect ideas, and organize your knowledge
              </p>
            </div>

            <div className="text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Export</h3>
              <p className="text-sm text-muted-foreground">
                Save and share your mind maps with others
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 bg-gradient-hero">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Mapping?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Create your first mind map and experience a new way of organizing knowledge
          </p>
          <Link to="/mind-maps">
            <Button size="lg" className="shadow-glow">
              Create Mind Map
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
