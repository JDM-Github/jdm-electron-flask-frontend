import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import RequestHandler from "../lib/utilities/request_handler";

const ROUTE_META: Record<string, { title: string }> = {
    "/": { title: "Dashboard" },
    "/page-one": { title: "Page One" },
    "/page-two": { title: "Page Two" },
    "/settings": { title: "Settings" },
};

type HealthStatus = "checking" | "online" | "offline";

const STATUS_CFG: Record<HealthStatus, { label: string; color: string; ping: boolean }> = {
    checking: { label: "CHECKING", color: "var(--color-neu)", ping: true },
    online: { label: "API ONLINE", color: "var(--color-pos)", ping: true },
    offline: { label: "API OFFLINE", color: "var(--color-neg)", ping: false },
};

const POLL_MS = 20_000;

function useHealthCheck() {
    const [status, setStatus] = useState<HealthStatus>("checking");
    const timer = useRef<ReturnType<typeof setInterval> | null>(null);

    const check = async () => {
        try {
            const data = await RequestHandler.fetchData("GET", "health");
            setStatus(data?.success === false ? "offline" : "online");
        } catch {
            setStatus("offline");
        }
    };

    useEffect(() => {
        check();
        timer.current = setInterval(check, POLL_MS);
        return () => { if (timer.current) clearInterval(timer.current); };
    }, []);

    return status;
}

function StatusDot({ color, ping }: { color: string; ping: boolean }) {
    return (
        <span className="relative inline-flex w-1.5 h-1.5">
            {ping && (
                <span
                    className="absolute inset-0 rounded-full opacity-40"
                    style={{ background: color, animation: "healthPing 1.4s ease-out infinite" }}
                />
            )}
            <span
                className="relative inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: color }}
            />
        </span>
    );
}

export default function Header() {
    const { pathname } = useLocation();
    const meta = ROUTE_META[pathname] ?? { title: "AppName" };
    const status = useHealthCheck();
    const cfg = STATUS_CFG[status];

    return (
        <motion.header
            className="h-[52px] flex items-center justify-between px-6 bg-surface border-b border-border sticky top-0 z-40 shrink-0"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.22, delay: 0.05 }}
        >
            {/* Left */}
            <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-text-muted tracking-[0.04em]">
                    APPNAME &nbsp;/&nbsp;
                    <span className="text-text font-semibold">{meta.title.toUpperCase()}</span>
                </span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={status}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-surface3 border border-border2 text-[9px] font-mono tracking-[0.06em]"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.12 }}
                        style={{ color: cfg.color }}
                    >
                        <StatusDot color={cfg.color} ping={cfg.ping} />
                        {cfg.label}
                    </motion.div>
                </AnimatePresence>

                <span className="px-[9px] py-1 rounded-[5px] bg-surface3 border border-border text-[9px] font-mono text-text-faint">
                    v1.0.0
                </span>
            </div>
        </motion.header>
    );
}