import { ArrowDown } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/assets/generated/hero-background.dim_1920x1080.png)' }}
      >
        <div className="absolute inset-0 gradient-primary opacity-80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
          Salesforce Senior Engineer
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in">
          Building innovative CRM solutions with AI-powered capabilities
        </p>
        <div className="animate-bounce mt-12">
          <ArrowDown size={32} className="text-white mx-auto" />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-secondary/30 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-tertiary/30 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
    </section>
  );
}
