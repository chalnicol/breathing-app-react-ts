export interface SessionConfig {
	inhale: number;
	hold: number;
	exhale: number;
}

export interface SessionLimit {
	type: "duration" | "reps";
	value: number;
}

export interface SessionSettings {
	variation: {
		name: string;
		tag: string;
	};
	config: SessionConfig;
	limit: SessionLimit;
}

export type PhaseType = "Inhale" | "Hold" | "Exhale";

export interface Phase {
	text: PhaseType;
	duration: number;
	color: string;
}

export interface PresetPattern {
	id: string;
	name: string;
	tag: string;
	description: string;
	scienceDetail: string;
	guidelines: string[];
	inhale: number;
	hold: number;
	exhale: number;
	defaultLimitType: "duration" | "reps";
	defaultLimitValue: number;
}
