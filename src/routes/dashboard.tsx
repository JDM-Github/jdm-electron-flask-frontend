import { useState } from "react";
import { motion } from "framer-motion";
import RequestHandler from "../lib/utilities/request_handler";

/* ─── Types ─────────────────────────────────────────────────────── */
type ApiState<T> = {
	data: T | null;
	loading: boolean;
	error: string | null;
};

const initState = <T,>(): ApiState<T> => ({
	data: null,
	loading: false,
	error: null,
});

/* ─── Animations ─────────────────────────────────────────────────── */
const container = {
	hidden: {},
	show: { transition: { staggerChildren: 0.07 } },
};

const cardVariant = {
	hidden: { opacity: 0, y: 10 },
	show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

/* ─── Component ──────────────────────────────────────────────────── */
export default function Dashboard() {
	const [singleInput, setSingleInput] = useState("");
	const [single, setSingle] = useState<ApiState<any>>(initState());

	const [batchInput, setBatchInput] = useState("");
	const [batch, setBatch] = useState<ApiState<any>>(initState());

	/* Single */
	const handleSingle = async () => {
		if (!singleInput.trim()) return;
		setSingle({ data: null, loading: true, error: null });
		const res = await RequestHandler.fetchData("POST", "example/process", {
			input: singleInput.trim(),
		});
		if (res?.success === false) {
			setSingle({ data: null, loading: false, error: res.message });
		} else {
			setSingle({ data: res?.data ?? res, loading: false, error: null });
		}
	};

	/* Batch — one item per line */
	const handleBatch = async () => {
		const lines = batchInput
			.split("\n")
			.map((l) => l.trim())
			.filter(Boolean);
		if (lines.length === 0) return;
		setBatch({ data: null, loading: true, error: null });
		const res = await RequestHandler.fetchData("POST", "example/process/batch", {
			inputs: lines,
		});
		if (res?.success === false) {
			setBatch({ data: null, loading: false, error: res.message });
		} else {
			setBatch({ data: res?.data ?? res, loading: false, error: null });
		}
	};

	const stats = [
		{ label: "Endpoints", value: "2", sub: "Routes registered" },
		{
			label: "Mode",
			value: 
				RequestHandler.mode === "development"
					? "DEV"
					: RequestHandler.mode === "production"
						? "PROD"
						: RequestHandler.mode === "deployed"
							? "DEPLOYED"
							: "UNKNOWN",
			sub: "Current environment",
		},
		{ label: "Base URL", value: RequestHandler.baseURL ? "SET" : "RELATIVE", sub: RequestHandler.baseURL || "/ (served by Flask)" },
		{ label: "Auth Access", value: typeof window !== "undefined" && localStorage.getItem("authAccess") ? "ON" : "OFF", sub: "X-Bearer access in storage" },
	];

	return (
		// page
		<div className="flex flex-col gap-4">

			{/* Heading */}
			<div className="flex flex-col gap-1">
				<h1 className="text-[18px] font-bold text-text tracking-[-0.3px]">Dashboard</h1>
				<p className="text-[12px] font-mono text-text-muted">
					JDM Flask &amp; Electron Template — rename routes, swap endpoints, start building.
				</p>
			</div>

			{/* Stat strip */}
			<motion.div
				className="grid grid-cols-4 gap-3"
				variants={container}
				initial="hidden"
				animate="show"
			>
				{stats.map((s) => (
					<motion.div
						key={s.label}
						className="bg-surface border border-border rounded-[10px] px-[18px] py-4"
						variants={cardVariant}
					>
						<div className="text-[9px] font-mono text-text-muted tracking-[0.1em] uppercase">{s.label}</div>
						<div className="text-[24px] font-bold text-text tracking-[-0.5px] mt-1.5">{s.value}</div>
						<div className="text-[10px] font-mono text-text-faint mt-1 whitespace-nowrap overflow-hidden text-ellipsis">{s.sub}</div>
					</motion.div>
				))}
			</motion.div>

			{/* Two-panel grid */}
			<div className="grid grid-cols-[1fr_280px] gap-3.5">

				{/* ── Single process ── */}
				<motion.div
					className="bg-surface border border-border rounded-[10px] overflow-hidden"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.22, delay: 0.15 }}
				>
					{/* panel header */}
					<div className="flex items-center justify-between px-[18px] py-[13px] border-b border-border">
						<span className="text-[13px] font-semibold text-text">Single Process</span>
						{/* endpoint tag */}
						<span className="text-[9px] font-mono text-accent bg-accent-dim border border-accent-border px-2 py-[3px] rounded-[4px] tracking-[0.04em]">
							POST /api/example/process
						</span>
					</div>

					{/* panel body */}
					<div className="p-[18px] flex flex-col gap-3">
						<div className="flex flex-col gap-1.5">
							<label className="text-[9px] font-mono text-text-muted tracking-[0.1em] uppercase">Input</label>
							<input
								className="bg-surface2 border border-border2 rounded-[7px] px-3 py-2 text-[12px] text-text outline-none focus:border-accent transition-colors w-full placeholder:text-text-faint"
								type="text"
								placeholder='Replaces { "input": "..." }'
								value={singleInput}
								onChange={(e) => setSingleInput(e.target.value)}
								onKeyDown={(e) => e.key === "Enter" && handleSingle()}
							/>
						</div>
						<button
							className="flex items-center justify-center px-4 py-2 rounded-[7px] bg-accent text-white text-[12px] font-semibold font-mono tracking-[0.03em] transition-opacity hover:opacity-85 active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed"
							onClick={handleSingle}
							disabled={single.loading || !singleInput.trim()}
						>
							{single.loading ? "Processing..." : "Send →"}
						</button>
						<ResultBox state={single} />
					</div>
				</motion.div>

				{/* ── Batch process ── */}
				<motion.div
					className="bg-surface border border-border rounded-[10px] overflow-hidden"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.22, delay: 0.2 }}
				>
					{/* panel header */}
					<div className="flex items-center justify-between px-[18px] py-[13px] border-b border-border">
						<span className="text-[13px] font-semibold text-text">Batch Process</span>
						<span className="text-[9px] font-mono text-accent bg-accent-dim border border-accent-border px-2 py-[3px] rounded-[4px] tracking-[0.04em]">
							POST /api/example/process/batch
						</span>
					</div>

					{/* panel body */}
					<div className="p-[18px] flex flex-col gap-3">
						<div className="flex flex-col gap-1.5">
							<label className="text-[9px] font-mono text-text-muted tracking-[0.1em] uppercase">Inputs — one per line</label>
							<textarea
								className="bg-surface2 border border-border2 rounded-[7px] px-3 py-2 text-[11px] font-mono text-text outline-none focus:border-accent transition-colors w-full placeholder:text-text-faint leading-relaxed resize-none"
								placeholder={"item one\nitem two\nitem three"}
								value={batchInput}
								onChange={(e) => setBatchInput(e.target.value)}
								rows={4}
							/>
						</div>
						<button
							className="flex items-center justify-center px-4 py-2 rounded-[7px] bg-accent text-white text-[12px] font-semibold font-mono tracking-[0.03em] transition-opacity hover:opacity-85 active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed"
							onClick={handleBatch}
							disabled={batch.loading || !batchInput.trim()}
						>
							{batch.loading ? "Processing..." : "Send Batch →"}
						</button>
						<ResultBox state={batch} />
					</div>
				</motion.div>
			</div>
		</div>
	);
}

