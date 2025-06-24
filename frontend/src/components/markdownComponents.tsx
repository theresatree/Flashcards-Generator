import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css"; // needed for proper math rendering
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";



type CodeProps = React.HTMLAttributes<HTMLElement> & {
  inline?: boolean;
};

interface MarkdownProps {
  content: string;
}

export function MarkdownRenderer({content}:MarkdownProps) {
    return (
        <ReactMarkdown
            children={content}
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
            components={{
                code({ inline, className, children, ...props }: CodeProps) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                        <SyntaxHighlighter
                            style={atomOneDark}
                            language={match[1]}
                            PreTag="div"
                            className="whitespace-pre-wrap break-words rounded-sm my-3"
                            {...props}
                        >
                            {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                    ) : (
                            <code 
                                className="px-1 py-0.5 rounded bg-zinc-800 text-gray-400 font-mono text-sm"
                                {...props}>
                                {children}
                            </code>
                        );
                },
                ul({ children }) {
                  return <ul className="list-disc pl-6 space-y-2">{children}</ul>;
                },
                ol({ children }) {
                  return <ol className="list-decimal pl-6 space-y-2">{children}</ol>;
                },
                li({ children }) {
                  return <li className="mb-1 first:mt-2 last:mb-2">{children}</li>;
                },
            }}
        />
    );
}

