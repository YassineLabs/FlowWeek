"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { TaskTag } from "@/lib/types";

interface InlineTaskEditorProps {
  onAdd: (title: string, notes?: string, tag?: TaskTag) => void;
  placeholder?: string;
}

export function InlineTaskEditor({
  onAdd,
  placeholder = "Type a task and press Enter...",
}: InlineTaskEditorProps) {
  const [lines, setLines] = useState<string[]>([""]);
  const [focusedLine, setFocusedLine] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus the input when component mounts or new line is added
  useEffect(() => {
    if (focusedLine !== null && inputRefs.current[focusedLine]) {
      inputRefs.current[focusedLine]?.focus();
    }
  }, [focusedLine, lines.length]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    const currentValue = lines[index];

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      // If current line has content, save it as a task
      if (currentValue.trim()) {
        // Parse for tags (e.g., #work or #personal)
        let tag: TaskTag | undefined;
        let title = currentValue.trim();

        if (title.includes("#work")) {
          tag = "work";
          title = title.replace(/#work/gi, "").trim();
        } else if (title.includes("#personal")) {
          tag = "personal";
          title = title.replace(/#personal/gi, "").trim();
        }

        // Add the task
        onAdd(title, undefined, tag);

        // Clear this line and keep cursor here
        const newLines = [...lines];
        newLines[index] = "";
        setLines(newLines);
      }
    } else if (e.key === "Backspace" && currentValue === "" && index > 0) {
      // Remove empty line and go to previous
      e.preventDefault();
      const newLines = lines.filter((_, i) => i !== index);
      setLines(newLines.length > 0 ? newLines : [""]);
      setFocusedLine(index - 1);
    } else if (e.key === "ArrowUp" && index > 0) {
      e.preventDefault();
      setFocusedLine(index - 1);
    } else if (e.key === "ArrowDown" && index < lines.length - 1) {
      e.preventDefault();
      setFocusedLine(index + 1);
    }
  };

  const handleChange = (value: string, index: number) => {
    const newLines = [...lines];
    newLines[index] = value;
    setLines(newLines);
  };

  const handleFocus = (index: number) => {
    setFocusedLine(index);
    // If focusing on the last line and it's not empty, add a new line
    if (index === lines.length - 1 && lines[index] !== "") {
      setLines([...lines, ""]);
    }
  };

  const handleContainerClick = () => {
    // Focus the last input when clicking on the container
    const lastIndex = lines.length - 1;
    setFocusedLine(lastIndex);
    inputRefs.current[lastIndex]?.focus();
  };

  return (
    <div
      ref={containerRef}
      className="inline-task-editor"
      onClick={handleContainerClick}
    >
      {lines.map((line, index) => (
        <div key={index} className="inline-task-line">
          <span className="line-bullet">•</span>
          <input
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            className="inline-task-input"
            value={line}
            placeholder={index === 0 && line === "" ? placeholder : ""}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={() => handleFocus(index)}
          />
        </div>
      ))}
    </div>
  );
}
