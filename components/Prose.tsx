import { ReactNode } from 'react';
import clsx from 'clsx';

interface ProseProps {
  children: ReactNode;
  className?: string;
}

export default function Prose({ children, className }: ProseProps) {
  return (
    <div 
      className={clsx(
        // Base prose styles
        'prose prose-lg max-w-none',
        // Typography
        'font-inter text-gray-900',
        // Headings - Space Grotesk font
        'prose-headings:font-space-grotesk prose-headings:font-semibold',
        'prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:mb-6',
        'prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mb-4 prose-h2:mt-8',
        'prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mb-3 prose-h3:mt-6',
        // Links - coral color
        'prose-a:text-coral prose-a:underline prose-a:decoration-coral/30',
        'hover:prose-a:decoration-coral prose-a:transition-colors',
        // Blockquotes - coral left border
        'prose-blockquote:border-l-4 prose-blockquote:border-coral',
        'prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600',
        'prose-blockquote:bg-gray-50/50 prose-blockquote:py-2 prose-blockquote:rounded-r',
        // Code blocks - navy background
        'prose-pre:bg-navy/5 prose-pre:border prose-pre:border-gray-200',
        'prose-pre:rounded-md prose-pre:text-sm',
        'prose-code:font-jetbrains-mono prose-code:text-sm',
        'prose-code:before:content-none prose-code:after:content-none',
        'prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
        // Images
        'prose-img:rounded-lg prose-img:shadow-md',
        // Strong text
        'prose-strong:text-gray-900 prose-strong:font-semibold',
        // Lists
        'prose-li:marker:text-coral',
        'prose-ul:list-disc prose-ol:list-decimal',
        // Custom spacing
        'prose-p:text-lg prose-p:leading-relaxed',
        className
      )}
    >
      {children}
    </div>
  );
}