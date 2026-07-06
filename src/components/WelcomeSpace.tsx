import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { PresetPattern, SessionSettings } from "../types";
import SessionInfoModal from "./SessionInfoModal";
import CustomSlider from "./CustomSlider";
import { CORE_PRESETS } from "../constants/presets";

import { useSliderAnimation } from "../hooks/useSliderAnimation";

interface WelcomeProps {
	onStartSession: (settings: SessionSettings) => void;
}

export default function WelcomeSpace({ onStartSession }: WelcomeProps) {
	const [currentIndex, setCurrentIndex] = useState<number>(0);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const [inhale, setInhale] = useState<number>(4);
	const [hold, setHold] = useState<number>(2);
	const [exhale, setExhale] = useState<number>(6);

	const [limitType, setLimitType] = useState<"duration" | "reps">("duration");
	const [duration, setDuration] = useState<number>(300);
	const [reps, setReps] = useState<number>(5);

	const slideTrackRef = useRef<HTMLDivElement>(null);

	const inhaleKnobRef = useRef<HTMLDivElement>(null);
	const inhaleTrackRef = useRef<HTMLDivElement>(null);
	const holdKnobRef = useRef<HTMLDivElement>(null);
	const holdTrackRef = useRef<HTMLDivElement>(null);
	const exhaleKnobRef = useRef<HTMLDivElement>(null);
	const exhaleTrackRef = useRef<HTMLDivElement>(null);
	const limitKnobRef = useRef<HTMLDivElement>(null);
	const limitTrackRef = useRef<HTMLDivElement>(null);

	const matchedPresetIdx = CORE_PRESETS.findIndex(
		(p) => p.inhale === inhale && p.hold === hold && p.exhale === exhale,
	);
	const isCustomActive = matchedPresetIdx === -1;
	const totalAvailableSlides = isCustomActive ? 4 : 3;

	const allSlides: PresetPattern[] = [
		...CORE_PRESETS,
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
			defaultLimitType: limitType,
			defaultLimitValue: limitType === "duration" ? duration : reps,
		},
	];

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
			const target = CORE_PRESETS[index];
			setInhale(target.inhale);
			setHold(target.hold);
			setExhale(target.exhale);
			setLimitType(target.defaultLimitType);
			if (target.defaultLimitType === "duration") {
				setDuration(target.defaultLimitValue);
			} else {
				setReps(target.defaultLimitValue);
			}
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

	// Hooking extracted animation mechanics back into state variants
	useSliderAnimation(inhaleKnobRef, inhaleTrackRef, inhale, 1, 12);
	useSliderAnimation(holdKnobRef, holdTrackRef, hold, 0, 12);
	useSliderAnimation(exhaleKnobRef, exhaleTrackRef, exhale, 1, 16);
	useSliderAnimation(
		limitKnobRef,
		limitTrackRef,
		limitType === "duration" ? duration : reps,
		limitType === "duration" ? 60 : 1,
		limitType === "duration" ? 900 : 20,
	);

	return (
		<div className="fixed inset-0 w-screen h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-2 text-slate-100 font-sans overflow-y-auto selection:bg-emerald-400/20">
			<div className="w-full max-w-md py-1 mx-auto space-y-4">
				<div className="text-center space-y-1">
					<h1 className="text-lg font-black tracking-[0.3em] uppercase font-sans">
						<span className="text-white">Aura</span>
						<span>.</span>
						<span className="text-emerald-400">Drift</span>
					</h1>
					<p className="text-[9px] text-slate-400 font-mono tracking-widest uppercase opacity-75">
						Structural Breath Control
					</p>
				</div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						onStartSession({
							config: { inhale, hold, exhale },
							limit:
								limitType === "duration"
									? { type: "duration", value: duration }
									: { type: "reps", value: reps },
							variation: {
								name: isCustomActive
									? "Custom Calibration"
									: CORE_PRESETS[currentIndex].name,
								tag: isCustomActive
									? "MANUAL PARAMETERS"
									: CORE_PRESETS[currentIndex].tag,
							},
						});
					}}
					className="bg-slate-900/40 border border-slate-900/60 rounded-xl p-4 space-y-3 backdrop-blur-md shadow-xl"
				>
					<div className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
						Select Breathing Variation
					</div>

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
									style={{
										width: `${100 / totalAvailableSlides}%`,
									}}
								>
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

											{/* Explicitly check and skip info marker generation for customization space */}
											{slide.id !== "custom" && (
												<button
													type="button"
													onClick={() => setIsModalOpen(true)}
													className="w-4 h-4 rounded-full bg-slate-700 hover:bg-slate-600 border border-slate-600 flex items-center justify-center text-[9px] font-mono font-bold text-slate-200 transition-colors cursor-pointer shadow-sm shrink-0"
												>
													?
												</button>
											)}
										</div>
										<p className="text-[11px] text-slate-300 leading-normal min-h-[34px]">
											{slide.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

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

					<div className="space-y-3.5 pt-1">
						<CustomSlider
							label="Inhale Phase"
							value={inhale}
							suffix="s"
							min={1}
							max={12}
							onChange={setInhale}
							knobRef={inhaleKnobRef}
							trackRef={inhaleTrackRef}
						/>
						<CustomSlider
							label="Hold Phase"
							value={hold}
							suffix="s"
							min={0}
							max={12}
							onChange={setHold}
							knobRef={holdKnobRef}
							trackRef={holdTrackRef}
						/>
						<CustomSlider
							label="Exhale Phase"
							value={exhale}
							suffix="s"
							min={1}
							max={16}
							onChange={setExhale}
							knobRef={exhaleKnobRef}
							trackRef={exhaleTrackRef}
						/>

						<div className="space-y-3 pt-2 border-t border-slate-950/40">
							<div className="flex justify-between items-center text-[11px]">
								<label className="text-slate-400">Session Limit</label>
								<div className="relative flex bg-slate-950/60 border border-slate-800/60 rounded-md p-0.5">
									<div
										className="absolute inset-y-0.5 left-0.5 w-14 rounded bg-slate-700 border border-slate-600 transition-transform duration-300 ease-out"
										style={{
											transform:
												limitType === "reps"
													? "translateX(100%)"
													: "translateX(0%)",
										}}
									/>
									<button
										type="button"
										onClick={() => setLimitType("duration")}
										className={`relative z-10 w-14 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
											limitType === "duration"
												? "text-slate-100"
												: "text-slate-500 hover:text-slate-300"
										}`}
									>
										Timer
									</button>
									<button
										type="button"
										onClick={() => setLimitType("reps")}
										className={`relative z-10 w-14 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer ${
											limitType === "reps"
												? "text-slate-100"
												: "text-slate-500 hover:text-slate-300"
										}`}
									>
										Reps
									</button>
								</div>
							</div>

							{limitType === "duration" ? (
								<CustomSlider
									label="Duration"
									value={Math.floor(duration / 60)} // Convert seconds to raw minutes value for display
									suffix=" min" // Attach the minutes suffix
									min={1} // Map min to 1 min (60s)
									max={15} // Map max to 15 mins (900s)
									step={1} // Step cleanly by 1 minute increments
									onChange={(mins) => setDuration(mins * 60)} // Convert minutes back to seconds for state tracking
									knobRef={limitKnobRef}
									trackRef={limitTrackRef}
								/>
							) : (
								<CustomSlider
									label="Cycles"
									value={reps}
									suffix={reps === 1 ? " cycle" : " cycles"}
									min={1}
									max={20}
									onChange={setReps}
									knobRef={limitKnobRef}
									trackRef={limitTrackRef}
								/>
							)}
						</div>
					</div>

					<button
						type="submit"
						className="w-full py-2.5 bg-emerald-400 text-slate-950 font-bold text-[10px] tracking-wider rounded-md uppercase hover:bg-emerald-500 transition-all cursor-pointer mt-5 active:scale-[0.99]"
					>
						Start Session
					</button>
				</form>
			</div>

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
