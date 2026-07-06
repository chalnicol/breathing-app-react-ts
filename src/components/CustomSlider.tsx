import React from "react";

interface CustomSliderProps {
	label: string;
	value: number;
	suffix: string;
	min: number;
	max: number;
	step?: number;
	onChange: (val: number) => void;
	knobRef: React.RefObject<HTMLDivElement | null>;
	trackRef: React.RefObject<HTMLDivElement | null>;
}

export default function CustomSlider({
	label,
	value,
	suffix,
	min,
	max,
	step = 1,
	onChange,
	knobRef,
	trackRef,
}: CustomSliderProps) {
	return (
		<div className="space-y-1 relative">
			<div className="flex justify-between items-center text-[11px]">
				<label className="text-slate-400">{label}</label>
				<span className="text-white font-mono font-bold">
					{value}
					{suffix}
				</span>
			</div>
			<div className="relative w-full h-1 flex items-center">
				{/* Absolute Hardware Knob Layer */}
				<div
					ref={knobRef}
					className="absolute w-2.5 h-2.5 bg-white rounded-sm shadow pointer-events-none z-10"
				/>
				{/* Invisible Core Native Range Component */}
				<input
					type="range"
					min={min}
					max={max}
					step={step}
					value={value}
					onChange={(e) => onChange(Number(e.target.value))}
					className="w-full absolute inset-0 opacity-0 cursor-pointer h-full z-20"
				/>
				{/* Custom Visual Track Vector Backing */}
				<div className="w-full h-[3px] bg-slate-800 rounded-sm overflow-hidden relative">
					<div
						ref={trackRef}
						className="h-full bg-white absolute left-0 top-0 w-0"
					/>
				</div>
			</div>
		</div>
	);
}
