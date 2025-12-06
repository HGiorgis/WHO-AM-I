// components/Terminal.tsx - Fixed with proper icon rendering
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Terminal as TerminalIcon, Folder, 
  File, User, Cpu, Shield, Zap, Eye, Code, 
  Move, Maximize2, Minus, Unlock,
  GraduationCap, MapPin, Mail,
  HardDrive, Cpu as CpuIcon, MemoryStick,
  ArrowBigDown,
  ArrowRight
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface TerminalProps {
  isOpen: boolean;
  onToggle: () => void;
  onAccessCode: (code: string, realm: string) => void;
  currentRealm: string;
  onRealmChange: (realm: string) => void;
}

interface TerminalPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface HistoryItem {
  type: 'command' | 'output' | 'error' | 'system';
  content: string | React.ReactNode;
}

export const Terminal: React.FC<TerminalProps> = ({ 
  isOpen, 
  onToggle, 
  onAccessCode,
  currentRealm,
  onRealmChange
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState<TerminalPosition>({
    x: window.innerWidth / 4,
    y: window.innerHeight / 4,
    width: 600,
    height: 400
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);

  const currentPath = `~/${currentRealm}`;

  // Icon components for rendering
  const IconWrapper = ({ icon: Icon, className = "" }: { icon: React.ComponentType<any>, className?: string }) => (
    <Icon className={`w-3 h-3 inline mr-1 ${className}`} />
  );

  const realmIcons = {
    home: <User className="w-3 h-3 inline mr-1" />,
    cyber: <Shield className="w-3 h-3 inline mr-1" />,
    dev: <Code className="w-3 h-3 inline mr-1" />,
    design: <Eye className="w-3 h-3 inline mr-1" />,
    game: <Zap className="w-3 h-3 inline mr-1" />
  };

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setHistory([
        { type: 'system', content: 'Welcome to HGiorgis Terminal v2.1.0' },
        { type: 'system', content: 'Type "help" for available commands' },
        { type: 'system', content: 'Website: hgiorgis.pro.et' },
        { type: 'system', content: '' }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Dragging functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition(prev => ({
          ...prev,
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y
        }));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Resizing functionality
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        setPosition(prev => ({
          ...prev,
          width: Math.max(400, e.clientX - prev.x),
          height: Math.max(300, e.clientY - prev.y)
        }));
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const startDragging = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const startResizing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  const toggleMaximize = () => {
    if (isMaximized) {
      setPosition({
        x: window.innerWidth / 4,
        y: window.innerHeight / 4,
        width: 600,
        height: 400
      });
    } else {
      setPosition({
        x: 50,
        y: 50,
        width: window.innerWidth - 100,
        height: window.innerHeight - 100
      });
    }
    setIsMaximized(!isMaximized);
  };

  const addToHistory = (type: 'command' | 'output' | 'error' | 'system', content: string | React.ReactNode) => {
    setHistory(prev => [...prev, { type, content }]);
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    // Add to command history
    setCommandHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    // Show command in terminal
    addToHistory('command', `${currentPath} $ ${trimmedCmd}`);

    const [command, ...args] = trimmedCmd.split(' ');

    switch (command) {
      case 'ls':
        addToHistory('output', (
          <div>
            <div>
              <IconWrapper icon={Folder} /> home/    <IconWrapper icon={Folder} /> project/    <IconWrapper icon={Folder} /> blog/    <IconWrapper icon={Folder} /> contact/
            </div>
            <div>
              <IconWrapper icon={File} /> cyber  <IconWrapper icon={File} /> dev <IconWrapper icon={File} /> game  <IconWrapper icon={File} />  design 
            </div>
            <div>
               <IconWrapper icon={Cpu} /> hgiorgis.pro.et
            </div>
          </div>
        ));
        break;

      case 'pwd':
        addToHistory('output', currentPath);
        break;

      case 'cd':
        if (args[0] === 'project' || args[0] === '/project') {
          <NavLink to={"/project"}/>
          addToHistory('output', 'Navigating to project page...');
        } else if (args[0] === 'cyber' || args[0] === '/cyber') {
          onRealmChange('cyber');
          addToHistory('output', <span>{realmIcons.cyber} Navigating to Cyber Realm...</span>);
        } else if (args[0] === 'dev' || args[0] === '/dev') {
          onRealmChange('dev');
          addToHistory('output', <span>{realmIcons.dev} Navigating to Dev Realm...</span>);
        } else if (args[0] === 'design' || args[0] === '/design') {
          onRealmChange('design');
          addToHistory('output', <span>{realmIcons.design} Navigating to Design Vault...</span>);
        } else if (args[0] === 'game' || args[0] === '/game') {
          onRealmChange('game');
          addToHistory('output', <span>{realmIcons.game} Navigating to Game Sanctum...</span>);
        } else if (args[0] === 'home' || args[0] === '/home' || args[0] === 'hgiorgis.pro.et' || args[0] === 'hgiorgis') {
          onRealmChange('home');
          addToHistory('output', <span>{realmIcons.home} Navigating to Home Page...</span>);
        } else if (args[0] === '..' || args[0] === '../') {
          onRealmChange('home');
          addToHistory('output', '↩️  Returning to home directory...');
        } else if (!args[0] || args[0] === '~') {
          onRealmChange('home');
          addToHistory('output', <span>{realmIcons.home} Returning to home directory...</span>);
        } else {
          addToHistory('error', `cd: no such directory: ${args[0]}`);
        }
        break;

      case 'whoami':
        addToHistory('output', (
          <div>
            <div> Whoami (Redirected) <IconWrapper icon={ArrowRight} /> Whoareyou </div>
            <div><IconWrapper icon={User} /> Hailegiorgis Wagaye (HGiorgis)</div>
            <div><IconWrapper icon={Code} /> Software Engineering Student</div>
            <div><IconWrapper icon={GraduationCap} /> Adama Science & Technology University</div>
            <div><IconWrapper icon={MapPin} /> Addis Ababa, Ethiopia</div>
            <div><IconWrapper icon={Mail} /> hailegiorgiswagaye@gmail.com</div>
          </div>
        ));
        break;

      case 'unlock':
        if (args[0] === 'design' && args[1]) {
          onAccessCode(args[1], 'design');
          addToHistory('output', <span>{realmIcons.design} <IconWrapper icon={Unlock} /> Attempting to unlock Design Vault...</span>);
        } else if (args[0] === 'game' && args[1]) {
          onAccessCode(args[1], 'game');
          addToHistory('output', <span>{realmIcons.game} <IconWrapper icon={Unlock} /> Attempting to unlock Game Sanctum...</span>);
        } else {
          addToHistory('error', 'Usage: unlock <realm> <code>');
        }
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'help':
        addToHistory('output', (
          <div>
            <div>📋 Available Commands:</div>
            <div>  ls, dir         - List directory contents</div>
            <div>  cd &lt;dir&gt;      - Change directory</div>
            <div>  pwd             - Print working directory</div>
            <div>  whoami          - Show user information</div>
            <div>  unlock &lt;r&gt; &lt;c&gt;  - Unlock restricted realms</div>
            <div>  clear, cls      - Clear terminal</div>
            <div>  help, ?         - Show this help</div>
            <div>  date, time      - Show current date/time</div>
            <div>  echo &lt;text&gt;     - Display text</div>
            <div>  banner          - Show ASCII banner</div>
            <div>  neofetch        - System information</div>
            <div>  history         - Command history</div>
            <div>  projects        - Show featured projects</div>
            <div>  skills          - Display technical skills</div>
            <div>  contact         - Contact information</div>
            <div>  ping            - Test connection</div>
            <div>  exit, quit      - Close terminal</div>
          </div>
        ));
        break;

      case 'date':
      case 'time':
        addToHistory('output', new Date().toLocaleString());
        break;

      case 'echo':
        addToHistory('output', args.join(' '));
        break;

      case 'banner':
        addToHistory('output', (
          <div className="text-cyan-300">
            <div>╔══════════════════════════════════════╗</div>
            <div>║          HGIORGIS.PRO.ET             ║</div>
            <div>║    Digital Architect & Innovator     ║</div>
            <div>║   "Code with Purpose, Build with"    ║</div>
            <div>║             Passion"                 ║</div>
            <div>╚══════════════════════════════════════╝</div>
          </div>
        ));
        break;

      case 'neofetch':
        addToHistory('output', (
          <div className="text-green-300">
            <div>               .-.</div>
            <div>              | {realmIcons.home} |</div>
            <div>              '---'</div>
            <div>        ----------------</div>
            <div>        OS: HGiorgis Portfolio v3.0</div>
            <div>        Host: hgiorgis.pro.et</div>
            <div>        Kernel: React 18.2.0</div>
            <div>        Shell: zsh 5.9</div>
            <div>        DE: Cyber Realm</div>
            <div>        WM: Framer Motion</div>
            <div>        CPU: <IconWrapper icon={CpuIcon} /> Intel i7 @ 3.2GHz</div>
            <div>        Memory: <IconWrapper icon={MemoryStick} /> 16GB DDR4</div>
            <div>        Disk: <IconWrapper icon={HardDrive} /> 512GB SSD</div>
          </div>
        ));
        break;

      case 'history':
        addToHistory('output', (
          <div>
            {commandHistory.slice(-15).map((cmd, i) => (
              <div key={i}>
                {commandHistory.length - 15 + i}  {cmd}
              </div>
            ))}
          </div>
        ));
        break;

      case 'projects':
        addToHistory('output', (
          <div>
            <div>🚀 Featured Projects:</div>
            <div>  • Sankrypt - Password Manager <span className="text-green-400">[Production]</span></div>
            <div>  • Aesop Meredaja - Investment Platform <span className="text-green-400">[Live]</span></div>
            <div>  • Portfolio OS - Developer Platform <span className="text-yellow-400">[Active]</span></div>
            <div>  • SecureChat - Encrypted Messaging <span className="text-blue-400">[Development]</span></div>
            <div>Use 'cd dev' to see more projects</div>
          </div>
        ));
        break;

      case 'skills':
        addToHistory('output', (
          <div>
            <div>💻 Technical Skills:</div>
            <div>  Frontend: React, Next.js, TypeScript, Tailwind</div>
            <div>  Backend: Node.js, Laravel, PostgreSQL, MySQL</div>
            <div>  Mobile: React Native, Flutter</div>
            <div>  DevOps: Docker, AWS, CI/CD</div>
            <div>  Cybersecurity: Penetration Testing, Cryptography</div>
            <div>  Game Dev: Unity, C#, 3D Modeling</div>
          </div>
        ));
        break;

      case 'contact':
        addToHistory('output', (
          <div>
            <div>📞 Contact Information:</div>
            <div>  Email: hailegiorgiswagaye@gmail.com</div>
            <div>  GitHub: github.com/HGiorgis</div>
            <div>  Telegram: @hgiorgis</div>
            <div>  Location: Addis Ababa, Ethiopia</div>
            <div>  University: Adama Science & Technology University</div>
          </div>
        ));
        break;

      case 'ping':
        addToHistory('output', 'PING hgiorgis.pro.et (192.168.1.1): 56 data bytes');
        addToHistory('output', '64 bytes from 192.168.1.1: icmp_seq=0 ttl=64 time=1.123 ms');
        addToHistory('output', '64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=0.987 ms');
        addToHistory('output', '--- hgiorgis.pro.et ping statistics ---');
        addToHistory('output', '2 packets transmitted, 2 packets received, 0.0% packet loss');
        break;

      case 'cls':
      case 'clear':
        setHistory([]);
        break;

      case 'dir':
        executeCommand('ls');
        break;

      case '?':
        executeCommand('help');
        break;

      case 'quit':
      case 'exit':
        onToggle();
        break;

      case 'sudo':
        addToHistory('error', <span>{realmIcons.cyber} Permission denied: User not in sudoers file</span>);
        break;

      default:
        addToHistory('error', `Command not found: ${command}`);
        addToHistory('output', '💡 Type "help" for available commands');
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const commands = ['ls', 'cd', 'pwd', 'whoami', 'clear', 'help', 'exit', 'projects', 'skills', 'contact', 'neofetch'];
      const matching = commands.filter(cmd => cmd.startsWith(input));
      if (matching.length === 1) {
        setInput(matching[0] + ' ');
      }
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      executeCommand('clear');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed top-6 right-6 z-50 bg-cyan-600/80 hover:bg-cyan-500/90 text-white p-3 rounded-xl font-mono text-sm border border-cyan-400/50 backdrop-blur-sm transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-cyan-500/20"
      >
        <TerminalIcon className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div 
      className="fixed z-50 font-mono text-sm overflow-hidden shadow-2xl shadow-cyan-500/10 bg-black/95 backdrop-blur-md border border-cyan-500/30 rounded-lg"
      style={{
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height
      }}
    >
      {/* Terminal Header - Draggable Area */}
      <div 
        ref={dragHandleRef}
        className="flex justify-between items-center p-3 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-b border-cyan-500/20 cursor-move select-none"
        onMouseDown={startDragging}
      >
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 cursor-pointer" onClick={onToggle} />
            <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 cursor-pointer" onClick={toggleMaximize} />
            <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 cursor-pointer" />
          </div>
          <span className="text-cyan-300 text-xs flex items-center">
            <Move className="w-3 h-3 mr-1 opacity-50" />
            terminal@hgiorgis:~{currentRealm}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={toggleMaximize} className="text-cyan-400 hover:text-white transition-colors">
            {isMaximized ? <Minus className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button onClick={onToggle} className="text-cyan-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="p-4 h-[calc(100%-80px)] overflow-y-auto terminal-scrollbar"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((item, i) => (
          <div 
            key={i} 
            className={`mb-1 leading-relaxed ${
              item.type === 'command' ? 'text-cyan-300' : 
              item.type === 'error' ? 'text-red-400' : 
              item.type === 'system' ? 'text-blue-400' :
              'text-green-300'
            }`}
          >
            {item.content}
          </div>
        ))}
        
        {/* Input Line */}
        <div className="flex items-center mt-2">
          <span className="text-purple-400 mr-1">┌──(</span>
          <span className="text-cyan-400">hgiorgis</span>
          <span className="text-purple-400">㉿</span>
          <span className="text-green-400">hgiorgis.pro.et</span>
          <span className="text-purple-400">)-[</span>
          <span className="text-yellow-400">{currentPath}</span>
          <span className="text-purple-400">]</span>
          <br />
          <span className="text-purple-400 mr-2">└─</span>
          <span className="text-red-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-cyan-200 ml-2 caret-cyan-400 terminal-input"
            placeholder="Type a command..."
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>

      {/* Terminal Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/80 border-t border-cyan-500/20 text-xs text-cyan-400/70 flex justify-between items-center">
        <span className="flex items-center">
          <TerminalIcon className="w-3 h-3 mr-1" />
          HGiorgis Terminal v2.1.0
        </span>
        <span className="flex items-center space-x-4">
          <span>↑↓ History</span>
          <span>Tab Complete</span>
          <span>Ctrl+L Clear</span>
        </span>
      </div>

      {/* Resize Handle */}
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-cyan-500/20 hover:bg-cyan-500/40 transition-colors"
        onMouseDown={startResizing}
      >
        <div className="w-full h-full border-r-2 border-b-2 border-cyan-400/50 rounded-br-lg" />
      </div>
    </div>
  );
};