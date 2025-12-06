// components/GameSanctum.tsx - Updated with cyan/blue color scheme
import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { 
  Code, 
  Palette, 
  Zap, 
  Blocks, 
  Sparkles, 
  Eye,
  Gamepad2,
  Cpu,
  Layers,
  ArrowLeft
} from 'lucide-react';

interface GameSanctumProps {
  onRealmChange: (realm: string) => void;
}

export const GameSanctum: React.FC<GameSanctumProps> = ({ onRealmChange }) => {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  // Enhanced particle system - Updated to cyan/blue
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

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 0.5;
        this.color = `hsl(${190 + Math.random() * 60}, 70%, 60%)`; // Cyan/blue hue
        this.alpha = Math.random() * 0.6 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Fade in/out effect
        this.alpha += (Math.random() - 0.5) * 0.02;
        this.alpha = Math.max(0.1, Math.min(0.8, this.alpha));
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    const particles: Particle[] = Array.from({ length: 80 }, () => new Particle());

    function draw() {
      ctx.fillStyle = 'rgba(6, 18, 28, 0.03)'; // Dark blue tint
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        // Draw connections with gradient
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
              const gradient = ctx.createLinearGradient(
                particle.x, particle.y, otherParticle.x, otherParticle.y
              );
              gradient.addColorStop(0, `hsla(190, 70%, 60%, ${0.15 * (1 - distance / 120)})`);
              gradient.addColorStop(1, `hsla(210, 70%, 60%, ${0.1 * (1 - distance / 120)})`);

              ctx.beginPath();
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 0.3;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          }
        });
      });

      animationFrame = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const gameProjects = [
    {
      id: 1,
      name: 'Nexus Arena',
      type: 'Level Design & VFX',
      description: 'Competitive multiplayer arena with dynamic environmental hazards and advanced particle systems.',
      tech: ['Unity', 'C#', 'HLSL', 'Shader Graph', 'VFX Graph'],
      features: ['Procedural level generation', 'Real-time VFX', 'Multiplayer optimization', 'Dynamic lighting'],
      status: 'In Development',
      icon: Gamepad2,
      gradient: 'from-cyan-500 to-blue-500', // Updated to cyan/blue
      accent: 'cyan'
    },
    {
      id: 2,
      name: 'Chrono Shift',
      type: 'VFX & Time Mechanics',
      description: 'Innovative puzzle platformer featuring time manipulation mechanics with custom shader effects.',
      tech: ['Unity', 'C#', 'Visual Effect Graph', 'Cinema 4D', 'Custom Shaders'],
      features: ['Time distortion VFX', 'Dynamic lighting', 'Shader-based effects', 'Temporal puzzles'],
      status: 'Prototype',
      icon: Zap,
      gradient: 'from-blue-500 to-indigo-500', // Updated to blue
      accent: 'blue'
    },
    {
      id: 3,
      name: 'Echo Vector',
      type: 'Level & VFX Systems',
      description: 'High-speed cyberpunk racing experience with real-time neon trail effects and interactive environmental systems.',
      tech: ['Unity', 'C#', 'Particle Systems', 'Post Processing', 'Shader Forge'],
      features: ['Real-time neon trails', 'Interactive environments', 'Dynamic camera systems', 'Procedural audio'],
      status: 'Concept',
      icon: Sparkles,
      gradient: 'from-sky-500 to-cyan-500', // Updated to cyan
      accent: 'sky'
    },
    {
      id: 4,
      name: 'Aether Forge',
      type: 'VFX Tooling Suite',
      description: 'Comprehensive VFX creation toolkit featuring node-based editor, real-time preview, and extensive shader library.',
      tech: ['Unity Editor Tools', 'C#', 'UI Toolkit', 'Custom Render Passes', 'HLSL'],
      features: ['Node-based VFX editor', 'Real-time preview', 'Shader library', 'Performance profiling'],
      status: 'Active Development',
      icon: Cpu,
      gradient: 'from-teal-500 to-cyan-500', // Updated to teal/cyan
      accent: 'teal'
    }
  ];
  const vfxSkills = [
    { 
      name: 'Portal Effects', 
      type: 'Shader Magic', 
      complexity: 'High',
      icon: Sparkles,
      description: 'Custom portal and dimensional shader effects'
    },
    { 
      name: 'Particle Storms', 
      type: 'GPU Particles', 
      complexity: 'Medium',
      icon: Zap,
      description: 'High-performance GPU particle systems'
    },
    { 
      name: 'Time Distortion', 
      type: 'Custom Shader', 
      complexity: 'High',
      icon: Layers,
      description: 'Temporal distortion and time-based effects'
    },
    { 
      name: 'Neon Trails', 
      type: 'Trail Renderer', 
      complexity: 'Medium',
      icon: Eye,
      description: 'Dynamic trail and after-image effects'
    },
    { 
      name: 'Holographic UI', 
      type: 'UI VFX', 
      complexity: 'Low',
      icon: Blocks,
      description: 'Interactive holographic interface elements'
    },
    { 
      name: 'Environmental FX', 
      type: 'World Building', 
      complexity: 'Medium',
      icon: Palette,
      description: 'Atmospheric and environmental visual effects'
    }
  ];

  const specializations = [
    {
      title: 'Visual Effect Graph',
      description: 'Advanced GPU-powered particle systems and complex visual simulations using Unitys node-based VFX framework.',
      icon: Zap,
      stats: '120+ Systems Built'
    },
    {
      title: 'Shader Development',
      description: 'Custom HLSL shaders and visual programming for unique visual experiences and rendering optimization.',
      icon: Code,
      stats: '85+ Custom Shaders'
    },
    {
      title: 'Level Design',
      description: 'Creating immersive, gameplay-focused environments with optimal player flow and visual storytelling.',
      icon: Gamepad2,
      stats: '45+ Levels Designed'
    }
  ];

  return (
    <section ref={containerRef} className="min-h-screen py-20 px-6 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-40"
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-emerald-950/10 to-cyan-950/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_20%,rgba(16,185,129,0.15),transparent)]" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-24 transition-all duration-1000 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <button
            onClick={() => onRealmChange('home')}
            className="group inline-flex items-center px-6 py-3 bg-emerald-500/10 border border-emerald-400/20 rounded-2xl text-emerald-400 font-light text-lg mb-8 hover:bg-emerald-500/20 hover:border-emerald-400/30 transition-all duration-500"
          >
            <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <h1 className="text-6xl md:text-8xl font-light mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-emerald-400 tracking-tighter">
            Game Sanctum
          </h1>
          
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
            Where code meets creativity. A collection of interactive experiences, 
            visual effects mastery, and immersive level design projects.
          </p>
        </div>

        {/* Main Projects Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-28">
          {gameProjects.map((project, index) => {
            const IconComponent = project.icon;
            return (
              <div
                key={project.id}
                className={`group relative bg-gray-900/40 backdrop-blur-xl border border-emerald-500/10 rounded-3xl p-8 transition-all duration-700 hover:border-emerald-400/30 overflow-hidden ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onMouseEnter={() => setActiveProject(project.id)}
                onMouseLeave={() => setActiveProject(null)}
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-1000`} />
                
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                
                <div className="relative">
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${project.gradient} shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-light text-white mb-1">{project.name}</h3>
                        <span className="text-emerald-400 font-light text-sm tracking-wide">{project.type}</span>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-light border ${
                      project.status === 'In Development' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20' :
                      project.status === 'Prototype' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-400/20' :
                      project.status === 'Concept' ? 'bg-violet-500/10 text-violet-400 border-violet-400/20' :
                      'bg-orange-500/10 text-orange-400 border-orange-400/20'
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-8 leading-relaxed font-light text-lg">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {project.tech.map(tech => (
                      <span 
                        key={tech} 
                        className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-xl text-sm font-light border border-gray-700/50 backdrop-blur-sm hover:bg-emerald-500/20 hover:text-emerald-300 hover:border-emerald-400/30 transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {project.features.map(feature => (
                      <div key={feature} className="flex items-center text-gray-400 font-light">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-4 animate-pulse" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Interactive Preview */}
                  <div className="mt-6 p-6 bg-black/30 rounded-2xl border border-emerald-500/10 backdrop-blur-sm">
                    <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center group-hover:from-emerald-900/20 group-hover:to-cyan-900/20 transition-all duration-500">
                      <div className="text-center">
                        <Eye className="w-8 h-8 text-emerald-400 mx-auto mb-3 opacity-60" />
                        <span className="text-emerald-400 font-light text-sm tracking-wide">
                          {activeProject === project.id ? 'VFX SYSTEMS ACTIVE' : 'HOVER TO PREVIEW'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* VFX Skills Showcase */}
        <div className={`bg-gray-900/30 backdrop-blur-xl rounded-3xl p-12 border border-emerald-500/10 mb-20 transition-all duration-1000 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="text-center mb-16">
            <Code className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-4xl font-light text-white mb-4">VFX Arsenal</h3>
            <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
              Advanced visual effects capabilities and specialized tools for creating immersive experiences
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {vfxSkills.map((skill, index) => {
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
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl transform rotate-45 group-hover:rotate-90 transition-transform duration-700" />
                    <div className="absolute inset-2 bg-gray-900 rounded-xl transform rotate-45 group-hover:rotate-90 transition-transform duration-700" />
                    
                    {/* Icon */}
                    <div className="absolute inset-0 flex items-center justify-center text-emerald-400 group-hover:text-cyan-400 transition-colors duration-500 transform -rotate-45">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 border-2 border-emerald-400/0 group-hover:border-emerald-400/30 rounded-2xl transition-all duration-500" />
                  </div>
                  
                  <div>
                    <div className="text-white font-light text-sm mb-2 transition-all duration-300 group-hover:text-emerald-300">
                      {skill.name}
                    </div>
                    <div className="text-gray-400 text-xs mb-3 font-light">
                      {skill.type}
                    </div>
                    <div className={`text-xs px-3 py-1 rounded-full font-light ${
                      skill.complexity === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      skill.complexity === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {skill.complexity}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Specializations */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 transition-all duration-1000 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {specializations.map((specialty, index) => {
            const IconComponent = specialty.icon;
            return (
              <div
                key={specialty.title}
                className="group bg-gray-900/40 backdrop-blur-xl border border-emerald-500/10 rounded-3xl p-8 hover:border-emerald-400/30 transition-all duration-500 hover:scale-105"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl mb-6 group-hover:from-emerald-400 group-hover:to-cyan-400 transition-all duration-500">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-light text-white mb-4">{specialty.title}</h4>
                  <p className="text-gray-400 font-light leading-relaxed mb-4">
                    {specialty.description}
                  </p>
                  <div className="text-emerald-400 font-light text-sm tracking-wide">
                    {specialty.stats}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Status Footer */}
        <div className={`text-center transition-all duration-1000 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="inline-flex items-center px-8 py-4 bg-emerald-500/10 border border-emerald-400/20 rounded-2xl text-emerald-400 font-light text-lg">
            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-4 animate-pulse" />
            LEVEL DESIGN TOOLS & VFX SYSTEMS • ACTIVE
          </div>
        </div>
      </div>
    </section>
  );
};