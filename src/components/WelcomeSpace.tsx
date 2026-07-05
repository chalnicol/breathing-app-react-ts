import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { SessionSettings } from "../types";
import SessionInfoModal from "./SessionInfoModal";

interface WelcomeProps {
	onStartSession: (settings: SessionSettings) => void;
}

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

export default function WelcomeSpace({ onStartSession }: WelcomeProps) {
	const corePresets: PresetPattern[] = [
		{
			id: "cardiac",
			name: "The 4-2-6 Rhythm Flow",
			tag: "CARDIAC BALANCED",
			description:
				"Engineered specifically to maximize cardiac resonance by extending the exhalation window.",
			scienceDetail:
				"Extending your exhalation phase leverages your vagus nerve to slow your heart rate, lower vascular tension, and optimize heart rate variability (HRV) within minutes.",
			guidelines: [
				"Breathe deep into your lower belly, not your upper shoulders.",
				"Inhale through your nose to increase systemic nitric oxide absorption.",
				"Treat the 6-second exhalation phase like a slow mechanical release.",
			],
			inhale: 4,
			hold: 2,
			exhale: 6,
		},
		{
			id: "box",
			name: "The 4-4-4 Tactical Box",
			tag: "COGNITIVE CLARITY",
			description:
				"The global operational standard for high-stress environments and sudden adrenaline surges.",
			scienceDetail:
				"Box breathing uses perfectly symmetrical intervals to clear carbon dioxide and normalize blood gas ratios. This halts the production of acute stress biomarkers.",
			guidelines: [
				"Maintain a steady, mechanical count across all four corners.",
				"Keep the hold phases relaxed; do not clamp your throat shut.",
				"Use this pattern to reset your focus before deep work or high-stakes tasks.",
			],
			inhale: 4,
			hold: 4,
			exhale: 4,
		},
		{
			id: "sedation",
			name: "The 7-4-8 Sleep Prep",
			tag: "DEEP SEDATION",
			description:
				"An ultra-slow structural pattern designed to neutralize anxiety loops and prime the brain for rest.",
			scienceDetail:
				"By forcing an exceptionally long 7-second pull and a slow 8-second release, you clear latent residual tension from the intercostal muscle groups.",
			guidelines: [
				"Perform this cycle while seated comfortably or lying completely flat.",
				"Allow your body to sink heavily into the surface on the 8-second exhale.",
				"Excellent for combatting insomnia or quietening over-active racing thoughts.",
			],
			inhale: 7,
			hold: 4,
			exhale: 8,
		},
	];

	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const [inhale, setInhale] = useState<number>(4);
	const [hold, setHold] = useState<number>(2);
	const [exhale, setExhale] = useState<number>(6);
	const [duration, setDuration] = useState<number>(300);

	const slideTrackRef = useRef<HTMLDivElement>(null);
	const modalOverlayRef = useRef<HTMLDivElement>(null);
	const modalBoxRef = useRef<HTMLDivElement>(null);
	const metricGridRef = useRef<HTMLDivElement>(null);

	const inhaleKnobRef = useRef<HTMLDivElement>(null);
	const inhaleTrackRef = useRef<HTMLDivElement>(null);
	const holdKnobRef = useRef<HTMLDivElement>(null);
	const holdTrackRef = useRef<HTMLDivElement>(null);
	const exhaleKnobRef = useRef<HTMLDivElement>(null);
	const exhaleTrackRef = useRef<HTMLDivElement>(null);

	const matchedPresetIdx = corePresets.findIndex(
		(p) => p.inhale === inhale && p.hold === hold && p.exhale === exhale,
	);
	const isCustomActive = matchedPresetIdx === -1;
	const totalAvailableSlides = isCustomActive ? 4 : 3;

	const allSlides: PresetPattern[] = [
		...corePresets,
		{
			id: "custom",
			name: "Custom Calibration Space",
			tag: "MANUAL PARAMETERS",
			description: `User defined ratio loop configured via tuning modules. Current pacing is ${inhale}-${hold}-${exhale}.`,
			scienceDetail:
				"You are manipulating structural blood chemistry balance coordinates manually. Shorter loops stimulate heart speeds; extended cycles trigger rapid neural sedation paths.",
			guidelines: [
				"Ensure the custom rhythm feels comfortable across long periods.",
				"Do not force extended breath hold cycles beyond physical baseline comfort.",
				"Tweak configuration controls below to re-verify operational metrics.",
			],
			inhale,
			hold,
			exhale,
		},
	];

	// Moves the track by exactly one slide-width, expressed as a percentage
	// of the TRACK's own width (which is total * 100%). This is the part
	// that was broken before — it assumed each slide was 100% of the
	// container, which only holds true by coincidence.
	const animateTrackTo = (index: number, total: number) => {
		if (!slideTrackRef.current) return;
		gsap.to(slideTrackRef.current, {
			xPercent: -(index * (100 / total)),
			duration: 0.4,
			ease: "power3.out",
		});
	};

	const selectSlide = (index: number) => {
		if (index < 0 || index >= totalAvailableSlides) return;
		setCurrentIndex(index);
		animateTrackTo(index, totalAvailableSlides);

		if (index < 3) {
			const target = corePresets[index];
			setInhale(target.inhale);
			setHold(target.hold);
			setExhale(target.exhale);
		}
	};

	useEffect(() => {
		if (isCustomActive) {
			setCurrentIndex(3);
			animateTrackTo(3, totalAvailableSlides);
		} else {
			setCurrentIndex(matchedPresetIdx);
			animateTrackTo(matchedPresetIdx, totalAvailableSlides);
		}
	}, [
		inhale,
		hold,
		exhale,
		isCustomActive,
		matchedPresetIdx,
		totalAvailableSlides,
	]);

	const updateSliderVisuals = (
		knobRef: React.RefObject<HTMLDivElement | null>,
		trackRef: React.RefObject<HTMLDivElement | null>,
		current: number,
		max: number,
		min = 0,
	) => {
		if (!knobRef.current || !trackRef.current) return;
		const percentage = ((current - min) / (max - min)) * 100;

		gsap.to(knobRef.current, {
			left: `${percentage}%`,
			xPercent: -50,
			duration: 0.2,
			ease: "power2.out",
			overwrite: "auto",
		});
		gsap.to(trackRef.current, {
			width: `${percentage}%`,
			duration: 0.2,
			ease: "power2.out",
			overwrite: "auto",
		});
	};

	useEffect(() => {
		updateSliderVisuals(inhaleKnobRef, inhaleTrackRef, inhale, 12, 1);
	}, [inhale]);
	useEffect(() => {
		updateSliderVisuals(holdKnobRef, holdTrackRef, hold, 12, 0);
	}, [hold]);
	useEffect(() => {
		updateSliderVisuals(exhaleKnobRef, exhaleTrackRef, exhale, 16, 1);
	}, [exhale]);

	useEffect(() => {
		if (isModalOpen) {
			const tl = gsap.timeline();
			tl.to(modalOverlayRef.current, {
				opacity: 1,
				duration: 0.2,
				ease: "power1.out",
			}).fromTo(
				modalBoxRef.current,
				{ y: 15, scale: 0.98, opacity: 0 },
				{ y: 0, scale: 1, opacity: 1, duration: 0.25, ease: "power3.out" },
				"-=0.05",
			);

			if (metricGridRef.current) {
				metricGridRef.current
					.querySelectorAll(".metric-val")
					.forEach((el) => {
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
		}
	}, [isModalOpen]);

	const closeModal = () => {
		gsap.to(modalBoxRef.current, {
			y: 10,
			opacity: 0,
			scale: 0.99,
			duration: 0.15,
			ease: "power2.in",
			onComplete: () => {
				gsap.to(modalOverlayRef.current, {
					opacity: 0,
					duration: 0.1,
					onComplete: () => setIsModalOpen(false),
				});
			},
		});
	};

	return (
		<div className="fixed inset-0 w-screen h-screen bg-slate-950 text-slate-100 font-sans flex flex-col items-center justify-center m-0 p-4 overflow-y-auto selection:bg-emerald-400/20">
			<div className="w-full max-w-sm space-y-3 py-1">
				{/* Main Base Title Header */}
				<div className="text-center">
					<h1 className="text-base font-black tracking-widest text-white uppercase">
						Breathe
					</h1>
					<p className="text-[9px] text-slate-500 font-mono tracking-wider">
						Pacing Layout Engine
					</p>
				</div>

				{/* --- DENSE UNIFIED CHASSIS --- */}
				<form
					onSubmit={(e) => {
						e.preventDefault();
						onStartSession({
							config: { inhale, hold, exhale },
							limit: { type: "duration", value: duration },
						});
					}}
					className="bg-slate-900/40 border border-slate-900/60 rounded-xl p-4 space-y-3 backdrop-blur-md shadow-xl"
				>
					{/* Explicit Subsection Functional Label */}
					<div className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
						Select Breathing Variation
					</div>

					{/* Deck viewport — this is JUST a clipping window now, no bg/border of its own */}
					<div className="w-full overflow-hidden relative">
						<div
							ref={slideTrackRef}
							className="flex items-stretch transition-none"
							style={{ width: `${totalAvailableSlides * 100}%` }}
						>
							{allSlides.slice(0, totalAvailableSlides).map((slide) => (
								<div
									key={slide.id}
									className="shrink-0 px-1"
									style={{ width: `${100 / totalAvailableSlides}%` }}
								>
									{/* Each slide gets its own frame + lighter fill */}
									<div
										className={`h-full rounded-lg border p-3 space-y-1.5 shadow-inner ${
											slide.id === "custom"
												? "bg-amber-500/10 border-amber-500/20"
												: "bg-slate-800/60 border-slate-700/50"
										}`}
									>
										<div className="flex justify-between items-start w-full gap-4">
											<div className="space-y-0.5 flex-1">
												<span
													className={`text-[9px] font-mono font-bold uppercase tracking-wider ${
														slide.id === "custom"
															? "text-amber-400"
															: "text-emerald-400"
													}`}
												>
													{slide.tag}
												</span>
												<h3 className="text-xs font-bold text-white uppercase tracking-tight">
													{slide.name}
												</h3>
											</div>

											{/* Perfect Circle Information Button */}
											<button
												type="button"
												onClick={() => setIsModalOpen(true)}
												className="w-4 h-4 rounded-full bg-slate-700 hover:bg-slate-600 border border-slate-600 flex items-center justify-center text-[9px] font-mono font-bold text-slate-200 transition-colors cursor-pointer shadow-sm shrink-0"
											>
												?
											</button>
										</div>

										<p className="text-[11px] text-slate-300 leading-normal min-h-[34px]">
											{slide.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* High-Visibility Clean Bordered Navigation Elements */}
					<div className="flex justify-between items-center pb-2 border-b border-slate-950/60 text-[10px] font-mono">
						<button
							type="button"
							disabled={currentIndex === 0}
							onClick={() => selectSlide(currentIndex - 1)}
							className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:border-slate-850 text-slate-300 disabled:text-slate-600 font-bold uppercase tracking-wider disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
						>
							<svg
								className="w-3 h-3 fill-none stroke-current stroke-[2.5]"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M15.75 19.5L8.25 12l7.5-7.5"
								/>
							</svg>
							<span>PREV</span>
						</button>

						{/* Nav Track Matrix Indicators */}
						<div className="flex gap-1 items-center">
							{Array.from({ length: totalAvailableSlides }).map(
								(_, idx) => (
									<button
										key={`dot-${idx}`}
										type="button"
										onClick={() => selectSlide(idx)}
										className={`transition-all cursor-pointer h-1 ${
											currentIndex === idx
												? idx === 3
													? "bg-amber-400 w-2.5"
													: "bg-emerald-400 w-2.5"
												: "bg-slate-800 w-1 hover:bg-slate-600"
										}`}
									/>
								),
							)}
						</div>

						<button
							type="button"
							disabled={currentIndex === totalAvailableSlides - 1}
							onClick={() => selectSlide(currentIndex + 1)}
							className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:border-slate-850 text-slate-300 disabled:text-slate-600 font-bold uppercase tracking-wider disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
						>
							<span>NEXT</span>
							<svg
								className="w-3 h-3 fill-none stroke-current stroke-[2.5]"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M8.25 4.5l7.5 7.5-7.5 7.5"
								/>
							</svg>
						</button>
					</div>

					{/* Section C: Parameter Adjustment Modules (High-Contrast Bars) */}
					<div className="space-y-3.5 pt-1">
						{/* Inhale */}
						<div className="space-y-1 relative">
							<div className="flex justify-between items-center text-[11px]">
								<label className="text-slate-400">Inhale Phase</label>
								<span className="text-white font-mono font-bold">
									{inhale}s
								</span>
							</div>
							<div className="relative w-full h-1 flex items-center">
								<div
									ref={inhaleKnobRef}
									className="absolute w-2.5 h-2.5 bg-white rounded-sm shadow pointer-events-none z-10"
								/>
								<input
									type="range"
									min="1"
									max="12"
									value={inhale}
									onChange={(e) => setInhale(Number(e.target.value))}
									className="w-full absolute inset-0 opacity-0 cursor-pointer h-full z-20"
								/>
								<div className="w-full h-[3px] bg-slate-800 rounded-sm overflow-hidden relative">
									<div
										ref={inhaleTrackRef}
										className="h-full bg-white absolute left-0 top-0 w-0"
									/>
								</div>
							</div>
						</div>

						{/* Hold */}
						<div className="space-y-1 relative">
							<div className="flex justify-between items-center text-[11px]">
								<label className="text-slate-400">Hold Phase</label>
								<span className="text-slate-300 font-mono font-bold">
									{hold}s
								</span>
							</div>
							<div className="relative w-full h-1 flex items-center">
								<div
									ref={holdKnobRef}
									className="absolute w-2.5 h-2.5 bg-white rounded-sm shadow pointer-events-none z-10"
								/>
								<input
									type="range"
									min="0"
									max="12"
									value={hold}
									onChange={(e) => setHold(Number(e.target.value))}
									className="w-full absolute inset-0 opacity-0 cursor-pointer h-full z-20"
								/>
								<div className="w-full h-[3px] bg-slate-800 rounded-sm overflow-hidden relative">
									<div
										ref={holdTrackRef}
										className="h-full bg-white absolute left-0 top-0 w-0"
									/>
								</div>
							</div>
						</div>

						{/* Exhale */}
						<div className="space-y-1 relative">
							<div className="flex justify-between items-center text-[11px]">
								<label className="text-slate-400">Exhale Phase</label>
								<span className="text-slate-300 font-mono font-bold">
									{exhale}s
								</span>
							</div>
							<div className="relative w-full h-1 flex items-center">
								<div
									ref={exhaleKnobRef}
									className="absolute w-2.5 h-2.5 bg-white rounded-sm shadow pointer-events-none z-10"
								/>
								<input
									type="range"
									min="1"
									max="16"
									value={exhale}
									onChange={(e) => setExhale(Number(e.target.value))}
									className="w-full absolute inset-0 opacity-0 cursor-pointer h-full z-20"
								/>
								<div className="w-full h-[3px] bg-slate-800 rounded-sm overflow-hidden relative">
									<div
										ref={exhaleTrackRef}
										className="h-full bg-white absolute left-0 top-0 w-0"
									/>
								</div>
							</div>
						</div>

						{/* Session Duration Selector */}
						<div className="space-y-1.5 pt-2 border-t border-slate-950/40">
							<div className="flex justify-between items-center text-[11px]">
								<label className="text-slate-400">Session Limit</label>
								<span className="text-slate-200 font-bold">
									{Math.floor(duration / 60)} min
								</span>
							</div>
							<input
								type="range"
								min="60"
								max="900"
								step="60"
								value={duration}
								onChange={(e) => setDuration(Number(e.target.value))}
								className="w-full h-[3px] bg-slate-800 rounded-sm appearance-none cursor-pointer accent-slate-400"
							/>
						</div>
					</div>

					<button
						type="submit"
						className="w-full py-2.5 bg-emerald-400 text-slate-950 font-bold text-[10px] tracking-wider rounded-md uppercase hover:bg-emerald-500 transition-all cursor-pointer mt-1 active:scale-[0.99]"
					>
						Start Session
					</button>
				</form>
			</div>

			{/* --- RESPONSIVE LOW-RADIUS MODAL --- */}

			{isModalOpen && (
				<SessionInfoModal
					isOpen={isModalOpen}
					slide={allSlides[currentIndex]}
					onClose={() => setIsModalOpen(false)}
				/>
			)}
		</div>
	);
}
