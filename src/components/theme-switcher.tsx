"use client"

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import * as Button from "./ui/button";
import { RiMoonClearLine, RiSunLine } from '@remixicon/react';

export function ThemeSwitcher() {
	const { resolvedTheme: theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	const updateTheme = () => {
		const nextTheme = theme === "dark" ? "light" : "dark";
		setTheme(nextTheme);
	};

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<Button.Root onClick={updateTheme} variant="neutral" mode="ghost" size="xxsmall">
			{mounted &&
				<Button.Icon className="size-5" as={theme === "dark" ? RiMoonClearLine : RiSunLine} />
			}
		</Button.Root>
	);
}
