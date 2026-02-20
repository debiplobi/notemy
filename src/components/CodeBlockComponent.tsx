import { ActionIcon, CopyButton, Tooltip } from "@mantine/core";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import type { NodeViewProps } from "@tiptap/react";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

export function CodeBlockComponent({ node }: NodeViewProps) {
  return (
    <NodeViewWrapper
      className="code-block-wrapper"
      style={{ position: "relative" }}
    >
      <pre>
        <code>
          <NodeViewContent />
        </code>
      </pre>

      <div
        style={{
          position: "absolute",
          top: "0.5rem",
          right: "0.5rem",
          zIndex: 10,
        }}
      >
        <CopyButton value={node.textContent} timeout={2000}>
          {({ copied, copy }) => (
            <Tooltip
              label={copied ? "Copied" : "Copy code"}
              withArrow
              position="right"
            >
              <ActionIcon
                color={copied ? "teal" : "gray"}
                variant="subtle"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  copy();
                }}
                aria-label="Copy code"
              >
                {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </div>
    </NodeViewWrapper>
  );
}
