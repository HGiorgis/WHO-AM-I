// components/DesignVault.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { 
  Palette, 
  Brush, 
  Layers, 
  Type, 
  Image,
  ArrowLeft,
  Eye,
  Sparkles,
  Layout,
  Pen
} from 'lucide-react';

interface DesignVaultProps {
  onRealmChange: (realm: string) => void;
}

export const DesignVault: React.FC<DesignVaultProps> = ({ onRealmChange }) => {
  const [activeDesign, setActiveDesign] = useState<number | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  // Geometric pattern background
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    let animationFrame: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const shapes: Array<{
      x: number;
      y: number;
      size: number;
      rotation: number;
      speed: number;
      color: string;
      type: 'circle' | 'square' | 'triangle';
    }> = [];

    // Create geometric shapes
    for (let i = 0; i < 25; i++) {
      shapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 20 + Math.random() * 60,
        rotation: Math.random() * 360,
        speed: 0.1 + Math.random() * 0.3,
        color: `hsl(${40 + Math.random() * 30}, 70%, 60%)`,
        type: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as 'circle' | 'square' | 'triangle'
      });
    }

    function draw() {
      ctx.fillStyle = 'rgba(18, 18, 8, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      shapes.forEach(shape => {
        shape.rotation += shape.speed;
        
        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate((shape.rotation * Math.PI) / 180);
        ctx.globalAlpha = 0.1;

        ctx.fillStyle = shape.color;

        switch(shape.type) {
          case 'circle':
            ctx.beginPath();
            ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
            ctx.fill();
            break;
          case 'square':
            ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
            break;
          case 'triangle':
            ctx.beginPath();
            ctx.moveTo(0, -shape.size / 2);
            ctx.lineTo(shape.size / 2, shape.size / 2);
            ctx.lineTo(-shape.size / 2, shape.size / 2);
            ctx.closePath();
            ctx.fill();
            break;
        }

        ctx.restore();
      });

      animationFrame = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const designProjects = [
    {
      id: 1,
      name: 'Brand Identity System',
      type: 'Logo & Visual Identity',
      description: 'Comprehensive brand identity development including logo design, color palette, typography, and brand guidelines.',
      tech: ['Adobe Illustrator', 'Photoshop', 'InDesign', 'Figma'],
      features: ['Logo design', 'Color system', 'Typography', 'Brand guidelines'],
      status: 'Completed',
      icon: Palette,
      gradient: 'from-yellow-500 to-orange-500',
      category: 'Branding'
    },
    {
      id: 2,
      name: 'UI/UX Design System',
      type: 'Digital Product Design',
      description: 'Complete design system for web and mobile applications with component library and interaction patterns.',
      tech: ['Figma', 'Adobe XD', 'Prototyping', 'Design Systems'],
      features: ['Component library', 'Interaction design', 'User flows', 'Design tokens'],
      status: 'Active',
      icon: Layout,
      gradient: 'from-amber-500 to-red-500',
      category: 'UI/UX'
    },
    {
      id: 3,
      name: 'Marketing Campaign',
      type: 'Visual Design',
      description: 'Full-scale marketing campaign design including banners, social media graphics, and promotional materials.',
      tech: ['Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro'],
      features: ['Social media graphics', 'Print materials', 'Motion graphics', 'Campaign assets'],
      status: 'Launched',
      icon: Image,
      gradient: 'from-orange-500 to-pink-500',
      category: 'Marketing'
    },
    {
      id: 4,
      name: 'Typography System',
      type: 'Type Design',
      description: 'Custom typography and font pairing systems for brand consistency across all digital platforms.',
      tech: ['Glyphs', 'Illustrator', 'CSS', 'Variable Fonts'],
      features: ['Font pairing', 'Hierarchy system', 'Responsive typography', 'Web fonts'],
      status: 'Ongoing',
      icon: Type,
      gradient: 'from-red-500 to-purple-500',
      category: 'Typography'
    }
  ];

  const designSkills = [
    { 
      name: 'Logo Design', 
      type: 'Brand Identity', 
      level: 'Expert',
      icon: Brush,
      description: 'Memorable brand marks'
    },
    { 
      name: 'UI Design', 
      type: 'Digital Products', 
      level: 'Advanced',
      icon: Layout,
      description: 'User interface design'
    },
    { 
      name: 'Typography', 
      type: 'Type Systems', 
      level: 'Expert',
      icon: Type,
      description: 'Font and type design'
    },
    { 
      name: 'Illustration', 
      type: 'Visual Art', 
      level: 'Advanced',
      icon: Image,
      description: 'Custom illustrations'
    },
    { 
      name: 'Motion Design', 
      type: 'Animation', 
      level: 'Intermediate',
      icon: Sparkles,
      description: 'Animated graphics'
    },
    { 
      name: 'Color Theory', 
      type: 'Visual Design', 
      level: 'Expert',
      icon: Pen,
      description: 'Color systems'
    }
  ];

  const designPrinciples = [
    {
      title: 'Visual Harmony',
      description: 'Creating balanced and aesthetically pleasing compositions through careful arrangement of elements.',
      icon: Layers,
      focus: 'Balance & Proportion'
    },
    {
      title: 'User-Centered',
      description: 'Designing with the end-user in mind, ensuring intuitive experiences and accessibility.',
      icon: Eye,
      focus: 'Experience & Usability'
    },
    {
      title: 'Brand Consistency',
      description: 'Maintaining visual coherence across all touchpoints to strengthen brand recognition.',
      icon: Palette,
      focus: 'Identity & Recognition'
    }
  ];

  return (
    <section ref={containerRef} className="min-h-screen py-20 px-6 relative overflow-hidden">
      {/* Geometric Pattern Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-30"
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 via-orange-950/10 to-red-950/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_20%,rgba(245,158,11,0.15),transparent)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <button
            onClick={() => onRealmChange('home')}
            className="group inline-flex items-center px-6 py-3 bg-yellow-500/10 border border-yellow-400/20 rounded-2xl text-yellow-400 font-light text-lg mb-8 hover:bg-yellow-500/20 hover:border-yellow-400/30 transition-all duration-500"
          >
            <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <h1 className="text-6xl md:text-8xl font-light mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-400 tracking-tighter">
            Design Vault
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
            Where creativity meets strategy. Visual design, brand identity, and user experience 
            crafted with precision and purpose.
          </p>
        </div>

        {/* Design Projects Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-28">
          {designProjects.map((project, index) => {
            const IconComponent = project.icon;
            return (
              <div
                key={project.id}
                className={`group relative bg-gray-900/40 backdrop-blur-xl border border-yellow-500/10 rounded-3xl p-8 transition-all duration-700 hover:border-yellow-400/30 overflow-hidden ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onMouseEnter={() => setActiveDesign(project.id)}
                onMouseLeave={() => setActiveDesign(null)}
              >
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-1000`} />
                
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                
                <div className="relative">
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${project.gradient} shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-light text-white mb-1">{project.name}</h3>
                        <span className="text-yellow-400 font-light text-sm tracking-wide">{project.type}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-4 py-2 rounded-full text-sm font-light border ${
                        project.category === 'Branding' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20' :
                        project.category === 'UI/UX' ? 'bg-orange-500/10 text-orange-400 border-orange-400/20' :
                        project.category === 'Marketing' ? 'bg-pink-500/10 text-pink-400 border-pink-400/20' :
                        'bg-purple-500/10 text-purple-400 border-purple-400/20'
                      }`}>
                        {project.category}
                      </span>
                      <div className="text-yellow-400 text-xs font-light mt-2">{project.status}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-8 leading-relaxed font-light text-lg">
                    {project.description}
                  </p>

                  {/* Tools */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {project.tech.map(tech => (
                      <span 
                        key={tech} 
                        className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-xl text-sm font-light border border-gray-700/50 backdrop-blur-sm hover:bg-yellow-500/20 hover:text-yellow-300 hover:border-yellow-400/30 transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {project.features.map(feature => (
                      <div key={feature} className="flex items-center text-gray-400 font-light">
                        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-4 animate-pulse" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Design Preview */}
                  <div className="mt-6 p-6 bg-black/30 rounded-2xl border border-yellow-500/10 backdrop-blur-sm">
                    <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center group-hover:from-yellow-900/20 group-hover:to-orange-900/20 transition-all duration-500">
                      <div className="text-center">
                        <Eye className="w-8 h-8 text-yellow-400 mx-auto mb-3 opacity-60" />
                        <span className="text-yellow-400 font-light text-sm tracking-wide">
                          {activeDesign === project.id ? 'DESIGN PREVIEW' : 'VIEW PROJECT'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Design Skills */}
        <div className={`bg-gray-900/30 backdrop-blur-xl rounded-3xl p-12 border border-yellow-500/10 mb-20 transition-all duration-1000 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="text-center mb-16">
            <Palette className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-4xl font-light text-white mb-4">Design Skills</h3>
            <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
              Comprehensive design capabilities across multiple disciplines and mediums
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {designSkills.map((skill, index) => {
              const IconComponent = skill.icon;
              return (
                <div
                  key={skill.name}
                  className="group text-center cursor-pointer transform transition-all duration-500 hover:scale-105"
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                >
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl transform rotate-45 group-hover:rotate-90 transition-transform duration-700" />
                    <div className="absolute inset-2 bg-gray-900 rounded-xl transform rotate-45 group-hover:rotate-90 transition-transform duration-700" />
                    
                    {/* Icon */}
                    <div className="absolute inset-0 flex items-center justify-center text-yellow-400 group-hover:text-orange-400 transition-colors duration-500 transform -rotate-45">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 border-2 border-yellow-400/0 group-hover:border-yellow-400/30 rounded-2xl transition-all duration-500" />
                  </div>
                  
                  <div>
                    <div className="text-white font-light text-sm mb-2 transition-all duration-300 group-hover:text-yellow-300">
                      {skill.name}
                    </div>
                    <div className="text-gray-400 text-xs mb-3 font-light">
                      {skill.type}
                    </div>
                    <div className={`text-xs px-3 py-1 rounded-full font-light ${
                      skill.level === 'Expert' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                      skill.level === 'Advanced' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {skill.level}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Design Principles */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 transition-all duration-1000 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {designPrinciples.map((principle, index) => {
            const IconComponent = principle.icon;
            return (
              <div
                key={principle.title}
                className="group bg-gray-900/40 backdrop-blur-xl border border-yellow-500/10 rounded-3xl p-8 hover:border-yellow-400/30 transition-all duration-500 hover:scale-105"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mb-6 group-hover:from-yellow-400 group-hover:to-orange-400 transition-all duration-500">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-light text-white mb-4">{principle.title}</h4>
                  <p className="text-gray-400 font-light leading-relaxed mb-4">
                    {principle.description}
                  </p>
                  <div className="text-yellow-400 font-light text-sm tracking-wide">
                    {principle.focus}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};