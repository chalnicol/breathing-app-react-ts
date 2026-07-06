import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface PresetPattern {
	id: string;
	name: string;
	tag: string;
	description: string;
	scienceDetail: string;
	guidelines: string[];
	inhale: number;
	hold: number;
	exhale: number;
}

interface SessionInfoModalProps {
	isOpen: boolean;
	slide: PresetPattern;
	onClose: () => void;
}

export default function SessionInfoModal({
	isOpen,
	slide,
	onClose,
}: SessionInfoModalProps) {
	const overlayRef = useRef<HTMLDivElement>(null);
	const boxRef = useRef<HTMLDivElement>(null);
	const metricGridRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isOpen) return;

		const tl = gsap.timeline();
		tl.to(overlayRef.current, {
			opacity: 1,
			duration: 0.2,
			ease: "power1.out",
		}).fromTo(
			boxRef.current,
			{ y: "-100vh", opacity: 0 },
			{ y: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
			"-=0.05",
		);

		if (metricGridRef.current) {
			metricGridRef.current.querySelectorAll(".metric-val").forEach((el) => {
				const targetVal = parseInt(
					el.getAttribute("data-target") || "0",
					10,
				);
				const counter = { val: 0 };
				gsap.to(counter, {
					val: targetVal,
					duration: 0.4,
					ease: "power2.out",
					onUpdate: () => {
						el.textContent = `${Math.floor(counter.val)}s`;
					},
				});
			});
		}
	}, [isOpen, slide]);

	const handleClose = () => {
		const tl = gsap.timeline({
			onComplete: onClose,
		});
		tl.to(boxRef.current, {
			y: "100vh",
			opacity: 0,
			duration: 0.4,
			ease: "power2.in",
		}).to(
			overlayRef.current,
			{
				opacity: 0,
				duration: 0.15,
			},
			"-=0.2",
		);
	};

	if (!isOpen) return null;

	const isCustom = slide.id === "custom";

	return (
		<div
			ref={overlayRef}
			style={{ opacity: 0 }}
			className="fixed inset-0 w-screen h-screen bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
		>
			<div
				ref={boxRef}
				className="bg-slate-900 border border-slate-800/80 w-full max-w-md rounded-xl p-4 flex flex-col max-h-[calc(100vh-2rem)] shadow-2xl"
			>
				{/* Modal Header */}
				<div className="flex justify-between items-center border-b border-slate-800 pb-2 shrink-0">
					<div>
						<span
							className={`text-[9px] font-mono font-bold rounded border px-1.5 py-0.5 ${
								isCustom
									? "bg-amber-500/10 text-amber-400 border-amber-500/20"
									: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
							}`}
						>
							{slide.tag}
						</span>
						<h2 className="text-sm font-bold text-white mt-1">
							{slide.name}
						</h2>
					</div>
					<button
						type="button"
						onClick={handleClose}
						className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xs p-1"
					>
						✕
					</button>
				</div>

				{/* Modal Internal Track */}
				<div className="flex-1 overflow-y-auto py-3 space-y-3.5 scrollbar-none">
					<div className="p-2.5 bg-amber-500/5 border border-amber-500/10 rounded-md space-y-0.5">
						<div className="text-amber-400 text-[9px] font-mono font-bold uppercase tracking-wider">
							⚠️ Safety Advisory
						</div>
						<p className="text-[10px] text-amber-200/60 leading-normal">
							Do not practice deep hold sequences while operating
							mechanical hardware. Drop loop if dizziness manifests.
						</p>
					</div>

					<div className="space-y-1">
						<h4 className="text-[9px] uppercase tracking-widest font-mono text-slate-500 font-bold">
							Interval Architecture
						</h4>
						<div
							ref={metricGridRef}
							className="w-full grid grid-cols-3 gap-2 bg-slate-950/60 border border-slate-950 rounded-md p-2 text-center font-mono text-xs"
						>
							<div>
								<p className="text-[9px] uppercase tracking-widest text-slate-500">
									Inhale
								</p>
								<p
									className="metric-val text-xs font-bold text-white"
									data-target={slide.inhale}
								>
									0s
								</p>
							</div>
							<div className="border-x border-slate-800/40">
								<p className="text-[9px] uppercase tracking-widest text-slate-500">
									Hold
								</p>
								<p
									className="metric-val text-xs font-bold text-amber-400"
									data-target={slide.hold}
								>
									0s
								</p>
							</div>
							<div>
								<p className="text-[9px] uppercase tracking-widest text-slate-500">
									Exhale
								</p>
								<p
									className="metric-val text-xs font-bold text-blue-400"
									data-target={slide.exhale}
								>
									0s
								</p>
							</div>
						</div>
					</div>

					<div className="space-y-1">
						<h4 className="text-[9px] uppercase tracking-widest font-mono text-slate-500 font-bold">
							Neurological Impact
						</h4>
						<p className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/30 border border-slate-950/60 p-2.5 rounded-md">
							{slide.scienceDetail}
						</p>
					</div>

					<div className="space-y-1">
						<h4 className="text-[9px] uppercase tracking-widest font-mono text-slate-500 font-bold">
							Operational Guidelines
						</h4>
						<div className="grid gap-1">
							{slide.guidelines.map((tip, i) => (
								<div
									key={i}
									className="p-2 bg-slate-950/10 border border-slate-950 rounded-md flex gap-2 items-start text-[11px]"
								>
									<span className="text-slate-600 font-mono text-[9px]">
										0{i + 1}
									</span>
									<p className="text-slate-300 leading-normal">
										{tip}
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
