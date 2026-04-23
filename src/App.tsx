import { Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Sidebar from "./layout/sidebar";
import Header from "./layout/header";
import Footer from "./layout/footer";
import Dashboard from "./routes/dashboard";
import RequestHandler from "./lib/utilities/request_handler";

export default function App() {
	RequestHandler.init();
	const location = useLocation();

	return (
		<div className="flex min-h-screen bg-surface2">
			<Sidebar />

			{/* main-wrap */}
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
						</Routes>
					</motion.main>
				</AnimatePresence>

				<Footer />
			</div>
		</div>
	);
}