import type { PresetPattern } from "../types";

export const CORE_PRESETS: PresetPattern[] = [
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
		defaultLimitType: "duration",
		defaultLimitValue: 300,
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
		defaultLimitType: "reps",
		defaultLimitValue: 8,
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
		defaultLimitType: "duration",
		defaultLimitValue: 600,
	},
];
