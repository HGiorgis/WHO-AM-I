// components/Project.tsx
import React, { useState } from "react";
import { ExternalLink, Github, Eye, ChevronLeft, ChevronRight, Filter } from "lucide-react";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: "web" | "mobile" | "fullstack" | "ai" | "game";
  githubUrl: string;
  liveUrl?: string;
  image: string;
  featured: boolean;
  status: "completed" | "in-progress" | "planned";
}

const Project = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 6;

  // Sample projects data
  const projects: Project[] = [
    {
      id: "1",
      title: "Cyber Portfolio",
      description: "Interactive developer portfolio with realm system",
      longDescription: "A cutting-edge portfolio website featuring multiple realms, terminal access, and interactive UI components. Built with React, TypeScript, and Tailwind CSS.",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Framer Motion"],
      category: "web",
      githubUrl: "https://github.com/username/cyber-portfolio",
      liveUrl: "https://portfolio.example.com",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop",
      featured: true,
      status: "completed"
    },
    {
      id: "2",
      title: "AI Chat Assistant",
      description: "Intelligent chatbot with natural language processing",
      longDescription: "An advanced AI chatbot that understands context and provides intelligent responses. Features real-time messaging, file uploads, and multi-language support.",
      technologies: ["Python", "FastAPI", "React", "OpenAI", "PostgreSQL"],
      category: "ai",
      githubUrl: "https://github.com/username/ai-chat",
      liveUrl: "https://chat.example.com",
      image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=250&fit=crop",
      featured: true,
      status: "completed"
    },
    {
      id: "3",
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution",
      longDescription: "A complete e-commerce platform with user authentication, payment processing, inventory management, and admin dashboard.",
      technologies: ["Node.js", "Express", "MongoDB", "React", "Stripe"],
      category: "fullstack",
      githubUrl: "https://github.com/username/ecommerce-platform",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
      featured: false,
      status: "completed"
    },
    {
      id: "4",
      title: "Mobile Task Manager",
      description: "Cross-platform task management app",
      longDescription: "A beautiful and intuitive task manager for iOS and Android with offline support, notifications, and cloud synchronization.",
      technologies: ["React Native", "TypeScript", "Firebase", "Redux"],
      category: "mobile",
      githubUrl: "https://github.com/username/task-manager",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
      featured: false,
      status: "in-progress"
    },
    {
      id: "5",
      title: "Blockchain Explorer",
      description: "Real-time blockchain transaction viewer",
      longDescription: "A real-time blockchain explorer that visualizes transactions, blocks, and network statistics with interactive charts and analytics.",
      technologies: ["Web3.js", "React", "Node.js", "WebSocket", "Chart.js"],
      category: "web",
      githubUrl: "https://github.com/username/blockchain-explorer",
      liveUrl: "https://explorer.example.com",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop",
      featured: true,
      status: "completed"
    },
    {
      id: "6",
      title: "AR Gaming App",
      description: "Augmented reality mobile game",
      longDescription: "An immersive AR gaming experience that blends virtual elements with the real world using advanced computer vision and 3D rendering.",
      technologies: ["Unity", "C#", "ARCore", "Blender"],
      category: "game",
      githubUrl: "https://github.com/username/ar-game",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=250&fit=crop",
      featured: false,
      status: "planned"
    },
    {
      id: "7",
      title: "Data Visualization Dashboard",
      description: "Real-time analytics and data visualization",
      longDescription: "A comprehensive dashboard for visualizing complex datasets with interactive charts, real-time updates, and customizable widgets.",
      technologies: ["D3.js", "React", "Python", "FastAPI", "Redis"],
      category: "web",
      githubUrl: "https://github.com/username/data-dashboard",
      liveUrl: "https://dashboard.example.com",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      featured: false,
      status: "completed"
    },
    {
      id: "8",
      title: "Machine Learning API",
      description: "REST API for ML model inference",
      longDescription: "A scalable REST API serving machine learning models with automatic scaling, monitoring, and comprehensive documentation.",
      technologies: ["Python", "TensorFlow", "Docker", "Kubernetes", "FastAPI"],
      category: "ai",
      githubUrl: "https://github.com/username/ml-api",
      image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&h=250&fit=crop",
      featured: false,
      status: "completed"
    }
  ];

  const categories = [
    { id: "all", name: "All Projects", count: projects.length },
    { id: "web", name: "Web Development", count: projects.filter(p => p.category === "web").length },
    { id: "mobile", name: "Mobile Apps", count: projects.filter(p => p.category === "mobile").length },
    { id: "ai", name: "AI & Machine Learning", count: projects.filter(p => p.category === "ai").length },
    { id: "game", name: "Games", count: projects.filter(p => p.category === "game").length },
    { id: "fullstack", name: "Full Stack", count: projects.filter(p => p.category === "fullstack").length }
  ];

  const statusColors = {
    "completed": "bg-green-500/20 text-green-400 border-green-500/30",
    "in-progress": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    "planned": "bg-blue-500/20 text-blue-400 border-blue-500/30"
  };

  const categoryColors = {
    "web": "from-blue-500/10 to-cyan-500/10 border-blue-500/20",
    "mobile": "from-purple-500/10 to-pink-500/10 border-purple-500/20",
    "ai": "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
    "game": "from-orange-500/10 to-red-500/10 border-orange-500/20",
    "fullstack": "from-indigo-500/10 to-purple-500/10 border-indigo-500/20"
  };

  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(project => project.category === filter);

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);

  const openProjectDetail = (project: Project) => {
    setSelectedProject(project);
  };

  const closeProjectDetail = () => {
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen text-white pt-20 px-4 max-w-7xl mx-auto">
        

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4 text-white p-20 text-4xl font-light">
         PROJECT
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          A collection of my work across various domains - from web development to AI and games
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => {
              setFilter(category.id);
              setCurrentPage(1);
            }}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
              filter === category.id
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                : "bg-gray-800/50 border-gray-600 text-gray-300 hover:border-cyan-400/50"
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>{category.name}</span>
            <span className="bg-gray-700/50 px-2 py-1 rounded text-xs">
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {currentProjects.map(project => (
          <div
            key={project.id}
            className={`group bg-gradient-to-br ${categoryColors[project.category]} border rounded-xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20`}
            onClick={() => openProjectDetail(project)}
          >
            {/* Project Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
              
              {/* Status Badge */}
              <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs border ${statusColors[project.status]}`}>
                {project.status.replace("-", " ")}
              </div>

              {/* Featured Badge */}
              {project.featured && (
                <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs">
                  Featured
                </div>
              )}

              {/* Overlay Icons */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-black/50 rounded-full p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <Eye className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 group-hover:text-cyan-300 transition-colors duration-300">
                {project.title}
              </h3>
              <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                {project.description}
              </p>
              
              {/* Technologies */}
              <div className="flex flex-wrap gap-1 mb-3">
                {project.technologies.slice(0, 3).map(tech => (
                  <span
                    key={tech}
                    className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300">
                    +{project.technologies.length - 3}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center">
                <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors duration-300">
                  View Details →
                </button>
                <div className="flex space-x-2">
                  <a
                    href={project.githubUrl}
                    onClick={e => e.stopPropagation()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors duration-300"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      onClick={e => e.stopPropagation()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors duration-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mb-12">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:border-cyan-400 transition-colors duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:border-cyan-400 transition-colors duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Header Image */}
              <div className="relative h-64">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                
                <button
                  onClick={closeProjectDetail}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors duration-300"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <h2 className="text-3xl font-bold text-white">{selectedProject.title}</h2>
                  <div className={`px-3 py-1 rounded-full text-sm border ${statusColors[selectedProject.status]}`}>
                    {selectedProject.status.replace("-", " ")}
                  </div>
                  {selectedProject.featured && (
                    <div className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-sm">
                      Featured
                    </div>
                  )}
                </div>

                <p className="text-gray-300 text-lg mb-6">{selectedProject.longDescription}</p>

                {/* Technologies */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-cyan-400">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map(tech => (
                      <span
                        key={tech}
                        className="px-3 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-4">
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300"
                  >
                    <Github className="w-5 h-5" />
                    <span>View Source Code</span>
                  </a>
                  
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-6 py-3 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors duration-300"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Live Preview</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;