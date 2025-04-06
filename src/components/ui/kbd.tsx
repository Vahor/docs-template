import { cn } from '@/lib/utils';
import * as React from 'react';


function Kbd({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex h-5 items-center gap-0.5 whitespace-nowrap rounded bg-bg-white px-1.5 text-subheading-xs text-text-lighter ring-1 ring-inset ring-border',
        className,
      )}
      {...rest}
    />
  );
}

export { Kbd as Root };

