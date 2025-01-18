"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "@/lib/utils";

const TooltipProvider = (
	props: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>,
) => <TooltipPrimitive.Provider delayDuration={50} {...props} />;
TooltipProvider.displayName = TooltipPrimitive.TooltipProvider.displayName;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = React.forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>(({ onClick, ...props }, ref) => (
	<TooltipPrimitive.Trigger
		ref={ref}
		onClick={(e) => {
			e.stopPropagation();
			e.preventDefault();
			onClick?.(e);
		}}
		{...props}
	/>
));
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

const TooltipContent = React.forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
	<TooltipPrimitive.Portal>
		<TooltipPrimitive.Content
			ref={ref}
			sideOffset={sideOffset}
			hideWhenDetached={false}
			onPointerDownOutside={(e) => {
				e.stopPropagation();
				e.preventDefault();
			}}
			className={cn(
				"z-50 overflow-hidden rounded-md bg-primary px-2 py-0.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
				className,
			)}
			{...props}
		/>
	</TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
