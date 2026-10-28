"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import styles from "./hero.module.css";

export type TerminalPage = {
  id: number;
  title: string;
  slug: string;
  content: string;
};

type EntryType = "input" | "output" | "success" | "error";

type TerminalEntry = {
  id: number;
  type: EntryType;
  text: string;
};

type PortfolioTerminalProps = {
  pages: TerminalPage[];
};

const initialEntries: TerminalEntry[] = [
  { id: 1, type: "success", text: "Portfolio OS v1.0 — prêt" },
  { id: 2, type: "output", text: "Tape `help` pour afficher les commandes." },
];

export function PortfolioTerminal({ pages }: PortfolioTerminalProps) {
  const [entries, setEntries] = useState<TerminalEntry[]>(initialEntries);
  const [command, setCommand] = useState("");
  const [currentDirectory, setCurrentDirectory] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showRickroll, setShowRickroll] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const entryId = useRef(3);
  const rickrollTimer = useRef<number | null>(null);

  const prompt = currentDirectory ? `~/portfolio/${currentDirectory}` : "~/portfolio";

  useEffect(() => {
    const terminalBody = bodyRef.current;
    if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
  }, [entries]);

  useEffect(() => {
    return () => {
      if (rickrollTimer.current) window.clearTimeout(rickrollTimer.current);
    };
  }, []);

  function addEntry(type: EntryType, text: string) {
    setEntries((current) => [
      ...current,
      { id: entryId.current++, type, text },
    ]);
  }

  function findPage(slug: string) {
    return pages.find((page) => page.slug.toLowerCase() === slug.toLowerCase());
  }

  function showTree() {
    const pageTree = pages
      .map(
        (page, index) =>
          `${index === pages.length - 1 ? "└──" : "├──"} ${page.slug}/\n${
            index === pages.length - 1 ? "    " : "│   "
          }└── content.txt`,
      )
      .join("\n");

    addEntry("output", `portfolio/\n├── README.md\n${pageTree}`);
  }

  function readFile(target: string) {
    const normalizedTarget = target.replace(/^\.\//, "");

    if (!currentDirectory && normalizedTarget.toLowerCase() === "readme.md") {
      addEntry("output", "Edouard Mouret\nDéveloppeur FullStack");
      return;
    }

    if (currentDirectory && normalizedTarget.toLowerCase() === "content.txt") {
      const page = findPage(currentDirectory);
      addEntry(
        page ? "output" : "error",
        page ? `${page.title}\n${page.content}` : "Fichier introuvable.",
      );
      return;
    }

    const [slug, file] = normalizedTarget.split("/");
    const page = findPage(slug);

    if (page && file?.toLowerCase() === "content.txt") {
      addEntry("output", `${page.title}\n${page.content}`);
      return;
    }

    addEntry("error", `cat: ${target || "fichier"}: fichier introuvable`);
  }

  function startRickroll() {
    setShowRickroll(true);
    addEntry("success", "♪ Never gonna give you up…");

    if (rickrollTimer.current) window.clearTimeout(rickrollTimer.current);
    rickrollTimer.current = window.setTimeout(() => setShowRickroll(false), 6500);
  }

  function executeCommand(rawCommand: string) {
    const trimmedCommand = rawCommand.trim();
    if (!trimmedCommand) return;

    const [name, ...args] = trimmedCommand.split(/\s+/);
    const normalizedName = name.toLowerCase();
    const normalizedCommand = trimmedCommand.toLowerCase();

    addEntry("input", `edouard@portfolio:${prompt}$ ${trimmedCommand}`);

    if (normalizedCommand === "rickroll run" || normalizedCommand === "run rickroll") {
      startRickroll();
      return;
    }

    switch (normalizedName) {
      case "help":
        addEntry(
          "output",
          "help  ls  cd  pwd  tree  cat  whoami  clear\nAstuce : quelques commandes ne sont pas documentées.",
        );
        break;

      case "ls":
        addEntry(
          "output",
          currentDirectory
            ? "content.txt"
            : ["README.md", ...pages.map((page) => `${page.slug}/`)].join("  "),
        );
        break;

      case "pwd":
        addEntry("output", `/home/edouard/portfolio${currentDirectory ? `/${currentDirectory}` : ""}`);
        break;

      case "tree":
        showTree();
        break;

      case "cd": {
        const destination = args[0];

        if (!destination || ["~", "/", "..", "/portfolio"].includes(destination)) {
          setCurrentDirectory(null);
          break;
        }

        const page = findPage(destination.replace(/\/$/, ""));
        if (page) setCurrentDirectory(page.slug);
        else addEntry("error", `cd: ${destination}: dossier introuvable`);
        break;
      }

      case "cat":
        readFile(args.join(" "));
        break;

      case "whoami":
        addEntry("output", "Edouard Mouret — Développeur FullStack");
        break;

      case "clear":
        setEntries([]);
        break;

      case "sudo":
        addEntry("error", "Permission refusée. Beau réflexe quand même.");
        break;

      case "coffee":
        addEntry("output", "( (\n ) )\n........\n|      |]\n\\      /\n `----'  Café compilé avec succès.");
        break;

      case "rm":
        addEntry("error", "Opération bloquée : ce portfolio tient à la vie.");
        break;

      default:
        addEntry("error", `${name}: commande introuvable. Essaie help.`);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!command.trim()) return;

    executeCommand(command);
    setHistory((current) => [...current, command]);
    setHistoryIndex(-1);
    setCommand("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp" && history.length > 0) {
      event.preventDefault();
      const nextIndex =
        historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setCommand(history[nextIndex]);
    }

    if (event.key === "ArrowDown" && historyIndex >= 0) {
      event.preventDefault();
      const nextIndex = historyIndex + 1;

      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setCommand("");
      } else {
        setHistoryIndex(nextIndex);
        setCommand(history[nextIndex]);
      }
    }
  }

  return (
    <div className={styles.terminal}>
      <div className={styles.terminalBar}>
        <span />
        <span />
        <span />
        <small>edouard@portfolio:{prompt}</small>
      </div>

      <div className={styles.terminalBody} ref={bodyRef}>
        {entries.map((entry) => (
          <p className={styles[entry.type]} key={entry.id}>
            {entry.text}
          </p>
        ))}

        <form className={styles.terminalForm} onSubmit={handleSubmit}>
          <label className={styles.srOnly} htmlFor="terminal-command">
            Commande du terminal
          </label>
          <span className={styles.prompt}>edouard@portfolio:{prompt}$</span>
          <input
            id="terminal-command"
            ref={inputRef}
            value={command}
            onChange={(event) => setCommand(event.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
            aria-label="Saisir une commande"
          />
        </form>
      </div>

      {showRickroll && (
        <div className={styles.rickroll} role="img" aria-label="Rick Astley danse">
          <span>Never gonna give you up ♪</span>
        </div>
      )}
    </div>
  );
}
