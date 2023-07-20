import {
  Node,
  ReactNodeViewRenderer,
  mergeAttributes,
  textblockTypeInputRule,
} from "@tiptap/react";
import { WebContainerEditor } from "./WebContainerEditor";

export const backtickInputRegex = /^```([a-z]+)?[\s\n]$/;

export const EditorBlock = Node.create({
  name: "editorBlock",
  content: "text*",
  code: true,
  group: "block",
  atom: true,

  addInputRules() {
    return [
      textblockTypeInputRule({
        find: backtickInputRegex,
        type: this.type,
      }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(WebContainerEditor);
  },

  parseHTML() {
    return [
      {
        tag: "editor-block",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["editor-block", mergeAttributes(HTMLAttributes)];
  },
});