/* ─── Reusable result display ───────────────────────────────────── */
function ResultBox({ state }: { state: ApiState<any> }) {
	if (!state.loading && !state.data && !state.error) return null;

	if (state.loading) {
		return (
			<div className="bg-surface2 border border-border2 rounded-[7px] px-3.5 py-3 flex flex-col gap-1.5">
				{/* skeleton rows */}
				<div className="animate-shimmer rounded-[6px] h-[13px] w-[55%]" />
				<div className="animate-shimmer rounded-[6px] h-[13px] w-[75%]" />
			</div>
		);
	}

	if (state.error) {
		return (
			<div className="bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.25)] rounded-[7px] px-3.5 py-3 flex flex-col gap-1.5">
				<span className="text-[9px] font-mono font-semibold tracking-[0.12em] text-neg">ERROR</span>
				<pre className="font-mono text-[11px] text-text-muted whitespace-pre-wrap break-all leading-relaxed m-0 max-h-[180px] overflow-y-auto">
					{state.error}
				</pre>
			</div>
		);
	}

	return (
		<motion.div
			className="bg-[rgba(16,185,129,0.04)] border border-[rgba(16,185,129,0.2)] rounded-[7px] px-3.5 py-3 flex flex-col gap-1.5"
			initial={{ opacity: 0, y: 4 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.15 }}
		>
			<span className="text-[9px] font-mono font-semibold tracking-[0.12em] text-pos">RESPONSE</span>
			<pre className="font-mono text-[11px] text-text-muted whitespace-pre-wrap break-all leading-relaxed m-0 max-h-[180px] overflow-y-auto">
				{JSON.stringify(state.data, null, 2)}
			</pre>
		</motion.div>
	);
}