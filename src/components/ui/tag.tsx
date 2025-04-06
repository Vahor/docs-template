import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { RiCloseFill } from '@remixicon/react';
import { tv, VariantProps } from '@/lib/utils';
import { recursiveCloneChildren } from '@/lib/recursive-clone-children';
import { PolymorphicComponentProps } from '@/lib/polymorphic';

const TAG_ROOT_NAME = 'TagRoot';
const TAG_ICON_NAME = 'TagIcon';
const TAG_DISMISS_BUTTON_NAME = 'TagDismissButton';
const TAG_DISMISS_ICON_NAME = 'TagDismissIcon';

export const tagVariants = tv({
  slots: {
    root: [
      'group/tag inline-flex h-6 items-center gap-2 rounded-md px-2 text-label-xs text-text-base',
      'transition duration-200 ease-out',
      'ring-1 ring-inset',
    ],
    icon: [
      // base
      '-mx-1 size-4 shrink-0 text-text-lighter transition duration-200 ease-out',
      // hover
      'group-hover/tag:text-text-base',
    ],
    dismissButton: [
      // base
      'group/dismiss-button -ml-1.5 -mr-1 size-4 shrink-0',
      // focus
      'focus:outline-none',
    ],
    dismissIcon: 'size-4 text-text-lighter transition duration-200 ease-out',
  },
  variants: {
    variant: {
      stroke: {
        root: [
          // base
          'bg-bg-white-0 ring-border',
          // hover
          'hover:bg-bg-light hover:ring-transparent',
          // focus-within
          'focus-within:bg-bg-light focus-within:ring-transparent',
        ],
        dismissIcon: [
          // hover
          'group-hover/dismiss-button:text-text-base',
          // focus
          'group-focus/dismiss-button:text-text-base',
        ],
      },
      gray: {
        root: [
          // base
          'bg-bg-light ring-transparent',
          // hover
          'hover:bg-bg-white hover:ring-border',
        ],
      },
    },
    disabled: {
      true: {
        root: 'pointer-events-none bg-bg-light text-text-disabled ring-transparent',
        icon: 'text-text-disabled [&:not(.remixicon)]:opacity-[.48]',
        dismissIcon: 'text-text-disabled',
      },
    },
  },
  defaultVariants: {
    variant: 'stroke',
  },
});

type TagSharedProps = VariantProps<typeof tagVariants>;

type TagProps = VariantProps<typeof tagVariants> &
  React.HTMLAttributes<HTMLDivElement> & {
    asChild?: boolean;
  };

const TagRoot = React.forwardRef<HTMLDivElement, TagProps>(
  (
    { asChild, children, variant, disabled, className, ...rest },
    forwardedRef,
  ) => {
    const uniqueId = React.useId();
    const Component = asChild ? Slot : 'div';
    const { root } = tagVariants({ variant, disabled });

    const sharedProps: TagSharedProps = {
      variant,
      disabled,
    };

    const extendedChildren = recursiveCloneChildren(
      children as React.ReactElement[],
      sharedProps,
      [TAG_ICON_NAME, TAG_DISMISS_BUTTON_NAME, TAG_DISMISS_ICON_NAME],
      uniqueId,
      asChild,
    );

    return (
      <Component
        ref={forwardedRef}
        className={root({ class: className })}
        aria-disabled={disabled}
        {...rest}
      >
        {extendedChildren}
      </Component>
    );
  },
);
TagRoot.displayName = TAG_ROOT_NAME;

function TagIcon<T extends React.ElementType>({
  className,
  variant,
  disabled,
  as,
  ...rest
}: PolymorphicComponentProps<T, TagSharedProps>) {
  const Component = as || 'div';
  const { icon } = tagVariants({ variant, disabled });

  return <Component className={icon({ class: className })} {...rest} />;
}
TagIcon.displayName = TAG_ICON_NAME;

type TagDismissButtonProps = TagSharedProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
  };

const TagDismissButton = React.forwardRef<
  HTMLButtonElement,
  TagDismissButtonProps
>(
  (
    { asChild, children, className, variant, disabled, ...rest },
    forwardedRef,
  ) => {
    const Component = asChild ? Slot : 'button';
    const { dismissButton } = tagVariants({ variant, disabled });

    return (
      <Component
        ref={forwardedRef}
        className={dismissButton({ class: className })}
        {...rest}
      >
        {children ?? (
          <TagDismissIcon
            variant={variant}
            disabled={disabled}
            as={RiCloseFill}
          />
        )}
      </Component>
    );
  },
);
TagDismissButton.displayName = TAG_DISMISS_BUTTON_NAME;

function TagDismissIcon<T extends React.ElementType>({
  className,
  variant,
  disabled,
  as,
  ...rest
}: PolymorphicComponentProps<T, TagSharedProps>) {
  const Component = as || 'div';
  const { dismissIcon } = tagVariants({ variant, disabled });

  return <Component className={dismissIcon({ class: className })} {...rest} />;
}
TagDismissIcon.displayName = TAG_DISMISS_ICON_NAME;

export {
  TagRoot as Root,
  TagIcon as Icon,
  TagDismissButton as DismissButton,
  TagDismissIcon as DismissIcon,
};

