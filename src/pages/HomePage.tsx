import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Brain, Zap, Share2, Layers } from 'lucide-react';
import heroImage from '@/assets/hero-mindmap.jpg';
import MainLayout from '@/layouts/MainLayout';

/**
 * Home page with hero section and features
 */
export default function HomePage() {
  const features = [
    {
      icon: Brain,
      title: 'Smart Organization',
      description: 'Organize your academic knowledge with intuitive mind mapping tools',
    },
    {
      icon: Zap,
      title: 'Fast & Efficient',
      description: 'Create complex mind maps in minutes with our streamlined interface',
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Export and share your mind maps with classmates and teachers',
    },
    {
      icon: Layers,
      title: 'Multi-Subject',
      description: 'Organize different subjects with color-coded categories',
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="container relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="flex flex-col space-y-6">
              <div className="inline-flex items-center rounded-full border bg-background px-4 py-1.5 text-sm font-medium w-fit">
                <Zap className="mr-2 h-4 w-4 text-primary" />
                Smart Academic Mind Mapping
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Visualize Your
                <span className="bg-gradient-primary bg-clip-text text-transparent"> Academic Knowledge</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                Create beautiful, organized mind maps for all your academic subjects. 
                Connect ideas, visualize relationships, and enhance your learning experience.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/mind-maps">
                  <Button size="lg" className="shadow-lg hover:shadow-glow transition-all">
                    Create Your First Mind Map
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-primary">5+</div>
                  <div className="text-sm text-muted-foreground">Subjects</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">∞</div>
                  <div className="text-sm text-muted-foreground">Mind Maps</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">Free</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src={heroImage}
                  alt="Mind mapping visualization"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-muted/50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Why Choose MindMapr?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create, organize, and visualize your academic knowledge
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center bg-gradient-hero rounded-2xl p-12 shadow-lg">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join students worldwide who are organizing their knowledge with mind maps
            </p>
            <Link to="/mind-maps">
              <Button size="lg" className="shadow-glow">
                Create Mind Map Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
