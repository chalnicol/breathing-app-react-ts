import React, { useState } from "react";
import type { SessionSettings } from "../types";

interface SettingsProps {
	onStart: (settings: SessionSettings) => void;
}

export default function BreathingSettings({ onStart }: SettingsProps) {
	const [inhale, setInhale] = useState<number>(4);
	const [hold, setHold] = useState<number>(2);
	const [exhale, setExhale] = useState<number>(6);

	const [limitType, setLimitType] = useState<"duration" | "reps">("duration");
	const [duration, setDuration] = useState<number>(5);
	const [reps, setReps] = useState<number>(20);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onStart({
			config: { inhale, hold, exhale },
			limit: {
				type: limitType,
				value: limitType === "duration" ? duration * 60 : reps,
			},
			variation: {
				name: "Custom Calibration",
				tag: "MANUAL PARAMETERS",
			},
		});
	};

	return (
		<div className="fixed inset-0 w-screen h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center m-0 p-4 overflow-hidden select-none">
			<div className="w-full max-w-sm bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
				<div className="mb-6 text-center">
					<h1 className="text-xl font-light tracking-wide text-white">
						Configure Session
					</h1>
					<p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">
						Set your rhythm
					</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Inhale */}
					<div className="space-y-1">
						<div className="flex justify-between items-center text-xs">
							<label className="text-slate-400 font-medium">
								Inhale Duration
							</label>
							<span className="font-mono text-slate-300 font-semibold text-sm">
								{inhale}s
							</span>
						</div>
						<input
							type="range"
							min="1"
							max="12"
							value={inhale}
							onChange={(e) => setInhale(Number(e.target.value))}
							className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
						/>
					</div>

					{/* Hold */}
					<div className="space-y-1">
						<div className="flex justify-between items-center text-xs">
							<label className="text-slate-400 font-medium">
								Hold Duration
							</label>
							<span className="font-mono text-slate-300 font-semibold text-sm">
								{hold}s
							</span>
						</div>
						<input
							type="range"
							min="0"
							max="12"
							value={hold}
							onChange={(e) => setHold(Number(e.target.value))}
							className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
						/>
					</div>

					{/* Exhale */}
					<div className="space-y-1">
						<div className="flex justify-between items-center text-xs">
							<label className="text-slate-400 font-medium">
								Exhale Duration
							</label>
							<span className="font-mono text-slate-300 font-semibold text-sm">
								{exhale}s
							</span>
						</div>
						<input
							type="range"
							min="1"
							max="12"
							value={exhale}
							onChange={(e) => setExhale(Number(e.target.value))}
							className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
						/>
					</div>

					<hr className="border-slate-800/50 my-2" />

					{/* Session Limit Selection */}
					<div className="space-y-3">
						<div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800/50">
							<button
								type="button"
								onClick={() => setLimitType("duration")}
								className={`flex-1 py-1.5 text-xs font-medium tracking-wide rounded-md transition-all ${
									limitType === "duration"
										? "bg-slate-800 text-white shadow-sm font-semibold"
										: "text-slate-400"
								}`}
							>
								TIME DURATION
							</button>
							<button
								type="button"
								onClick={() => setLimitType("reps")}
								className={`flex-1 py-1.5 text-xs font-medium tracking-wide rounded-md transition-all ${
									limitType === "reps"
										? "bg-slate-800 text-white shadow-sm font-semibold"
										: "text-slate-400"
								}`}
							>
								REPETITIONS
							</button>
						</div>

						{limitType === "duration" ? (
							<div className="space-y-1">
								<div className="flex justify-between items-center text-xs">
									<label className="text-slate-400">
										Total Time Target
									</label>
									<span className="font-mono text-white text-xs">
										{duration} mins
									</span>
								</div>
								<input
									type="range"
									min="1"
									max="20"
									value={duration}
									onChange={(e) => setDuration(Number(e.target.value))}
									className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
								/>
							</div>
						) : (
							<div className="space-y-1">
								<div className="flex justify-between items-center text-xs">
									<label className="text-slate-400">
										Total Cycles (Reps)
									</label>
									<span className="font-mono text-white text-xs">
										{reps} cycles
									</span>
								</div>
								<input
									type="range"
									min="5"
									max="50"
									step="5"
									value={reps}
									onChange={(e) => setReps(Number(e.target.value))}
									className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
								/>
							</div>
						)}
					</div>

					<button
						type="submit"
						className="w-full py-3.5 mt-2 bg-[#10b981] hover:bg-[#0d9488] text-slate-950 font-bold tracking-wide rounded-xl shadow-lg shadow-[#10b981]/15 transition-colors text-xs cursor-pointer"
					>
						BEGIN EXERCISE
					</button>
				</form>
			</div>
		</div>
	);
}
