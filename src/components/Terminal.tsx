// components/DevTerminal.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Terminal as TerminalIcon,
  Folder,
  File,
  User,
  Code,
  GraduationCap,
  MapPin,
  Mail,
  Cpu as CpuIcon,
  MemoryStick,
  HardDrive,
  ArrowRight,
  Move,
  Maximize2,
  Minus,
} from "lucide-react";
import { NavLink } from "react-router-dom";

interface DevTerminalProps {
  isOpen: boolean;
  onToggle: () => void;
  onRealmChange: (realm: string) => void;
}

interface TerminalPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface HistoryItem {
  type: "command" | "output" | "error" | "system";
  content: string | React.ReactNode;
}

export const Terminal: React.FC<DevTerminalProps> = ({
  isOpen,
  onToggle,
  onRealmChange,
}) => {
  const [input, setInput] = useState("");
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
    height: 400,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const currentPath = `~/dev`;

  // Icon wrapper for commands
  const IconWrapper = ({
    icon: Icon,
    className = "",
  }: {
    icon: React.ComponentType<any>;
    className?: string;
  }) => <Icon className={`w-3 h-3 inline mr-1 ${className}`} />;

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setHistory([
        { type: "system", content: "Welcome to Dev Realm Terminal v1.0.0" },
        { type: "system", content: 'Type "help" to see available commands' },
        { type: "system", content: "" },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // Dragging and resizing logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition((prev) => ({
          ...prev,
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        }));
      } else if (isResizing) {
        setPosition((prev) => ({
          ...prev,
          width: Math.max(400, e.clientX - prev.x),
          height: Math.max(300, e.clientY - prev.y),
        }));
      }
    };
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset]);

  const startDragging = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
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
        height: 400,
      });
    } else {
      setPosition({
        x: 50,
        y: 50,
        width: window.innerWidth - 100,
        height: window.innerHeight - 100,
      });
    }
    setIsMaximized(!isMaximized);
  };

  const addToHistory = (
    type: "command" | "output" | "error" | "system",
    content: string | React.ReactNode
  ) => {
    setHistory((prev) => [...prev, { type, content }]);
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setCommandHistory((prev) => [...prev, trimmedCmd]);
    setHistoryIndex(-1);
    addToHistory("command", `${currentPath} $ ${trimmedCmd}`);

    const [command, ...args] = trimmedCmd.split(" ");

    switch (command) {
      case "ls":
      case "dir":
        addToHistory(
          "output",
          <div>
            <div>
              <IconWrapper icon={Folder} /> blog/ <IconWrapper icon={Folder} />{" "}
              contact/ <IconWrapper icon={Folder} /> projects/{" "}
              <IconWrapper icon={Folder} /> skills/
            </div>
          </div>
        );
        break;
      case "pwd":
        addToHistory("output", currentPath);
        break;
      case "cd":
        if (args[0] === "blog") {
          onRealmChange("blog");
          addToHistory("output", "📄 Navigating to Blog...");
        } else if (args[0] === "contact") {
          onRealmChange("contact");
          addToHistory("output", "📧 Navigating to Contact...");
        } else {
          addToHistory("error", `cd: no such directory: ${args[0]}`);
        }
        break;
      case "whoami":
        addToHistory(
          "output",
          <div>
            <div>
              <IconWrapper icon={User} /> Hailegiorgis Wagaye (HGiorgis)
            </div>
            <div>
              <IconWrapper icon={Code} /> Security-Driven Web Developer
            </div>
            <div>
              <IconWrapper icon={GraduationCap} /> Adama Science & Technology
              University
            </div>
            <div>
              <IconWrapper icon={MapPin} /> Addis Ababa, Ethiopia
            </div>
            <div>
              <IconWrapper icon={Mail} /> hailegiorgiswagaye@gmail.com
            </div>
          </div>
        );
        break;
      case "projects":
        addToHistory(
          "output",
          <div>
            <div>🚀 Featured Projects:</div>
            <div>• Sankrypt - Password Manager [Live]</div>
            <div>
              • Aesop Meredaja - Investment Connect Platform [Production]
            </div>
            <div>• Alkore - Productivity Platform [Active]</div>
            <div>• KDpolutry Farm - Report Manage system [Live]</div>
            <div>• Sankrypt Firefox Extension [Experimental]</div>
          </div>
        );
        break;
      case "skills":
        addToHistory(
          "output",
          <div>
            <div>💻 Technical Skills:</div>
            <div>Frontend: React, Next.js(learning), TypeScript, Tailwind</div>
            <div>Backend: Express.js, Laravel, PostgreSQL, MySQL</div>
            <div>DevOps: Docker, CI/CD, Render Deploy, Cpanel Deploy</div>
            <div>Security: Cryptography</div>
          </div>
        );
        break;
      case "clear":
      case "cls":
        setHistory([]);
        break;
      case "help":
      case "?":
        addToHistory(
          "output",
          <div>
            <div>📋 Available Commands:</div>
            <div>ls, dir - List folders</div>
            <div>cd &lt;dir&gt; - Navigate to folder (blog, contact)</div>
            <div>pwd - Show current path</div>
            <div>whoami - Show user info</div>
            <div>projects - List featured projects</div>
            <div>skills - Show technical skills</div>
            <div>clear, cls - Clear terminal</div>
            <div>help, ? - Show commands</div>
            <div>exit, quit - Close terminal</div>
          </div>
        );
        break;
      case "exit":
      case "quit":
        onToggle();
        break;
      default:
        addToHistory("error", `Command not found: ${command}`);
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex < commandHistory.length - 1
            ? historyIndex + 1
            : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const commands = [
        "ls",
        "dir",
        "cd",
        "pwd",
        "whoami",
        "projects",
        "skills",
        "clear",
        "cls",
        "help",
        "?",
        "exit",
        "quit",
      ];
      const matching = commands.filter((c) => c.startsWith(input));
      if (matching.length === 1) setInput(matching[0] + " ");
    }
  };

  if (!isOpen)
    return (
      <button
        onClick={onToggle}
        className="fixed top-6 right-6 z-50 bg-cyan-600/80 hover:bg-cyan-500/90 text-white p-3 rounded-xl font-mono text-sm border border-cyan-400/50 backdrop-blur-sm transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-cyan-500/20"
      >
        <TerminalIcon className="w-5 h-5" />
      </button>
    );

  return (
    <div
      className="fixed z-50 font-mono text-sm overflow-hidden shadow-2xl shadow-cyan-500/10 bg-black/95 backdrop-blur-md border border-cyan-500/30 rounded-lg"
      style={{
        left: position.x,
        top: position.y,
        width: position.width,
        height: position.height,
      }}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center p-3 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border-b border-cyan-500/20 cursor-move select-none"
        onMouseDown={startDragging}
      >
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 cursor-pointer"
              onClick={onToggle}
            />
            <div
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 cursor-pointer"
              onClick={toggleMaximize}
            />
            <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 cursor-pointer" />
          </div>
          <span className="text-cyan-300 text-xs flex items-center">
            <Move className="w-3 h-3 mr-1 opacity-50" /> terminal@dev
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMaximize}
            className="text-cyan-400 hover:text-white transition-colors"
          >
            {isMaximized ? (
              <Minus className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={onToggle}
            className="text-cyan-400 hover:text-white transition-colors"
          >
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
              item.type === "command"
                ? "text-cyan-300"
                : item.type === "error"
                ? "text-red-400"
                : item.type === "system"
                ? "text-blue-400"
                : "text-green-300"
            }`}
          >
            {item.content}
          </div>
        ))}
        <div className="flex items-center mt-2">
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

      {/* Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/80 border-t border-cyan-500/20 text-xs text-cyan-400/70 flex justify-between items-center">
        <span className="flex items-center">
          <TerminalIcon className="w-3 h-3 mr-1" /> Dev Terminal v1.0
        </span>
        <span className="flex items-center space-x-4">
          ↑↓ History • Tab Complete • Ctrl+L Clear
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
