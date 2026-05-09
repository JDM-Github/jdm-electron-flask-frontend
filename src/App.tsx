import { useLocation, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./layout/sidebar";
import Header from "./layout/header";
import Footer from "./layout/footer";
import Dashboard from "./routes/Dashboard";
import SocketTest from "./routes/SocketTest";
import RequestHandler from "./lib/utilities/request_handler";
import { APP_NAME } from "./lib/constant";
import { useEffect } from "react";

const ROUTE_NAMES: Record<string, string> = {
	"/": "Dashboard",
	"/page-one": "SocketTest"
};

export default function App() {
	RequestHandler.init();
	const location = useLocation();

	useEffect(() => {
		const routeName = ROUTE_NAMES[location.pathname] ?? "Page";
		document.title = `${APP_NAME} | ${routeName}`;
	}, [location.pathname]);

	return (
		<div className="flex min-h-screen bg-surface2">
			<Sidebar />

			<div className="ml-[220px] flex flex-col flex-1 min-h-screen">
				<Header />

				<AnimatePresence mode="wait">
					<motion.main
						key={location.pathname}
						className="flex-1 p-7 pb-0"
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -6 }}
						transition={{ duration: 0.18, ease: "easeOut" }}
					>
						<Routes location={location}>
							<Route path="/" element={<Dashboard />} />
							<Route path="page-one" element={<SocketTest />} />
						</Routes>
					</motion.main>
				</AnimatePresence>

				<Footer />
			</div>
		</div>
	);
}
