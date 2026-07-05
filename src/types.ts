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
	config: SessionConfig;
	limit: SessionLimit;
}

export type PhaseType = "Inhale" | "Hold" | "Exhale";

export interface Phase {
	text: PhaseType;
	duration: number;
	color: string;
}
