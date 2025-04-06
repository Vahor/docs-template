'use client';

import * as React from 'react';
import { type DialogProps } from '@radix-ui/react-dialog';
import { Command } from 'cmdk';

import * as Modal from '@/components/ui/modal';
import { cn, tv } from '@/lib/utils';
import { VariantProps } from 'tailwind-variants';
import { PolymorphicComponentProps } from '@/lib/polymorphic';

const CommandDialogTitle = Modal.Title;
const CommandDialogDescription = Modal.Description;

const CommandDialog = ({
  children,
  className,
  overlayClassName,
  commandProps,
  title = 'Search',
  ...rest
}: DialogProps & {
  title?: string;
  className?: string;
  overlayClassName?: string;
  commandProps?: Omit<Parameters<typeof Command>[0], 'children'>;
}) => {
  return (
    <Modal.Root {...rest}>
      <Modal.Content
        overlayClassName={cn('justify-start pt-20', overlayClassName)}
        showClose={false}
        className={cn(
          'flex max-h-full max-w-[720px] flex-col overflow-hidden rounded-2xl',
          className,
        )}
      >
        {<Modal.Title className='sr-only'>{title}</Modal.Title>}
        <Command
          className={cn(
            'divide-y divide-border',
            'grid min-h-0 auto-cols-auto grid-flow-row',
            '[&>[cmdk-label]+*]:!border-t-0',
          )}
          {...commandProps}
        >
          {children}
        </Command>
      </Modal.Content>
    </Modal.Root>
  );
};

const CommandInput = React.forwardRef<
  React.ComponentRef<typeof Command.Input>,
  React.ComponentPropsWithoutRef<typeof Command.Input>
>(({ className, ...rest }, forwardedRef) => {
  return (
    <Command.Input
      ref={forwardedRef}
      className={cn(
        // base
        'w-full bg-transparent text-paragraph-sm text-text-dark outline-none',
        'transition duration-200 ease-out',
        // placeholder
        'placeholder:[transition:inherit]',
        'placeholder:text-text-lighter',
        // hover
        'group-hover/cmd-input:placeholder:text-text-base',
        // focus
        'focus:outline-none',
        className,
      )}
      {...rest}
    />
  );
});
CommandInput.displayName = 'CommandInput';

const CommandList = React.forwardRef<
  React.ComponentRef<typeof Command.List>,
  React.ComponentPropsWithoutRef<typeof Command.List>
>(({ className, ...rest }, forwardedRef) => {
  return (
    <Command.List
      ref={forwardedRef}
      className={cn(
        'flex max-h-min min-h-0 flex-1 flex-col',
        '[&>[cmdk-list-sizer]]:divide-y [&>[cmdk-list-sizer]]:divide-border',
        '[&>[cmdk-list-sizer]]:overflow-auto',
        className,
      )}
      {...rest}
    />
  );
});
CommandList.displayName = 'CommandList';

const CommandGroup = React.forwardRef<
  React.ComponentRef<typeof Command.Group>,
  React.ComponentPropsWithoutRef<typeof Command.Group>
>(({ className, ...rest }, forwardedRef) => {
  return (
    <Command.Group
      ref={forwardedRef}
      className={cn(
        'relative px-2 py-3',
        // heading
        '[&>[cmdk-group-heading]]:text-label-xs [&>[cmdk-group-heading]]:text-text-base',
        '[&>[cmdk-group-heading]]:mb-2 [&>[cmdk-group-heading]]:px-3 [&>[cmdk-group-heading]]:pt-1',
        className,
      )}
      {...rest}
    />
  );
});
CommandGroup.displayName = 'CommandGroup';

const commandItemVariants = tv({
  base: [
    'flex items-center gap-3 rounded-10 bg-bg-white',
    'cursor-pointer text-paragraph-sm text-text-dark',
    'transition duration-200 ease-out',
    // hover/selected
    'data-[selected=true]:bg-bg-light',
  ],
  variants: {
    size: {
      small: 'px-3 py-2.5',
      medium: 'px-3 py-3',
    },
  },
  defaultVariants: {
    size: 'small',
  },
});

type CommandItemProps = VariantProps<typeof commandItemVariants> &
  React.ComponentPropsWithoutRef<typeof Command.Item>;

const CommandItem = React.forwardRef<
  React.ComponentRef<typeof Command.Item>,
  CommandItemProps
>(({ className, size, ...rest }, forwardedRef) => {
  return (
    <Command.Item
      ref={forwardedRef}
      className={commandItemVariants({ size, class: className })}
      {...rest}
    />
  );
});
CommandItem.displayName = 'CommandItem';

function CommandItemIcon<T extends React.ElementType>({
  className,
  as,
  ...rest
}: PolymorphicComponentProps<T>) {
  const Component = as || 'div';

  return (
    <Component
      className={cn('size-5 shrink-0 text-text-base', className)}
      {...rest}
    />
  );
}

function CommandFooter({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex h-12 items-center justify-between gap-3 px-5',
        className,
      )}
      {...rest}
    />
  );
}

function CommandFooterKeyBox({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex size-5 shrink-0 items-center justify-center rounded bg-bg-light text-text-base ring-1 ring-inset ring-border',
        className,
      )}
      {...rest}
    />
  );
}

function CommandEmpty({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Command.Empty
      className={cn(
        'flex h-12 items-center gap-1 text-paragraph-sm text-text-base px-5',
        className,
      )}
      {...rest}
    />
  );
}

export {
  CommandDialog as Dialog,
  CommandDialogTitle as DialogTitle,
  CommandDialogDescription as DialogDescription,
  CommandInput as Input,
  CommandList as List,
  CommandGroup as Group,
  CommandItem as Item,
  CommandEmpty as Empty,
  CommandItemIcon as ItemIcon,
  CommandFooter as Footer,
  CommandFooterKeyBox as FooterKeyBox,
};
