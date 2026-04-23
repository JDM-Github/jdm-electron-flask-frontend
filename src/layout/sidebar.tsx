import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

type NavItem = {
	label: string;
	path: string;
	icon: React.ReactNode;
	badge?: string;
};

type NavSection = {
	section: string;
	items: NavItem[];
};

const NAV: NavSection[] = [
	{
		section: "Main",
		items: [
			{
				label: "Dashboard",
				path: "/",
				icon: (
					<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
						<rect x="1" y="1" width="5.5" height="5.5" rx="1.2" />
						<rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2" />
						<rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2" />
						<rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" />
					</svg>
				),
			},
			{
				label: "Page One",
				path: "/page-one",
				icon: (
					<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
						<path d="M2.5 4h10M2.5 7.5h7M2.5 11h8.5" strokeLinecap="round" />
					</svg>
				),
				badge: "NEW",
			},
			{
				label: "Page Two",
				path: "/page-two",
				icon: (
					<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
						<circle cx="7.5" cy="7.5" r="5.5" />
						<path d="M7.5 4.5v3l2 1.5" strokeLinecap="round" />
					</svg>
				),
			},
		],
	},
	{
		section: "System",
		items: [
			{
				label: "Settings",
				path: "/settings",
				icon: (
					<svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.4">
						<circle cx="7.5" cy="7.5" r="2" />
						<path d="M7.5 1v2M7.5 12v2M1 7.5h2M12 7.5h2M2.93 2.93l1.41 1.41M10.66 10.66l1.41 1.41M2.93 12.07l1.41-1.41M10.66 4.34l1.41-1.41" strokeLinecap="round" />
					</svg>
				),
			},
		],
	},
];

export default function Sidebar() {
	const location = useLocation();

	return (
		<motion.aside
			className="fixed top-0 left-0 w-[220px] h-screen bg-surface border-r border-border flex flex-col z-50"
			initial={{ x: -12, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ duration: 0.25, ease: "easeOut" }}
		>
			{/* Logo */}
			<div className="h-[52px] flex items-center gap-2.5 px-4 border-b border-border shrink-0">
				<div className="w-7 h-7 rounded-[6px] bg-accent flex items-center justify-center font-mono font-extrabold text-[10px] tracking-[0.06em] text-white shrink-0">
					JDM
				</div>
				<div className="text-[14px] font-bold text-text tracking-[-0.2px]">
					App<span className="text-accent">Name</span>
				</div>
			</div>

			{/* Nav */}
			<nav className="flex-1 px-2.5 py-2.5 flex flex-col gap-0 overflow-y-auto">
				{NAV.map(({ section, items }) => (
					<div key={section} className="mb-1">
						<div className="text-[9px] font-mono text-text-faint tracking-[0.14em] uppercase px-2 pt-3.5 pb-1">
							{section}
						</div>
						{items.map((item) => {
							const isActive =
								item.path === "/"
									? location.pathname === "/"
									: location.pathname.startsWith(item.path);
							return (
								<NavLink
									key={item.path}
									to={item.path}
									className={[
										"relative flex items-center gap-[9px] px-2.5 py-[7px] rounded-[7px] text-[13px] font-medium transition-colors overflow-hidden",
										isActive
											? "bg-accent-dim text-accent border border-accent-border"
											: "text-text-muted hover:bg-surface3 hover:text-text border border-transparent",
									].join(" ")}
								>
									{/* Icon */}
									<span className={["flex items-center justify-center shrink-0", isActive ? "opacity-100" : "opacity-65"].join(" ")}>
										{item.icon}
									</span>

									{/* Label */}
									<span className="flex-1">{item.label}</span>

									{/* Badge */}
									{item.badge && (
										<span className="text-[9px] font-mono font-semibold bg-accent text-white px-1.5 py-[2px] rounded-[4px] tracking-[0.04em]">
											{item.badge}
										</span>
									)}

									{/* Active bar */}
									{isActive && (
										<motion.span
											className="absolute right-0 top-1/2 -translate-y-1/2 w-[2px] h-[60%] bg-accent rounded-l-[2px]"
											layoutId="active-bar"
											transition={{ duration: 0.2, ease: "easeOut" }}
										/>
									)}
								</NavLink>
							);
						})}
					</div>
				))}
			</nav>

			{/* User */}
			<div className="px-3.5 py-3 border-t border-border flex items-center gap-2.5">
				<div className="w-[30px] h-[30px] rounded-full bg-accent2 flex items-center justify-center text-[11px] font-mono font-bold text-white shrink-0">
					JD
				</div>
				<div className="flex-1 min-w-0">
					<div className="text-[12px] font-semibold text-text whitespace-nowrap overflow-hidden text-ellipsis">
						Developer
					</div>
					<div className="text-[9px] font-mono text-text-muted tracking-[0.08em]">ADMIN</div>
				</div>
			</div>
		</motion.aside>
	);
}