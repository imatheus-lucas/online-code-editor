"use client";
import { extractDependencies } from "@/helpers/extract-dependencies";
import { getWebContainerInstance } from "@/lib/web-container";
import { NodeViewWrapper } from "@tiptap/react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import "@uiw/react-textarea-code-editor/dist.css";
import ANSIToHTML from "ansi-to-html";

import { Lightning, Spinner } from "phosphor-react";
import { useState } from "react";
const ANSIConverter = new ANSIToHTML();

export function WebContainerEditor() {
  const [code, setCode] = useState("");

  const [isRunning, setIsRunning] = useState(false);

  const [output, setOutput] = useState<string[]>([]);
  async function runCode() {
    setIsRunning(true);
    setOutput([]);

    const dependenciesToinstall = extractDependencies(code);
    const webContainer = await getWebContainerInstance();

    const amountOfDependencies = {
      "index.ts": {
        file: {
          contents: code,
        },
      },
      "tsconfig.json": {
        file: {
          contents: `
          {
            "compilerOptions": {
              "target": "es2017",
              "module": "commonjs",
              "lib": ["es2017", "dom"],
              "esModuleInterop": true,
              "moduleResolution": "node",
              "resolveJsonModule": true,
              "skipLibCheck": true,
              "strict": false,
              "noImplicitAny": false,
              "noImplicitThis": false,
              "alwaysStrict": false,
              "strictNullChecks": false,
              "strictFunctionTypes": false,
              "strictPropertyInitialization": false,
              "strictBindCallApply": false,
              "forceConsistentCasingInFileNames": true,
              "sourceMap": true,
              "outDir": "./dist"
            },
            "include": ["index.ts"],
            "exclude": ["node_modules"]
          }`.trim(),
        },
      },
      "package.json": {
        file: {
          contents: `
          {
            "name": "example-app",
            "devDependencies": {
              "typescript": "latest"
            },
            "dependencies": {
              ${dependenciesToinstall
                .map((dep) => `"${dep}": "latest"`)
                .join(",")}
            },
            "scripts": {
              "build": "tsc",
              "start": "node dist/index.js"
            }
          }
        `.trim(),
        },
      },
    };

    await webContainer.mount(amountOfDependencies);

    setOutput((state) => [...state, "🚧 Installing required dependencies..."]);

    const installProcess = await webContainer.spawn("pnpm", [
      "i",
      "--only=dev",
    ]);

    await installProcess.exit;

    if (dependenciesToinstall.length > 0) {
      setOutput((state) => [
        ...state,
        `📦Found ${dependenciesToinstall.length} dependencies to install`,
      ]);

      setOutput((state) => [
        ...state,
        ...dependenciesToinstall.map((dep) => `- ${dep}`),
      ]);

      setOutput((state) => [...state, "🚧 Installing found dependencies..."]);

      const installProcess = await webContainer.spawn("pnpm", ["i"]);

      installProcess.output.pipeTo(
        new WritableStream({
          write(data) {
            setOutput((state) => [...state, ANSIConverter.toHtml(data)]);
          },
        })
      );

      await installProcess.exit;
    }

    setOutput((state) => [...state, "🚧 Building the application..."]);

    const buildProcess = await webContainer.spawn("pnpm", ["build"]);

    await buildProcess.exit;

    const start = await webContainer.spawn("pnpm", ["start"]);

    start.output.pipeTo(
      new WritableStream({
        write(chunk) {
          setOutput((state) => [...state, ANSIConverter.toHtml(chunk)]);
        },
      })
    );

    webContainer.on("server-ready", (_, url) => {
      setOutput((state) => [
        ...state,
        `🌎 We have detected a server running. Please use this URL to access it: ${url}`,
      ]);
    });

    await start.exit;

    setIsRunning(false);
  }

  function StopRunCode() {
    setIsRunning(false);
  }

  return (
    <NodeViewWrapper className="not-prose">
      <CodeEditor
        language="ts"
        placeholder="Type some code..."
        onChange={(ev) => setCode(ev.target.value)}
        value={code}
        minHeight={80}
        padding={20}
        spellCheck={false}
        style={{
          fontFamily: "JetBrains Mono, monospace",
          borderRadius: "0.25rem",
          backgroundColor: "#21202e",
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
        }}
        data-color-mode="dark"
      />
      <div
        className="bg-black p-5 h-[15rem] overflow-auto rounded mt-2 text-sm relative"
        contentEditable={false}
        spellCheck={false}
      >
        {output.length > 0 ? (
          <div className="font-monospace text-xs leading-loose ">
            {output.map((line, index) => {
              return (
                <p
                  key={`${line}-${index}`}
                  dangerouslySetInnerHTML={{ __html: line }}
                />
              );
            })}
          </div>
        ) : (
          <span className="text-zinc-400">
            Click to run the code and see the output here
          </span>
        )}
        <div className="absolute right-4 top-4">
          {isRunning ? (
            <button
              type="button"
              onClick={StopRunCode}
              contentEditable={false}
              className="text-xs bg-zinc-500 rounded px-3 py-2 flex items-center gap-1 text-white font-semibold hover:bg-zinc-600"
            >
              <Spinner
                weight="bold"
                color="#FFF"
                size={14}
                className="animate-spin"
              />
              Stop running
            </button>
          ) : (
            <button
              type="button"
              onClick={runCode}
              contentEditable={false}
              className="text-xs bg-orange-500 rounded px-3 py-2 flex items-center gap-1 text-white font-semibold hover:bg-orange-600"
            >
              <Lightning weight="bold" color="#FFF" size={14} />
              Run code
            </button>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
}
