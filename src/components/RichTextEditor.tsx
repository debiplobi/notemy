import { Link, RichTextEditor } from "@mantine/tiptap";
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconBold,
  IconClearFormatting,
  IconCode,
  IconHighlight,
  IconItalic,
  IconLink,
  IconLinkOff,
  IconSourceCode,
  IconStrikethrough,
  IconUnderline,
} from "@tabler/icons-react";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
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

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
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

export function RichTextEditorComp({ value, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
      Placeholder.configure({ placeholder: "Add a Content" }),
      Link,
      Highlight,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <RichTextEditor
      editor={editor}
      variant="subtle"
      styles={{
        root: {
          display: "flex",
          flexDirection: "column",
        },
        content: {
          flex: 1,
          maxHeight: "60vh",
          minHeight: "200px",
          overflowY: "auto",
          overscrollBehavior: "contain",
          "@media (min-width: 62em)": {
            maxHeight: "80vh",
          },
        },
      }}
    >
      <RichTextEditor.Toolbar sticky stickyOffset="var(--docs-header-height)">
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold icon={IconBold} />
          <RichTextEditor.Italic icon={IconItalic} />
          <RichTextEditor.Underline icon={IconUnderline} />
          <RichTextEditor.Strikethrough icon={IconStrikethrough} />
          <RichTextEditor.ClearFormatting icon={IconClearFormatting} />
          <RichTextEditor.Highlight icon={IconHighlight} />
          <RichTextEditor.Code icon={IconCode} />
          <RichTextEditor.CodeBlock icon={IconSourceCode} />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link icon={IconLink} />
          <RichTextEditor.Unlink icon={IconLinkOff} />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo icon={IconArrowBackUp} />
          <RichTextEditor.Redo icon={IconArrowForwardUp} />
        </RichTextEditor.ControlsGroup>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
