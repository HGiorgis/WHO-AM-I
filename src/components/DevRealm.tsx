// components/DevRealm.tsx
import React, { useState, useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import {
  Code,
  Database,
  Server,
  Globe,
  Shield,
  Zap,
  ArrowLeft,
  ExternalLink,
  GitBranch,
  Cpu,
} from "lucide-react";

interface DevRealmProps {
  onRealmChange: (realm: string) => void;
}

export const DevRealm: React.FC<DevRealmProps> = ({ onRealmChange }) => {
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.2 });

  // Code particle background
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    let animationFrame: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const symbols = [
      "{}",
      "[]",
      "();",
      "<>",
      "=>",
      "===",
      "${ }",
      "import",
      "export",
      "function",
    ];
    const particles: Array<{
      text: string;
      x: number;
      y: number;
      speed: number;
      opacity: number;
      size: number;
    }> = [];

    // Create code particles
    for (let i = 0; i < 30; i++) {
      particles.push({
        text: symbols[Math.floor(Math.random() * symbols.length)],
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.2 + Math.random() * 0.8,
        opacity: 0.1 + Math.random() * 0.3,
        size: 12 + Math.random() * 8,
      });
    }

    function draw() {
      ctx.fillStyle = "rgba(8, 18, 28, 0.03)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = 'bold 14px "JetBrains Mono", monospace';
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";

      particles.forEach((particle) => {
        particle.y += particle.speed;
        if (particle.y > canvas.height) {
          particle.y = -20;
          particle.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = `hsl(${210 + Math.random() * 30}, 70%, 60%)`;
        ctx.fillText(particle.text, particle.x, particle.y);
        ctx.restore();
      });

      animationFrame = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const devProjects = [
    {
      id: 1,
      name: "Sankrypt",
      type: "Password Vault & Browser Extension",
      description:
        "A zero-knowledge secure password vault built with client-side encryption. All data is encrypted and decrypted locally using strong cryptographic principles. Includes a Firefox extension built with Manifest V3.",
      tech: [
        "React",
        "TypeScript",
        "Laravel Sanctum",
        "PostgreSQL",
        "Client-Side AES Encryption",
        "Firefox Extension (MV3)",
      ],
      features: [
        "Zero-knowledge architecture",
        "Local encryption / decryption",
        "Cross-platform sync",
        "Secure credential storage",
        "Browser extension auto-fill",
      ],
      status: "Live",
      icon: Shield,
      gradient: "from-green-500 to-emerald-500",
      level: "Secure",
    },
    {
      id: 2,
      name: "Aesop Meredaja",
      type: "Innovation & Investment Platform",
      description:
        "A full ecosystem that connects innovators and investors. Rebuilt from native PHP to a secure modern stack with Laravel API + React/TypeScript frontend. Includes TOTP authentication, Gmail verification, secure project sharing, cryptography-based messaging, and integrated payments.",
      tech: [
        "Laravel",
        "React + TypeScript",
        "Tailwind CSS",
        "PostgreSQL",
        "TOTP Auth",
        "REST API",
      ],
      features: [
        "Secure real-time messaging",
        "TOTP + Gmail verification",
        "Investor–innovator private project access",
        "PayPal & Chapa payment integration",
        "Full system redesign + security upgrade",
      ],
      status: "Pending Deployment (New Version)",
      icon: Globe,
      gradient: "from-purple-500 to-pink-500",
      level: "Production",
    },
    {
      id: 3,
      name: "Alkore",
      type: "Productivity & Habit Tracking System",
      description:
        "A productivity platform for daily habit tracking, streak monitoring, task organization, and push notifications. Built for users who want clean workflow management with analytics.",
      tech: [
        "Express.js",
        "React",
        "MySQL",
        "TypeScript",
        "Push Notifications",
      ],
      features: [
        "Daily tasks + habit streaks",
        "Clean dashboard UI",
        "Real-time updates",
        "Push notification reminders",
      ],
      status: "Live",
      icon: Zap,
      gradient: "from-purple-500 to-emerald-500",
      level: "Moderate",
    },
    {
      id: 4,
      name: "KD Poultry Farm System",
      type: "Farm Reporting & Analytics",
      description:
        "A full farm management system built for a 1000-hen poultry farm. Tracks expenses, production, sales, profit/loss, and shows analytics using tables and charts. Designed to replace manual record-keeping.",
      tech: [
        "React",
        "Express.js",
        "MySQL / MongoDB (migration in progress)",
        "Chart Visualization",
      ],
      features: [
        "Daily production records",
        "Expense & revenue tracking",
        "Analytics dashboard",
        "Profit & loss reporting",
      ],
      status: "Live",
      icon: Code,
      gradient: "from-orange-500 to-red-500",
      level: "Advanced",
    },
    {
      id: 5,
      name: "Queue Management System (SaaS)",
      type: "Ticketing & Queue Platform",
      description:
        "A SaaS queue management solution built with Roha Systems. Organizations like banks, hospitals, or service centers can manage tickets, operators, and customer flow with an automated display system.",
      tech: [
        "Express.js",
        "React",
        "PostgreSQL",
        "REST API",
        "SaaS Architecture",
      ],
      features: [
        "Multi-organization SaaS tenant support",
        "Ticket generation & tracking",
        "Operator & service assignment",
        "Display screen system",
      ],
      status: "Team Project – Active",
      icon: Server,
      gradient: "from-indigo-500 to-blue-500",
      level: "Enterprise",
    },
    {
      id: 6,
      name: "Sankrypt Firefox Extension",
      type: "Browser Extension (Manifest V3)",
      description:
        "A secure browser extension integrated with the Sankrypt password vault. Built using Manifest V3 APIs, the extension enables encrypted credential auto-fill, quick-add password capture, and instant access to the user’s encrypted vault through a local-first architecture.",
      tech: [
        "JavaScript / TypeScript",
        "Firefox Manifest V3",
        "Browser APIs",
        "Client-Side Encryption",
        "REST Integration",
      ],
      features: [
        "Auto-fill detection for login forms",
        "Secure encrypted vault sync",
        "Local-only decryption (zero server knowledge)",
        "One-click save credentials",
        "Seamless integration with Sankrypt backend",
      ],
      status: "Live",
      icon: Shield,
      gradient: "from-teal-500 to-cyan-500",
      level: "Advanced",
    },
  ];

  const techStack = [
    {
      name: "React",
      type: "Frontend",
      level: "Expert",
      icon: Code,
      description: "Modern React with TypeScript and Vite",
    },
    {
      name: "TypeScript",
      type: "Language",
      level: "Expert",
      icon: Cpu,
      description: "Strong typing, clean architecture",
    },
    {
      name: "Laravel",
      type: "Backend",
      level: "Advanced",
      icon: Shield,
      description: "REST APIs, authentication, security",
    },
    {
      name: "Express.js",
      type: "Backend",
      level: "Advanced",
      icon: Server,
      description: "API development, SaaS, microservices",
    },
    {
      name: "PostgreSQL",
      type: "Database",
      level: "Advanced",
      icon: Database,
      description: "Complex queries & relational design",
    },
    {
      name: "Tailwind CSS",
      type: "Styling",
      level: "Expert",
      icon: GitBranch,
      description: "Fast UI development with utility-first CSS",
    },
  ];
  const specialties = [
    {
      title: "Full-Stack Development",
      description:
        "Building complete systems from backend architecture to frontend interfaces using modern frameworks like React, Laravel, and Express.",
      icon: Code,
      projects: "20+",
    },
    {
      title: "System Architecture",
      description:
        "Designing scalable APIs, database structures, deployment pipelines, and secure system logic for production-grade applications.",
      icon: Server,
      projects: "10+",
    },
    {
      title: "Security Engineering",
      description:
        "Implementing cryptography, authentication flows (JWT, TOTP), zero-knowledge systems, and secure data practices.",
      icon: Shield,
      projects: "8+",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="min-h-screen py-20 px-6 relative overflow-hidden"
    >
      {/* Code Particle Background */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40" />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/10 to-indigo-950/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_20%,rgba(59,130,246,0.15),transparent)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <button
            onClick={() => onRealmChange("home")}
            className="group inline-flex items-center px-6 py-3 bg-blue-500/10 border border-blue-400/20 rounded-2xl text-blue-400 font-light text-lg mb-8 hover:bg-blue-500/20 hover:border-blue-400/30 transition-all duration-500"
          >
            <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          <h1 className="text-6xl md:text-8xl font-light mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-400 tracking-tighter">
            Dev Realm
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
            Where ideas become digital reality. Full-stack development, system
            architecture, and innovative web solutions.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-28">
          {devProjects.map((project, index) => {
            const IconComponent = project.icon;
            return (
              <div
                key={project.id}
                className={`group relative bg-gray-900/40 backdrop-blur-xl border border-blue-500/10 rounded-3xl p-8 transition-all duration-700 hover:border-blue-400/30 overflow-hidden ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onMouseEnter={() => setActiveProject(project.id)}
                onMouseLeave={() => setActiveProject(null)}
              >
                {/* Animated Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-1000`}
                />

                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                <div className="relative">
                  {/* Project Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-3 rounded-2xl bg-gradient-to-br ${project.gradient} shadow-lg`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-light text-white mb-1">
                          {project.name}
                        </h3>
                        <span className="text-blue-400 font-light text-sm tracking-wide">
                          {project.type}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-light border ${
                          project.level === "Enterprise"
                            ? "bg-blue-500/10 text-blue-400 border-blue-400/20"
                            : project.level === "Production"
                            ? "bg-purple-500/10 text-purple-400 border-purple-400/20"
                            : project.level === "Secure"
                            ? "bg-green-500/10 text-green-400 border-green-400/20"
                            : "bg-orange-500/10 text-orange-400 border-orange-400/20"
                        }`}
                      >
                        {project.level}
                      </span>
                      <div className="text-blue-400 text-xs font-light mt-2">
                        {project.status}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 mb-8 leading-relaxed font-light text-lg">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-xl text-sm font-light border border-gray-700/50 backdrop-blur-sm hover:bg-blue-500/20 hover:text-blue-300 hover:border-blue-400/30 transition-all duration-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {project.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center text-gray-400 font-light"
                      >
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-4 animate-pulse" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Project Preview */}
                  <div className="mt-6 p-6 bg-black/30 rounded-2xl border border-blue-500/10 backdrop-blur-sm">
                    <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center group-hover:from-blue-900/20 group-hover:to-cyan-900/20 transition-all duration-500">
                      <div className="text-center">
                        <ExternalLink className="w-8 h-8 text-blue-400 mx-auto mb-3 opacity-60" />
                        <span className="text-blue-400 font-light text-sm tracking-wide">
                          {activeProject === project.id
                            ? "LIVE PREVIEW"
                            : "PROJECT ACTIVE"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tech Stack */}
        <div
          className={`bg-gray-900/30 backdrop-blur-xl rounded-3xl p-12 border border-blue-500/10 mb-20 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center mb-16">
            <Cpu className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-4xl font-light text-white mb-4">Tech Stack</h3>
            <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
              Modern technologies and frameworks for building scalable,
              performant web applications
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="group text-center cursor-pointer transform transition-all duration-500 hover:scale-105"
                  onMouseEnter={() => setHoveredTech(tech.name)}
                  onMouseLeave={() => setHoveredTech(null)}
                >
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl transform rotate-45 group-hover:rotate-90 transition-transform duration-700" />
                    <div className="absolute inset-2 bg-gray-900 rounded-xl transform rotate-45 group-hover:rotate-90 transition-transform duration-700" />

                    {/* Icon */}
                    <div className="absolute inset-0 flex items-center justify-center text-blue-400 group-hover:text-cyan-400 transition-colors duration-500 transform -rotate-45">
                      <IconComponent className="w-8 h-8" />
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 border-2 border-blue-400/0 group-hover:border-blue-400/30 rounded-2xl transition-all duration-500" />
                  </div>

                  <div>
                    <div className="text-white font-light text-sm mb-2 transition-all duration-300 group-hover:text-blue-300">
                      {tech.name}
                    </div>
                    <div className="text-gray-400 text-xs mb-3 font-light">
                      {tech.type}
                    </div>
                    <div
                      className={`text-xs px-3 py-1 rounded-full font-light ${
                        tech.level === "Expert"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : tech.level === "Advanced"
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "bg-green-500/10 text-green-400 border border-green-500/20"
                      }`}
                    >
                      {tech.level}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Specialties */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {specialties.map((specialty, index) => {
            const IconComponent = specialty.icon;
            return (
              <div
                key={specialty.title}
                className="group bg-gray-900/40 backdrop-blur-xl border border-blue-500/10 rounded-3xl p-8 hover:border-blue-400/30 transition-all duration-500 hover:scale-105"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6 group-hover:from-blue-400 group-hover:to-cyan-400 transition-all duration-500">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-light text-white mb-4">
                    {specialty.title}
                  </h4>
                  <p className="text-gray-400 font-light leading-relaxed mb-4">
                    {specialty.description}
                  </p>
                  <div className="text-blue-400 font-light text-sm tracking-wide">
                    {specialty.projects} Projects
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
