import {
	RiCodeSSlashLine,
	RiArticleLine,
	RiGitBranchLine,
} from '@remixicon/react';

export const SectionIcon = {
	guide: RiArticleLine,
	api: RiCodeSSlashLine,
	changelog: RiGitBranchLine,
}

export type Section = keyof typeof SectionIcon;
