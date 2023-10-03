export type NavItem = {
	title: string;
	href: string;
	disabled?: boolean;
};
export type MenuItem = NavItem & {
	description?: string;
	launched?: boolean;
	external?: boolean;
};

export type MainNavItem = NavItem;

export type SidebarNavItem = {
	title: string;
	disabled?: boolean;
	external?: boolean;
} & (
	| {
			href: string;
			items?: never;
	  }
	| {
			href?: string;
			items: MenuItem[];
	  }
);

export type SiteConfig = {
	name: string;
	description: string;
	url: string;
	ogImage: string;
	links: {
		twitter: string;
		github: string;
	};
};

export type DocsConfig = {
	mainNav: MainNavItem[];
	sidebarNav: SidebarNavItem[];
};

export type NavConfig = {
	mainNav: MainNavItem[];
};

export type NavMenuConfig = {
	infosNav: SidebarNavItem[];
	examplesNav: SidebarNavItem[];
};

export type DashboardConfig = {
	mainNav: MainNavItem[];
	sidebarNav: SidebarNavItem[];
};

export type SubscriptionPlan = {
	name: string;
	description: string;
	stripePriceId: string;
};
