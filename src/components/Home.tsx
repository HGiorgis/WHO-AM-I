// components/Home.tsx - Enhanced with Smooth Scroll Animations
import React, { useState, useRef, useEffect } from 'react';
import { useInView, motion, type Variants } from 'framer-motion';
import { 
  Code,
  Eye,
  Zap,
  Shield,
  Cpu,
  ChevronRight,
  User,
  Sparkles,
  Globe,
  Rocket,
  MapPin,
  GraduationCap,
  Calendar,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { FaGithub, FaTelegram, FaTwitter, FaEnvelope, FaLinkedin } from 'react-icons/fa';

interface HomeProps {
  onRealmChange: (realm: string) => void;
  unlockedRealms?: string[];
}

export const Home: React.FC<HomeProps> = ({ onRealmChange, unlockedRealms = [] }) => {
  const [activeRealm, setActiveRealm] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use multiple inView hooks for different sections
  const headerInView = useInView(containerRef, { once: true, amount: 0.3 });
  const realmsInView = useInView(containerRef, { once: true, amount: 0.2 });
  const skillsInView = useInView(containerRef, { once: true, amount: 0.3 });
  const ctaInView = useInView(containerRef, { once: true, amount: 0.4 });

  const personalInfo = {
    name: 'Hailegiorgis Wagaye',
    shortName: 'HGiorgis',
    location: 'Addis Ababa, Ethiopia',
    email: 'hailegiorgiswagaye@gmail.com',
    github: 'HGiorgis',
    telegram: 'hgiorgis',
    education: 'Adama Science and Technology University',
    degree: 'Software Engineering',
    graduation: '2026',
    status: 'Undergraduate Student'
  };

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/HGiorgis', label: 'GitHub', color: 'hover:text-gray-400' },
    { icon: FaTelegram, href: 'https://t.me/hgiorgis', label: 'Telegram', color: 'hover:text-blue-400' },
    { icon: FaEnvelope, href: 'mailto:hailegiorgiswagaye@gmail.com', label: 'Email', color: 'hover:text-red-400' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-500' },
    { icon: FaTwitter, href: '#', label: 'Twitter', color: 'hover:text-sky-400' }
  ];

  const realms = [
    {
      id: 'dev',
      name: 'Development Realm',
      description: 'Full-stack development, system architecture, and cutting-edge web technologies',
      icon: Code,
      color: 'blue',
      features: ['React/Next.js', 'Node.js', 'TypeScript', 'Cloud Architecture'],
      status: 'Active',
      locked: false,
      animation: { x: -100, y: 50, scale: 0.8, rotate: -5 }
    },
    {
      id: 'cyber',
      name: 'Cyber Realm',
      description: 'Cybersecurity operations, penetration testing, and secure system analysis',
      icon: Shield,
      color: 'cyan',
      features: ['Security Analysis', 'Penetration Testing', 'Network Security', 'Cryptography'],
      status: 'Secure',
      locked: false,
      animation: { x: 100, y: 50, scale: 0.8, rotate: 5 }
    },
    {
      id: 'design',
      name: 'Design Vault',
      description: 'Visual design, brand identity systems, and user experience design',
      icon: Eye,
      color: 'yellow',
      features: ['UI/UX Design', 'Brand Identity', 'Prototyping', 'Design Systems'],
      status: 'Locked',
      locked: true,
      animation: { x: -100, y: -50, scale: 0.8, rotate: -3 },
      unlockHint: 'Use terminal: unlock design DESIGN_2024'
    },
    {
      id: 'game',
      name: 'Game Sanctum',
      description: 'Unity development, game design, and visual effects systems',
      icon: Zap,
      color: 'green',
      features: ['Unity Engine', 'C# Development', '3D Modeling', 'VFX Systems'],
      status: 'Locked',
      locked: true,
      animation: { x: 100, y: -50, scale: 0.8, rotate: 3 },
      unlockHint: 'Use terminal: unlock game GAME_MASTER'
    }
  ];

  // Update realms based on unlocked status
  const updatedRealms = realms.map(realm => ({
    ...realm,
    locked: realm.id === 'design' ? !unlockedRealms.includes('design') : 
            realm.id === 'game' ? !unlockedRealms.includes('game') : 
            realm.locked
  }));

  const skills = [
    { name: 'Frontend Development', level: 95 },
    { name: 'Backend Systems', level: 90 },
    { name: 'UI/UX Design', level: 85 },
    { name: 'Cybersecurity', level: 80 },
    { name: 'Game Development', level: 75 },
    { name: 'Cloud Architecture', level: 88 }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          gradient: 'from-blue-500 to-cyan-500',
          light: 'text-blue-400',
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20'
        };
      case 'yellow':
        return {
          gradient: 'from-yellow-500 to-amber-500',
          light: 'text-yellow-400',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/20'
        };
      case 'cyan':
        return {
          gradient: 'from-cyan-500 to-blue-500',
          light: 'text-cyan-400',
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/20'
        };
      case 'green':
        return {
          gradient: 'from-green-500 to-emerald-500',
          light: 'text-green-400',
          bg: 'bg-green-500/10',
          border: 'border-green-500/20'
        };
      default:
        return {
          gradient: 'from-gray-500 to-gray-600',
          light: 'text-gray-400',
          bg: 'bg-gray-500/10',
          border: 'border-gray-500/20'
        };
    }
  };

  // Enhanced variants for smooth scroll animations
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.8
      }
    }
  };

  const fadeInUpVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const slideInVariants: Variants = {
    hidden: (custom: { x: number; y: number; scale: number; rotate: number }) => ({
      opacity: 0,
      x: custom.x,
      y: custom.y,
      scale: custom.scale,
      rotate: custom.rotate,
      filter: "blur(10px)"
    }),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const staggerContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const skillBarVariants: Variants = {
    hidden: { width: 0 },
    visible: (custom: number) => ({
      width: `${custom}%`,
      transition: {
        duration: 1.5,
        ease: "easeOut",
        delay: 0.3
      }
    })
  };

  const handleRealmClick = (realmId: string, isLocked: boolean) => {
    if (isLocked) {
      window.dispatchEvent(new CustomEvent('openTerminal'));
    } else {
      onRealmChange(realmId);
    }
  };

  return (
    <motion.section
      ref={containerRef}
      className="min-h-screen py-20 px-6 relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Enhanced Background with Parallax Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/20 to-blue-950/30" />
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_20%,rgba(120,119,198,0.15),transparent)]"
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.15, 0.2, 0.15]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_70%_90%,rgba(56,189,248,0.1),transparent)]"
        animate={{
          scale: [1.02, 1, 1.02],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Animated Avatar Orb with Enhanced Effects */}
        <motion.div 
          className="relative w-48 h-48 mx-auto mb-20"
          variants={fadeInUpVariants}
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.3 }
          }}
        >
          <div className="absolute inset-0">
            <motion.div 
              className="w-full h-full border-4 border-cyan-400/30 rounded-3xl"
              animate={{ 
                rotate: 360,
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.div 
              className="absolute inset-4 border-2 border-blue-400/40 rounded-2xl"
              animate={{ 
                rotate: -360,
                scale: [1, 1.01, 1]
              }}
              transition={{ 
                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
              }}
            />
            <motion.div 
              className="absolute inset-8 border border-cyan-300/50 rounded-xl"
              animate={{ 
                rotate: 360,
                scale: [1, 1.005, 1]
              }}
              transition={{ 
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }
              }}
            />
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="relative"
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <User className="w-16 h-16 text-cyan-400" />
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full" />
            </motion.div>
          </div>
          
          {/* Enhanced Binary Orbit */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-cyan-400 rounded-full font-mono text-xs flex items-center justify-center text-black font-bold shadow-lg"
              animate={{
                rotate: 360,
                scale: [1, 1.3, 1],
                x: Math.cos((i / 6) * Math.PI * 2) * 70,
                y: Math.sin((i / 6) * Math.PI * 2) * 70,
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            >
              {i % 2}
            </motion.div>
          ))}
        </motion.div>

        {/* Header Section with Staggered Animations */}
        <motion.div 
          className="text-center mb-24"
          variants={staggerContainerVariants}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
        >
          {/* Main Title */}
          <motion.h1 
            className="text-6xl md:text-8xl font-light mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-cyan-200 tracking-tighter"
            variants={fadeInUpVariants}
          >
            WHO AM I
          </motion.h1>

          {/* Personal Information */}
          <motion.div 
            className="mb-8"
            variants={fadeInUpVariants}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-4"
              variants={fadeInUpVariants}
            >
              {personalInfo.name}
            </motion.h1>
            <motion.div 
              className="text-2xl text-cyan-400 font-light mb-6"
              variants={fadeInUpVariants}
            >
              @{personalInfo.shortName}
            </motion.div>
            
            {/* Location & Education */}
            <motion.div 
              className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-6 text-gray-300"
              variants={staggerContainerVariants}
            >
              {[
                { icon: MapPin, text: personalInfo.location, color: "cyan" },
                { icon: GraduationCap, text: personalInfo.education, color: "purple" },
                { icon: Calendar, text: `Graduation ${personalInfo.graduation}`, color: "blue" }
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center gap-2"
                  variants={fadeInUpVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Social Links */}
            <motion.div 
              className="flex justify-center gap-4 mb-8"
              variants={staggerContainerVariants}
            >
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 backdrop-blur-sm ${social.color}`}
                    variants={fadeInUpVariants}
                    whileHover={{ 
                      scale: 1.2, 
                      rotate: [0, -10, 10, 0],
                      transition: { duration: 0.3 }
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <IconComponent className="w-6 h-6" />
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>

          {/* Welcome Badge */}
          <motion.div 
            className="inline-flex items-center px-6 py-3 bg-white/5 border border-white/10 rounded-2xl mb-8 backdrop-blur-sm"
            variants={fadeInUpVariants}
            whileHover={{ 
              scale: 1.05,
              y: -2,
              boxShadow: "0 10px 30px rgba(139, 92, 246, 0.3)"
            }}
          >
            <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
            <span className="text-gray-300 font-light text-sm tracking-wide">
              {personalInfo.status} • {personalInfo.degree}
            </span>
          </motion.div>
          
          {/* Poetic Introduction */}
          <motion.p 
            className="text-2xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed mb-12"
            variants={fadeInUpVariants}
          >
            Where <span className="text-cyan-400">binary precision</span> dances with{' '}
            <span className="text-purple-400">creative intuition</span>, I engineer digital experiences 
            that feel less like technology and more like magic made tangible.
          </motion.p>

          {/* Signature Metrics */}
          <motion.div 
            className="flex items-center justify-center space-x-16 mb-12"
            variants={staggerContainerVariants}
          >
            {[
              { value: '4+', label: 'Years of\nDigital Alchemy', color: 'cyan' },
              { value: '50+', label: 'Projects\nBrought to Life', color: 'purple' },
              { value: '12+', label: 'Technical\nDimensions', color: 'blue' }
            ].map((metric, index) => (
              <motion.div
                key={metric.color}
                className="text-center cursor-help"
                variants={fadeInUpVariants}
                whileHover={{ 
                  scale: 1.1, 
                  y: -5,
                  transition: { type: "spring", stiffness: 300 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`text-3xl text-${metric.color}-400 font-light mb-1`}>
                  {metric.value}
                </div>
                <div className={`w-12 h-0.5 bg-gradient-to-r from-${metric.color}-500 to-transparent mx-auto mb-2`}></div>
                <div className="text-gray-400 text-xs font-light whitespace-pre-line">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Introduction */}
          <motion.div 
            className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
            variants={fadeInUpVariants}
            whileHover={{ 
              y: -5,
              scale: 1.02,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)"
            }}
          >
            <div className="flex items-start space-x-4">
              <motion.div 
                className="p-3 bg-purple-500/10 rounded-xl"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <User className="w-6 h-6 text-purple-400" />
              </motion.div>
              <div className="text-left">
                <h3 className="text-xl text-white font-light mb-3">WHOAMI</h3>
                <p className="text-gray-300 font-light leading-relaxed">
                  A versatile developer passionate about creating innovative digital solutions. 
                  I specialize in full-stack development, cybersecurity, game development, and design. 
                  Each realm represents a different facet of my expertise and creative expression.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Realms Grid with Enhanced Scroll Animations */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-28"
          variants={staggerContainerVariants}
          initial="hidden"
          animate={realmsInView ? "visible" : "hidden"}
        >
          {updatedRealms.map((realm, index) => {
            const IconComponent = realm.icon;
            const colors = getColorClasses(realm.color);
            const isLocked = realm.locked;
            
            return (
              <motion.div
                key={realm.id}
                className={`group relative backdrop-blur-xl border rounded-3xl p-8 overflow-hidden ${
                  isLocked 
                    ? 'bg-red-500/5 border-red-500/20 cursor-pointer' 
                    : 'bg-white/5 border-white/10 cursor-pointer'
                }`}
                custom={realm.animation}
                variants={slideInVariants}
                whileHover={!isLocked ? { 
                  scale: 1.05, 
                  y: -10,
                  transition: { duration: 0.3 }
                } : { 
                  y: -5,
                  transition: { duration: 0.3 }
                }}
                onClick={() => handleRealmClick(realm.id, isLocked)}
              >
                {/* Lock Overlay */}
                {isLocked && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 z-10 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="text-center p-6">
                      <div className="relative mb-4">
                        <Lock className="w-12 h-12 text-red-400 mx-auto" />
                        <AlertTriangle className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2" />
                      </div>
                      <p className="text-red-300 text-sm mb-2">Realm Locked</p>
                      <p className="text-yellow-300 text-xs font-mono bg-yellow-500/10 px-3 py-1 rounded">
                        {realm.unlockHint}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Animated Background */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-10`}
                  whileHover={{ opacity: 0.1 }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Glow Effect */}
                <motion.div 
                  className={`absolute -inset-1 bg-gradient-to-r ${colors.gradient} rounded-3xl blur-lg opacity-0`}
                  whileHover={{ opacity: 0.2 }}
                  transition={{ duration: 0.5 }}
                />
                
                <div className="relative">
                  {/* Realm Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className={`p-4 rounded-2xl bg-gradient-to-br ${colors.gradient} shadow-lg ${
                          isLocked ? 'opacity-50' : ''
                        }`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <h3 className={`text-2xl font-light mb-1 ${
                          isLocked ? 'text-gray-400' : 'text-white'
                        }`}>
                          {realm.name}
                        </h3>
                        <span className={`${colors.light} font-light text-sm tracking-wide ${
                          isLocked ? 'opacity-60' : ''
                        }`}>
                          {realm.description}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-4 py-2 rounded-full text-sm font-light border ${
                        isLocked 
                          ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                          : `${colors.bg} ${colors.border} ${colors.light}`
                      }`}>
                        {realm.status}
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {realm.features.map((feature, featureIndex) => (
                      <motion.div 
                        key={feature} 
                        className={`flex items-center font-light ${
                          isLocked ? 'text-gray-500' : 'text-gray-300'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: featureIndex * 0.1 + 0.5 }}
                      >
                        <motion.div 
                          className={`w-1.5 h-1.5 rounded-full mr-4 ${
                            isLocked ? 'bg-gray-500' : colors.bg
                          }`}
                          animate={{ scale: [1, 1.5, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: featureIndex * 0.5 }}
                        />
                        {feature}
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    <span className={`${colors.light} font-light text-sm ${
                      isLocked ? 'opacity-50' : ''
                    }`}>
                      {isLocked ? 'Terminal access required' : 'Click to explore'}
                    </span>
                    <motion.div 
                      className={`flex items-center ${colors.light} font-light text-sm ${
                        isLocked ? 'opacity-50' : ''
                      }`}
                      whileHover={{ x: 5 }}
                    >
                      <span>{isLocked ? 'Locked' : 'Enter Realm'}</span>
                      {!isLocked && (
                        <ChevronRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                      )}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Skills Section with Enhanced Animations */}
        <motion.div 
          className={`bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10 mb-20`}
          variants={fadeInUpVariants}
          initial="hidden"
          animate={skillsInView ? "visible" : "hidden"}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.3 }
          }}
        >
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUpVariants}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Cpu className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-4xl font-light text-white mb-4">Technical Expertise</h3>
            <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto">
              Comprehensive skills across multiple domains of software development and digital creation
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainerVariants}
          >
            {skills.map((skill, index) => (
              <motion.div 
                key={skill.name} 
                className="space-y-4 group"
                variants={fadeInUpVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-light">{skill.name}</span>
                  <motion.span 
                    className="text-purple-400 font-light text-sm"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.2 + 0.5, type: "spring" }}
                  >
                    {skill.level}%
                  </motion.span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full relative"
                    variants={skillBarVariants}
                    custom={skill.level}
                    initial="hidden"
                    animate={skillsInView ? "visible" : "hidden"}
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: [-100, 100] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Call to Action with Enhanced Entrance */}
        <motion.div 
          className="text-center"
          variants={fadeInUpVariants}
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
        >
          <motion.div 
            className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-400/20 rounded-3xl p-12 mb-12"
            variants={fadeInUpVariants}
            whileHover={{ 
              y: -10,
              scale: 1.02,
              boxShadow: "0 25px 50px rgba(139, 92, 246, 0.3)"
            }}
          >
            <Globe className="w-16 h-16 text-purple-400 mx-auto mb-6" />
            <h3 className="text-3xl font-light text-white mb-4">Ready to Explore?</h3>
            <p className="text-gray-300 text-lg font-light max-w-2xl mx-auto mb-8">
              Dive into any of my specialized realms to discover detailed projects, 
              technical insights, and creative works in each domain.
            </p>
            <motion.button
              onClick={() => onRealmChange('dev')}
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-light text-lg rounded-2xl relative overflow-hidden"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(139, 92, 246, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-100, 100] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
              <Rocket className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
              START EXPLORING
            </motion.button>
          </motion.div>

          {/* Quick Navigation */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            variants={staggerContainerVariants}
          >
            {updatedRealms.map((realm, index) => {
              const colors = getColorClasses(realm.color);
              const isLocked = realm.locked;
              
              return (
                <motion.button
                  key={realm.id}
                  onClick={() => handleRealmClick(realm.id, isLocked)}
                  className={`px-6 py-3 rounded-xl font-light text-sm border backdrop-blur-sm ${
                    isLocked 
                      ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                      : `${colors.bg} ${colors.border} ${colors.light}`
                  }`}
                  variants={fadeInUpVariants}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -2,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {realm.name}
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};