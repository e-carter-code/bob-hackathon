import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import WorkflowStepper from './WorkflowStepper';

export type PageHeaderProps = {
  title: string;
  /** Short line with leading blue icon (keep punchy; one sentence). */
  tagline: string;
  Icon: LucideIcon;
  children?: ReactNode;
};

export default function PageHeader({ title, tagline, Icon, children }: PageHeaderProps) {
  return (
    <header className="mb-8 space-y-5">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h1>
        <p className="inline-flex max-w-3xl items-start gap-2.5 text-base font-semibold leading-snug tracking-tight text-text-primary md:text-lg">
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-live-sky md:h-[1.35rem] md:w-[1.35rem]" strokeWidth={2.25} aria-hidden />
          <span>{tagline}</span>
        </p>
      </div>
      <WorkflowStepper />
      {children}
    </header>
  );
}
