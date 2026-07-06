import { useState, useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import type { Phase, SessionSettings } from "../types";

interface RoomProps {
	settings: SessionSettings;
	onExit: () => void;
}

export default function BreathingRoom({ settings, onExit }: RoomProps) {
	const { variation, config, limit } = settings;

	const phases = useMemo<Phase[]>(() => {
		const activePhases: Phase[] = [];
		if (config.inhale > 0)
			activePhases.push({
				text: "Inhale",
				duration: config.inhale,
				color: "#10b981",
			});
		if (config.hold > 0)
			activePhases.push({
				text: "Hold",
				duration: config.hold,
				color: "#eab308",
			});
		if (config.exhale > 0)
			activePhases.push({
				text: "Exhale",
				duration: config.exhale,
				color: "#1e40af",
			});
		return activePhases;
	}, [config]);

	const [isActive, setIsActive] = useState<boolean>(false);
	const [currentPhaseIdx, setCurrentPhaseIdx] = useState<number>(0);
	const [secondsLeft, setSecondsLeft] = useState<number>(
		phases[0]?.duration || 4,
	);
	const [sessionRemaining, setSessionRemaining] = useState<number>(
		limit.value,
	);
	const [isFinished, setIsFinished] = useState<boolean>(false);

	const arcRef = useRef<SVGCircleElement>(null);
	const sliceRefs = useRef<(SVGPathElement | null)[]>([]);
	const timelineRef = useRef<gsap.core.Timeline | null>(null);

	const currentPhase = phases[currentPhaseIdx];
	const totalSegments = 12;
	const arcRadius = 86;
	const circumference = 2 * Math.PI * arcRadius;

	const formatTime = (totalSecs: number): string => {
		const mins = Math.floor(totalSecs / 60);
		const secs = Math.floor(totalSecs % 60);
		return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
	};

	const masterProgressRatio = useMemo(() => {
		return Math.max(0, Math.min(1, sessionRemaining / limit.value));
	}, [sessionRemaining, limit.value]);

	useEffect(() => {
		if (isFinished) return;

		const tl = gsap.timeline({
			paused: !isActive,
			onUpdate: function () {
				const progress = this.progress();

				// A. Synchronized Outer Arc Tracking
				if (arcRef.current) {
					gsap.set(arcRef.current, {
						strokeDashoffset: circumference - progress * circumference,
					});
				}

				// B. Segment Fill Synchronization
				// Using Math.round (not Math.floor) means the final segment
				// crosses its fill threshold at ~95.8% progress instead of
				// ~99%+, giving it a real window of time to render and paint
				// before the phase ends, instead of racing the finish line.
				const activeCount = Math.min(
					totalSegments,
					Math.round(progress * totalSegments),
				);

				sliceRefs.current.forEach((slice, idx) => {
					if (!slice) return;

					if (idx < activeCount) {
						gsap.set(slice, { opacity: 0.65 });
					} else {
						const baseOpacity = 0.04 + idx * 0.025;
						gsap.set(slice, { opacity: baseOpacity });
					}
				});

				// C. Countdown Tracking
				const remainingSeconds = Math.ceil(
					currentPhase.duration * (1 - progress),
				);
				setSecondsLeft(remainingSeconds === 0 ? 1 : remainingSeconds);
			},
			onComplete: () => {
				if (limit.type === "duration") {
					setSessionRemaining((prev) => {
						const next = prev - currentPhase.duration;
						if (next <= 0) {
							setIsFinished(true);
							setIsActive(false);
							return 0;
						}
						return next;
					});
				}

				const nextIdx = (currentPhaseIdx + 1) % phases.length;
				if (nextIdx === 0 && limit.type === "reps") {
					let finishedReps = false;
					setSessionRemaining((prev) => {
						const next = prev - 1;
						if (next <= 0) finishedReps = true;
						return next;
					});
					if (finishedReps) {
						setIsFinished(true);
						setIsActive(false);
						return;
					}
				}

				setCurrentPhaseIdx(nextIdx);
			},
		});

		tl.to({}, { duration: currentPhase.duration, ease: "none" });
		timelineRef.current = tl;

		return () => {
			tl.kill();
		};
	}, [
		currentPhaseIdx,
		isActive,
		isFinished,
		currentPhase.duration,
		phases.length,
		limit.type,
		circumference,
	]);

	// Flush background opacities and arc after a phase completes.
	// gsap.delayedCall(0, ...) lets GSAP's ticker give the browser one paint
	// tick to actually render the "fully complete" frame (full arc, filled
	// last segment) before we reset everything for the next phase. Without
	// this, the reset happens in the same tick as completion and the
	// "100% filled" moment never gets painted.
	useEffect(() => {
		const call = gsap.delayedCall(0, () => {
			sliceRefs.current.forEach((slice, idx) => {
				if (!slice) return;
				const baseOpacity = 0.04 + idx * 0.025;
				gsap.set(slice, { opacity: baseOpacity });
			});
			if (arcRef.current) {
				gsap.set(arcRef.current, { strokeDashoffset: circumference });
			}
		});

		return () => {
			call.kill();
		};
	}, [currentPhaseIdx, circumference]);

	useEffect(() => {
		if (!isActive || isFinished || limit.type !== "duration") return;

		const interval = setInterval(() => {
			setSessionRemaining((prev) => {
				const next = prev - 1;
				if (next <= 0) {
					setIsFinished(true);
					setIsActive(false);
					return 0;
				}
				return next;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [isActive, isFinished, limit.type]);

	const togglePlayback = () => {
		const targetState = !isActive;
		setIsActive(targetState);
		if (timelineRef.current) {
			if (targetState) timelineRef.current.play();
			else timelineRef.current.pause();
		}
	};

	// Maps coordinates natively to 12 o'clock via the (-90) offset adjustment
	const polarToCartesian = (
		cx: number,
		cy: number,
		r: number,
		angleDegrees: number,
	) => {
		const angleRadians = ((angleDegrees - 90) * Math.PI) / 180.0;
		return {
			x: cx + r * Math.cos(angleRadians),
			y: cy + r * Math.sin(angleRadians),
		};
	};

	const getPieSegmentPath = (startAngle: number, endAngle: number) => {
		const cx = 100;
		const cy = 100;
		const r = 80;
		const start = polarToCartesian(cx, cy, r, startAngle);
		const end = polarToCartesian(cx, cy, r, endAngle - 1.2);
		return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y} Z`;
	};

	if (isFinished) {
		return (
			<div className="fixed inset-0 w-screen h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center m-0 p-4 overflow-hidden select-none">
				<div className="w-full max-w-sm bg-slate-900/40 border border-slate-800 rounded-3xl p-8 text-center space-y-6 backdrop-blur-md">
					<div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-[#10b981] text-2xl">
						✓
					</div>
					<h2 className="text-2xl font-light text-white">
						Session Complete
					</h2>
					<button
						onClick={onExit}
						className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl border border-slate-700/60 transition-colors text-sm cursor-pointer"
					>
						RETURN TO SETTINGS
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="fixed inset-0 w-screen h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center m-0 p-6 overflow-hidden select-none">
			{/* Top HUD Row */}

			<div className="w-full border border-slate-800 bg-slate-900/40 px-3 py-2 rounded max-w-sm">
				<p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">
					Active Profile
				</p>
				<p className="font-mono text-[#10b981] text-sm tracking-wider uppercase font-bold">
					{variation.name || "Custom Calibration"}
				</p>
			</div>

			{/* Top HUD Row */}
			<div className="w-full flex items-center text-sm gap-2 mt-2 max-w-sm">
				<div className="flex-1 border border-slate-800 bg-slate-900/40 px-3 py-2 rounded">
					<p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">
						{limit.type === "duration" ? "Remaining Time" : "Cycles Left"}
					</p>
					<p className="font-mono text-white text-sm tracking-wider uppercase font-bold">
						{limit.type === "duration"
							? formatTime(sessionRemaining)
							: Math.ceil(sessionRemaining)}
					</p>
				</div>

				<div className="flex-1 border border-slate-800 bg-slate-900/40 px-3 py-2 rounded">
					<p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">
						Session Status
					</p>
					<p className="font-mono text-[#10b981] text-sm tracking-wider uppercase font-bold">
						{isActive ? "Active" : "Paused"}
					</p>
				</div>
			</div>

			{/* Session Progress Gauge */}
			<div className="w-full max-w-sm h-1 bg-slate-900 border border-slate-800/40 rounded-full mt-3 overflow-hidden">
				<div
					className="h-full bg-[#10b981] transition-all ease-out duration-300 shadow-[0_0_8px_#10b981]"
					style={{ width: `${masterProgressRatio * 100}%` }}
				/>
			</div>

			{/* Main Face SVG Canvas */}
			<div className="relative flex items-center justify-center w-64 h-64 my-6">
				<svg
					className="w-full h-full transform rotate-0"
					viewBox="0 0 200 200"
				>
					{/* 1. Slices Grid (Removed the duplicate -90 rotation wrapper to fix starting position) */}
					<g>
						{Array.from({ length: totalSegments }).map((_, i) => {
							const startAngle = (i * 360) / totalSegments;
							const endAngle = ((i + 1) * 360) / totalSegments;
							const baseOpacity = 0.04 + i * 0.025;

							return (
								<path
									key={`gsap-pie-${i}`}
									ref={(el) => {
										sliceRefs.current[i] = el;
									}}
									d={getPieSegmentPath(startAngle, endAngle)}
									fill={currentPhase.color}
									style={{ opacity: baseOpacity }}
									className="stroke-slate-950/40 stroke-[0.75px] transition-opacity duration-150 ease-out"
								/>
							);
						})}
					</g>

					{/* 2. Chronograph Outer Tracking Ring */}
					<circle
						ref={arcRef}
						cx="100"
						cy="100"
						r={arcRadius}
						fill="none"
						stroke={currentPhase.color}
						strokeWidth="5"
						strokeDasharray={circumference}
						strokeDashoffset={circumference}
						strokeLinecap="round"
						transform="rotate(-90 100 100)"
						style={{
							opacity: isActive ? 0.95 : 0.2,
							filter: isActive
								? `drop-shadow(0px 0px 4px ${currentPhase.color}50)`
								: "none",
						}}
					/>
				</svg>

				{/* 3. Center Typography Layer */}
				<div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10 select-none">
					<h2
						className="text-xl font-black tracking-widest text-white uppercase"
						style={{
							textShadow:
								"0 2px 10px rgba(2, 6, 23, 1), 0 1px 4px rgba(2, 6, 23, 1)",
						}}
					>
						{isActive ? currentPhase.text : "PAUSED"}
					</h2>
					<p
						className="text-5xl font-black font-mono mt-0.5 tracking-tight text-white"
						style={{
							textShadow:
								"0 3px 12px rgba(2, 6, 23, 1), 0 1px 5px rgba(2, 6, 23, 1)",
						}}
					>
						{secondsLeft}
					</p>
				</div>
			</div>

			{/* Action Interfaces */}
			<div className="flex flex-col items-center gap-3 w-full max-w-sm">
				<button
					onClick={togglePlayback}
					className={`w-full py-3.5 rounded-xl font-medium tracking-wide transition-all text-xs cursor-pointer ${
						isActive
							? "bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800"
							: "bg-[#10b981] text-slate-950 hover:bg-[#059669] font-bold shadow-lg shadow-[#10b981]/15"
					}`}
				>
					{isActive ? "PAUSE SESSION" : "START EXERCISE"}
				</button>

				<button
					onClick={onExit}
					className="w-full py-2.5 text-[11px] font-bold tracking-widest text-[#ff6666] border border-[#ff6666]/20 hover:border-[#ff3333]/50 hover:bg-[#ff3333]/5 rounded-xl transition-all cursor-pointer uppercase"
				>
					Exit Space
				</button>
			</div>
		</div>
	);
}
