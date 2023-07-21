"use client";

import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { Blockquote } from "@tiptap/extension-blockquote";
import { Code } from "@tiptap/extension-code";
import { Color } from "@tiptap/extension-color";
import { Document } from "@tiptap/extension-document";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import {
  ListBullets,
  Quotes,
  TextBolder,
  TextItalic,
  TextStrikethrough,
} from "phosphor-react";
import BubbleButton from "./BubbleButton";
import { EditorBlock } from "./EditorBlock";
import { TrailingNode } from "./TrailingNode";
export function Editor() {
  const editor = useEditor({
    extensions: [
      Document.extend({
        content: "heading block*",
      }),
      StarterKit.configure({
        codeBlock: false,
        document: false,
      }),
      Code.configure({
        HTMLAttributes: {},
      }),
      Blockquote.configure({
        HTMLAttributes: {},
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
      }),
      Color.configure({
        types: ["textStyle"],
      }),
      Link.configure({
        HTMLAttributes: {
          class: "text-orange-500 hover:text-orange-600 hover:cursor-pointer",
        },
      }),
      TextStyle,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "Untitled";
          }

          if (node.type.name === "editorBlock") {
            return "";
          }
          return "Start writing...";
        },
      }),
      EditorBlock,
      TrailingNode,
    ],
    content: ``,
    editorProps: {
      attributes: {
        class: "outline-none",
      },
    },
  });

  return (
    <>
      <EditorContent
        className="overflow-y-auto mx-auto py-16 prose prose-invert prose-violet"
        editor={editor}
      />
      {/* {editor && (
        <FloatingMenu
          className="bg-zinc-700 shadow-xl border border-zinc-600 shadow-black/20 rounded-lg overflow-hidden flex flex-col gap-1 py-2 px-1"
          editor={editor}
          shouldShow={({ state }) => {
            const { $from } = state.selection;
            const currentLineText = $from.nodeBefore?.textContent;
            return currentLineText === "/";
          }}
        >
          <button
            className="flex items-center gap-2 p-1 rounded min-w-[280px] hover:bg-zinc-600"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <img
              src="https://www.notion.so/images/blocks/bulleted-list.0e87e917.png"
              alt="bullet list"
              className="w-12 border border-zinc-600 rounded bg-zinc-50"
            />
            <div className="flex flex-col text-left">
              <span className="text-sm">Bulleted list</span>
              <span className="text-xs text-zinc-400">
                Creat a simple bulleted list.
              </span>
            </div>
          </button>

          <button
            className="flex items-center gap-2 p-1 rounded min-w-[280px] hover:bg-zinc-600"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <img
              src="https://www.notion.so/images/blocks/header.57a7576a.png"
              alt="heading"
              className="w-12 border border-zinc-600 rounded"
            />
            <div className="flex flex-col text-left">
              <span className="text-sm">Heading 1</span>
              <span className="text-xs text-zinc-400">
                Big section heading.
              </span>
            </div>
          </button>
          <button
            className="flex items-center gap-2 p-1 rounded min-w-[280px] hover:bg-zinc-600"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <img
              src="https://www.notion.so/images/blocks/subheader.9aab4769.png"
              alt="heading"
              className="w-12 border border-zinc-600 rounded"
            />
            <div className="flex flex-col text-left">
              <span className="text-sm">Heading 2</span>
              <span className="text-xs text-zinc-400">
                Medium section heading.
              </span>
            </div>
          </button>
          <button
            className="flex items-center gap-2 p-1 rounded min-w-[280px] hover:bg-zinc-600"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <img
              src="https://www.notion.so/images/blocks/code.a8b201f4.png"
              alt="Code block"
              className="w-12 border border-zinc-600 rounded bg-zinc-50"
            />
            <div className="flex flex-col text-left">
              <span className="text-sm">Code</span>
              <span className="text-xs text-zinc-400">
                Capture a code snippet.
              </span>
            </div>
          </button>
        </FloatingMenu>
      )} */}
      {editor && (
        <BubbleMenu
          className="w-full bg-zinc-700 shadow-xl border border-zinc-600 shadow-black/20 rounded-lg overflow-hidden flex divide-x divide-zinc-600"
          editor={editor}
        >
          <BubbleButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            data-active={editor.isActive("bold")}
          >
            <TextBolder size={16} />
          </BubbleButton>

          <BubbleButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            data-active={editor.isActive("italic")}
          >
            <TextItalic size={16} />
          </BubbleButton>

          <BubbleButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            data-active={editor.isActive("strike")}
          >
            <TextStrikethrough size={16} />
          </BubbleButton>

          <BubbleButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            data-active={editor.isActive("blockquote")}
          >
            <Quotes size={16} />
          </BubbleButton>

          <BubbleButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            data-active={editor.isActive("bulletList")}
          >
            <ListBullets size={16} />
          </BubbleButton>
          <BubbleButton
            onClick={() => editor.commands.unsetColor()}
            data-active={editor.isActive("textStyle", {
              color: "rgb(0 0 0)",
            })}
          >
            <div className="w-5 h-5 bg-black rounded-full"></div>
          </BubbleButton>
          <BubbleButton
            onClick={() => editor.commands.setColor("rgb(239 68 68)")}
            data-active={editor.isActive("textStyle", {
              color: "rgb(239 68 68)",
            })}
          >
            <div className="w-5 h-5 bg-red-500 rounded-full"></div>
          </BubbleButton>
          <BubbleButton
            onClick={() => editor.commands.setColor("rgb(249 115 22)")}
            data-active={editor.isActive("textStyle", {
              color: "rgb(249 115 22)",
            })}
          >
            <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
          </BubbleButton>
          <BubbleButton
            onClick={() => editor.commands.setColor("rgb(34 197 94)")}
            data-active={editor.isActive("textStyle", {
              color: "rgb(34 197 94)",
            })}
          >
            <div className="w-5 h-5 bg-green-500 rounded-full"></div>
          </BubbleButton>
          <BubbleButton
            onClick={() => editor.commands.setColor("rgb(59 130 246)")}
            data-active={editor.isActive("textStyle", {
              color: "rgb(59 130 246)",
            })}
          >
            <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
          </BubbleButton>
        </BubbleMenu>
      )}
    </>
  );
}
