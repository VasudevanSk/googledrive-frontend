import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HardDrive, Upload, FolderOpen, Shield, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CloudDrive</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button className="gradient-primary text-primary-foreground">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
            Store, Share & Access
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Files Anywhere
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in">
            Securely store your files in the cloud with AWS S3. Access them from any device, 
            anytime, anywhere. Simple, fast, and reliable.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Link to="/register">
              <Button size="lg" className="gradient-primary text-primary-foreground h-12 px-8">
                Start Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="h-12 px-8">
                Sign In to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose CloudDrive?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Upload className="w-8 h-8" />}
              title="Easy Upload"
              description="Drag and drop files or folders. Upload multiple files at once with our intuitive interface."
            />
            <FeatureCard
              icon={<FolderOpen className="w-8 h-8" />}
              title="Organize Files"
              description="Create folders, move files, and keep everything organized exactly how you want it."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Secure Storage"
              description="Your files are encrypted and stored securely on AWS S3 with enterprise-grade security."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto p-8 rounded-2xl glass">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-muted-foreground mb-6">
              Create your free account today and start storing your files in the cloud.
            </p>
            <Link to="/register">
              <Button size="lg" className="gradient-primary text-primary-foreground">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 CloudDrive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition-shadow">
    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Index;
