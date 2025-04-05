import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { tv, VariantProps } from "tailwind-variants";
import { recursiveCloneChildren } from "@/lib/recursive-clone-children";
import { PolymorphicComponentProps } from "@/lib/polymorphic";

const BUTTON_ROOT_NAME = 'ButtonRoot';
const BUTTON_ICON_NAME = 'ButtonIcon';

const buttonVariants = tv({
  slots: {
    root: [
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    ],
    icon: []
  },
  variants: {
    variant: {
      primary: {},
      error: {},
    },
    mode: {
      filled: {},
      stroke: {
        root: 'ring-1 ring-inset',
      },
    },
    size: {
      large: {
        root: 'h-10 gap-3 rounded-xl px-3.5 text-label-sm',
        icon: '-mx-1',
      },
      medium: {
        root: 'h-9 gap-3 rounded-lg px-3 text-label-sm',
        icon: '-mx-1',
      },
      small: {
        root: 'h-8 gap-2.5 rounded-lg px-2.5 text-label-sm',
        icon: '-mx-1',
      },
      xsmall: {
        root: 'h-7 gap-2.5 rounded-lg px-2 text-label-sm',
        icon: '-mx-1',
      },
    },
  },
  compoundVariants: [
    //#region variant=primary
    {
      variant: 'primary',
      mode: 'filled',
      class: {
        root: [
          // base
          'bg-primary-base text-white',
          // hover
          'hover:bg-primary-darker',
          // focus
          'focus-visible:shadow-button-primary-focus',
        ],
      },
    },
    {
      variant: 'primary',
      mode: 'stroke',
      class: {
        root: [
          // base
          'bg-white-0 text-primary-base ring-primary-base',
          // hover
          'hover:bg-primary/10 hover:ring-transparent',
          // focus
          'focus-visible:shadow-button-primary-focus',
        ],
      },
    },
    //#endregion

    //#region variant=error
    {
      variant: 'error',
      mode: 'filled',
      class: {
        root: [
          // base
          'bg-error-base text-white',
          // hover
          'hover:bg-red-700',
          // focus
          'focus-visible:shadow-button-error-focus',
        ],
      },
    },
    //#endregion
  ],
  defaultVariants: {
    variant: 'primary',
    mode: 'filled',
    size: 'medium',
  },
});

type ButtonSharedProps = VariantProps<typeof buttonVariants>;

type ButtonRootProps = VariantProps<typeof buttonVariants> &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    asChild?: boolean;
  };

const ButtonRoot = React.forwardRef<HTMLButtonElement, ButtonRootProps>(
  (
    { children, variant, mode, size, asChild, className, ...rest },
    forwardedRef,
  ) => {
    const uniqueId = React.useId();
    const Component = asChild ? Slot : 'button';
    const { root } = buttonVariants({ variant, mode, size });

    const sharedProps: ButtonSharedProps = {
      variant,
      mode,
      size,
    };

    const extendedChildren = recursiveCloneChildren(
      children as React.ReactElement[],
      sharedProps,
      [BUTTON_ICON_NAME],
      uniqueId,
      asChild,
    );

    return (
      <Component
        ref={forwardedRef}
        className={root({ class: className })}
        {...rest}
      >
        {extendedChildren}
      </Component>
    );
  },
);
ButtonRoot.displayName = BUTTON_ROOT_NAME;

function ButtonIcon<T extends React.ElementType>({
  variant,
  mode,
  size,
  as,
  className,
  ...rest
}: PolymorphicComponentProps<T, ButtonSharedProps>) {
  const Component = as || 'div';
  const { icon } = buttonVariants({ mode, variant, size });

  return <Component className={icon({ class: className })} {...rest} />;
}
ButtonIcon.displayName = BUTTON_ICON_NAME;

export { ButtonRoot as Root, ButtonIcon as Icon }
