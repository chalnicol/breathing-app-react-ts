import { useEffect } from "react";
import type { RefObject } from "react"; // Explicit type-only import
import { gsap } from "gsap";

export function useSliderAnimation(
	knobRef: RefObject<HTMLDivElement | null>,
	trackRef: RefObject<HTMLDivElement | null>,
	current: number,
	min: number,
	max: number,
) {
	useEffect(() => {
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
	}, [current, min, max, knobRef, trackRef]);
}
