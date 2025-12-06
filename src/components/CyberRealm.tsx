// components/CyberRealm.tsx - Updated with green color scheme
import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { 
  Cpu, 
  Shield, 
  Network, 
  Lock, 
  Zap,
  Code,
  Eye,
  Brain,
  Key,
  Scan,
  ArrowRight,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

interface CyberRealmProps {
  onRealmChange: (realm: string) => void;
}

export const CyberRealm: React.FC<CyberRealmProps> = ({ onRealmChange }) => {
  const [activeSystem, setActiveSystem] = useState<number | null>(null);
  const [hackerRank] = useState('Pen Tester');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });
  // Enhanced neural network background - Updated to green
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

    class NeuralNode {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      connections: Set<NeuralNode>;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = 2 + Math.random() * 3;
        this.color = `hsl(${140 + Math.random() * 60}, 70%, 60%)`; // Green hue
        this.connections = new Set();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Soft boundary
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        // Inner glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.restore();
      }
    }

    const nodes: NeuralNode[] = Array.from({ length: 40 }, () => new NeuralNode());

    function draw() {
      // Clear with subtle fade
      ctx.fillStyle = 'rgba(6, 18, 12, 0.03)'; // Dark green tint
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;

      // Update and draw nodes
      nodes.forEach(node => {
        node.update();
        node.draw();
      });

      // Draw connections with intelligence
      nodes.forEach((node, i) => {
        nodes.forEach((otherNode, j) => {
          if (i !== j) {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
              const pulse = (Math.sin(time * 2 + i + j) + 1) * 0.5;
              const alpha = 0.2 * (1 - distance / 150) * pulse;

              ctx.save();
              ctx.globalAlpha = alpha;
              ctx.strokeStyle = `hsl(${140 + pulse * 60}, 70%, 60%)`; // Green hue
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(otherNode.x, otherNode.y);
              ctx.stroke();
              ctx.restore();
            }
          }
        });
      });

      // Draw data pulses
      if (time % 2 < 0.1) {
        const startNode = nodes[Math.floor(Math.random() * nodes.length)];
        const endNode = nodes[Math.floor(Math.random() * nodes.length)];
        
        const progress = (time % 2) / 0.1;
        const pulseX = startNode.x + (endNode.x - startNode.x) * progress;
        const pulseY = startNode.y + (endNode.y - startNode.y) * progress;

        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = '#10b981'; // Emerald color
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrame = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const cyberSystems = [
    {
      id: 1,
      name: 'Network Fortress',
      type: 'Penetration Testing',
      description: 'Advanced network security analysis and vulnerability assessment systems with real-time threat detection.',
      tech: ['Kali Linux', 'Nmap', 'Wireshark', 'Metasploit', 'Burp Suite'],
      features: ['Real-time monitoring', 'Vulnerability scanning', 'Traffic analysis', 'Intrusion detection'],
      status: 'Active',
      icon: Network,
      gradient: 'from-emerald-500 to-green-500', // Updated to green
      level: 'Advanced'
    },
    {
      id: 2,
      name: 'Cryptographic Core',
      type: 'Encryption Systems',
      description: 'Military-grade encryption protocols and cryptographic key management for secure communications.',
      tech: ['AES-256', 'RSA-4096', 'SHA-3', 'PGP', 'SSL/TLS'],
      features: ['End-to-end encryption', 'Key exchange protocols', 'Digital signatures', 'Secure hashing'],
      status: 'Operational',
      icon: Lock,
      gradient: 'from-green-500 to-emerald-500', // Updated to green
      level: 'Elite'
    },
    {
      id: 3,
      name: 'Threat Intelligence',
      type: 'AI Security',
      description: 'Artificial intelligence powered threat detection and behavioral analysis systems.',
      tech: ['Machine Learning', 'Neural Networks', 'Behavioral Analysis', 'Pattern Recognition'],
      features: ['Anomaly detection', 'Predictive analysis', 'Threat hunting', 'Risk assessment'],
      status: 'Learning',
      icon: Brain,
      gradient: 'from-lime-500 to-green-500', // Updated to green
      level: 'Experimental'
    },
    {
      id: 4,
      name: 'Digital Forensics',
      type: 'Incident Response',
      description: 'Comprehensive digital evidence collection and analysis toolkit for cyber investigations.',
      tech: ['FTK', 'Autopsy', 'Volatility', 'Sleuth Kit', 'Forensic Imaging'],
      features: ['Memory analysis', 'Disk imaging', 'Data recovery', 'Timeline analysis'],
      status: 'Ready',
      icon: Scan,
      gradient: 'from-teal-500 to-emerald-500', // Updated to green
      level: 'Professional'
    }
  ];

  const securityTools = [
    { 
      name: 'Port Scanner', 
      type: 'Reconnaissance', 
      complexity: 'Medium',
      icon: Network,
      description: 'Network port and service discovery'
    },
    { 
      name: 'Vulnerability Analyzer', 
      type: 'Assessment', 
      complexity: 'High',
      icon: Shield,
      description: 'Security vulnerability detection'
    },
    { 
      name: 'Packet Sniffer', 
      type: 'Analysis', 
      complexity: 'Medium',
      icon: Eye,
      description: 'Network traffic interception'
    },
    { 
      name: 'Password Cracker', 
      type: 'Offensive', 
      complexity: 'High',
      icon: Key,
      description: 'Credential recovery tools'
    },
    { 
      name: 'Firewall Tester', 
      type: 'Defense', 
      complexity: 'Medium',
      icon: Zap,
      description: 'Security perimeter testing'
    },
    { 
      name: 'Malware Analysis', 
      type: 'Forensics', 
      complexity: 'Expert',
      icon: Code,
      description: 'Malicious code examination'
    }
  ];

  const certifications = [
    {
      title: 'OSCP Certified',
      description: 'Offensive Security Certified Professional with advanced penetration testing skills.',
      icon: Shield,
      status: 'Active'
    },
    {
      title: 'CEH Master',
      description: 'Certified Ethical Hacker with comprehensive knowledge of security tools and techniques.',
      icon: Zap,
      status: 'Certified'
    },
    {
      title: 'Network Defender',
      description: 'Expert in network security protocols and defensive cybersecurity measures.',
      icon: Network,
      status: 'Operational'
    }
  ];


  return (
    <section ref={containerRef} className="min-h-screen py-20 px-6 relative overflow-hidden">
      {/* Enhanced Neural Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-60"
      />
      
      {/* Gradient Overlays - Updated to green */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-emerald-950/10 to-green-950/20" />
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
          
          <h1 className="text-6xl md:text-8xl font-light mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-300 to-emerald-400 tracking-tighter">
            Cyber Realm
          </h1>
          
          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="text-center">
              <div className="text-3xl text-emerald-400 font-light">{hackerRank}</div>
              <div className="text-gray-400 text-sm font-light">Current Rank</div>
            </div>
            <div className="w-px h-12 bg-emerald-400/30"></div>
            <div className="text-center">
              <div className="text-3xl text-green-400 font-light">24/7</div>
              <div className="text-gray-400 text-sm font-light">Monitoring</div>
            </div>
            <div className="w-px h-12 bg-emerald-400/30"></div>
            <div className="text-center">
              <div className="text-3xl text-lime-400 font-light">100%</div>
              <div className="text-gray-400 text-sm font-light">Secure</div>
            </div>
          </div>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
            Advanced cybersecurity operations center. Real-time threat monitoring, 
            penetration testing, and secure system analysis.
          </p>
        </div>

        {/* Security Systems Grid - Updated colors */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-28">
          {cyberSystems.map((system, index) => {
            const IconComponent = system.icon;
            return (
              <div
                key={system.id}
                className={`group relative bg-gray-900/40 backdrop-blur-xl border border-emerald-500/10 rounded-3xl p-8 transition-all duration-700 hover:border-emerald-400/30 overflow-hidden ${
                  isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onMouseEnter={() => setActiveSystem(system.id)}
                onMouseLeave={() => setActiveSystem(null)}
              >
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${system.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-1000`} />
                
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                
                <div className="relative">
                  {/* System Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${system.gradient} shadow-lg`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-light text-white mb-1">{system.name}</h3>
                        <span className="text-emerald-400 font-light text-sm tracking-wide">{system.type}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-4 py-2 rounded-full text-sm font-light border ${
                        system.level === 'Elite' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20' :
                        system.level === 'Advanced' ? 'bg-green-500/10 text-green-400 border-green-400/20' :
                        system.level === 'Experimental' ? 'bg-lime-500/10 text-lime-400 border-lime-400/20' :
                        'bg-teal-500/10 text-teal-400 border-teal-400/20'
                      }`}>
                        {system.level}
                      </span>
                      <div className="text-emerald-400 text-xs font-light mt-2">{system.status}</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-8 leading-relaxed font-light text-lg">
                    {system.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {system.tech.map(tech => (
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
                    {system.features.map(feature => (
                      <div key={feature} className="flex items-center text-gray-400 font-light">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-4 animate-pulse" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Status Monitor */}
                  <div className="mt-6 p-6 bg-black/30 rounded-2xl border border-emerald-500/10 backdrop-blur-sm">
                    <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center group-hover:from-emerald-900/20 group-hover:to-green-900/20 transition-all duration-500">
                      <div className="text-center">
                        <Eye className="w-8 h-8 text-emerald-400 mx-auto mb-3 opacity-60" />
                        <span className="text-emerald-400 font-light text-sm tracking-wide">
                          {activeSystem === system.id ? 'SYSTEM MONITOR ACTIVE' : 'SECURE CONNECTION'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security Tools - Updated colors */}
        <div className={`bg-gray-900/30 backdrop-blur-xl rounded-3xl p-12 border border-emerald-500/10 mb-20 transition-all duration-1000 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="text-center mb-16">
            <Cpu className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-4xl font-light text-white mb-4">Security Arsenal</h3>
            <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
              Advanced cybersecurity tools and utilities for comprehensive threat analysis and system protection
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {securityTools.map((tool, index) => {
              const IconComponent = tool.icon;
              return (
                <div
                  key={tool.name}
                  className="group text-center cursor-pointer transform transition-all duration-500 hover:scale-105"
                >
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl transform rotate-45 group-hover:rotate-90 transition-transform duration-700" />
                    <div className="absolute inset-2 bg-gray-900 rounded-xl transform rotate-45 group-hover:rotate-90 transition-transform duration-700" />
                    
                    {/* Icon */}
                    <div className="absolute inset-0 flex items-center justify-center text-emerald-400 group-hover:text-green-400 transition-colors duration-500 transform -rotate-45">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 border-2 border-emerald-400/0 group-hover:border-emerald-400/30 rounded-2xl transition-all duration-500" />
                  </div>
                  
                  <div>
                    <div className="text-white font-light text-sm mb-2 transition-all duration-300 group-hover:text-emerald-300">
                      {tool.name}
                    </div>
                    <div className="text-gray-400 text-xs mb-3 font-light">
                      {tool.type}
                    </div>
                    <div className={`text-xs px-3 py-1 rounded-full font-light ${
                      tool.complexity === 'Expert' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      tool.complexity === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {tool.complexity}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certifications - Updated colors */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 transition-all duration-1000 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {certifications.map((cert, index) => {
            const IconComponent = cert.icon;
            return (
              <div
                key={cert.title}
                className="group bg-gray-900/40 backdrop-blur-xl border border-emerald-500/10 rounded-3xl p-8 hover:border-emerald-400/30 transition-all duration-500 hover:scale-105"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl mb-6 group-hover:from-emerald-400 group-hover:to-green-400 transition-all duration-500">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-light text-white mb-4">{cert.title}</h4>
                  <p className="text-gray-400 font-light leading-relaxed mb-4">
                    {cert.description}
                  </p>
                  <div className="text-emerald-400 font-light text-sm tracking-wide">
                    {cert.status}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation to Other Realms - Updated colors */}
        <div className={`bg-gray-900/30 backdrop-blur-xl rounded-3xl p-12 border border-emerald-500/10 mb-20 transition-all duration-1000 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="text-center mb-12">
            <ArrowRight className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-4xl font-light text-white mb-4">Explore Other Realms</h3>
            <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
              Discover more aspects of my work and expertise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={() => onRealmChange('dev')}
              className="group relative bg-gray-800/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-8 text-left transition-all duration-500 hover:border-blue-400/40 hover:scale-105"
            >
              <div className="p-3 rounded-xl bg-blue-500/10 inline-block mb-4">
                <Code className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="text-2xl font-light text-white mb-2">Dev Realm</h4>
              <p className="text-gray-400 font-light mb-4">Full-stack development & system architecture</p>
              <div className="flex items-center text-blue-400 font-light text-sm">
                <span>Explore Development</span>
                <ChevronRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => onRealmChange('design')}
              className="group relative bg-gray-800/50 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-8 text-left transition-all duration-500 hover:border-yellow-400/40 hover:scale-105"
            >
              <div className="p-3 rounded-xl bg-yellow-500/10 inline-block mb-4">
                <Eye className="w-8 h-8 text-yellow-400" />
              </div>
              <h4 className="text-2xl font-light text-white mb-2">Design Vault</h4>
              <p className="text-gray-400 font-light mb-4">Visual design & brand identity systems</p>
              <div className="flex items-center text-yellow-400 font-light text-sm">
                <span>Access Required</span>
                <ChevronRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => onRealmChange('game')}
              className="group relative bg-gray-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 text-left transition-all duration-500 hover:border-cyan-400/40 hover:scale-105"
            >
              <div className="p-3 rounded-xl bg-cyan-500/10 inline-block mb-4">
                <Zap className="w-8 h-8 text-cyan-400" />
              </div>
              <h4 className="text-2xl font-light text-white mb-2">Game Sanctum</h4>
              <p className="text-gray-400 font-light mb-4">Unity development & VFX systems</p>
              <div className="flex items-center text-cyan-400 font-light text-sm">
                <span>Access Required</span>
                <ChevronRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>

    </section>
  );
};