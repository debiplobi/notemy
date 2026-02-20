"use client";

import { Link, RichTextEditor } from "@mantine/tiptap";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import { ReactNodeViewRenderer, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import go from "highlight.js/lib/languages/go";
import js from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import ts from "highlight.js/lib/languages/typescript";
import { createLowlight } from "lowlight";
import { CodeBlockComponent } from "./CodeBlockComponent";
import { truncateText } from "./NotesList";

interface RichTextEditorPreviewProps {
  value: string;
  maxChars: number;
}

const lowlight = createLowlight();

lowlight.register({
  ts,
  js,
  rust,
  python,
  go,
  c,
  bash,
  cpp,
  json,
  markdown,
});

export function RichTextEditorPreview({
  value,
  maxChars,
}: RichTextEditorPreviewProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
      Link,
      Highlight,
    ],
    content: truncateText(value, maxChars),
    editable: false,
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <RichTextEditor
      editor={editor}
      variant="subtle"
      styles={{
        root: { border: "none" },
        content: {
          padding: 0,
          overflow: "hidden",
        },
      }}
    >
      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
