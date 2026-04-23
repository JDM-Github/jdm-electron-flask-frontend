export default function Footer() {
    return (
        <footer className="h-[40px] flex items-center justify-between px-7 border-t border-border mt-7 shrink-0">
            <span className="text-[10px] font-mono text-text-faint tracking-[0.06em]">
                JDM · Flask &amp; Electron Template
            </span>
            <div className="flex items-center gap-[18px]">
                {["Docs", "GitHub", "Support"].map((link) => (
                    <span
                        key={link}
                        className="text-[10px] font-mono text-text-muted cursor-pointer transition-colors hover:text-accent"
                    >
                        {link}
                    </span>
                ))}
            </div>
        </footer>
    );
}