import { useState } from "react";
import BreathingSettings from "./components/BreathingSettings";
import BreathingRoom from "./components/BreathingRoom";
import type { SessionSettings } from "./types";

export default function App() {
	const [sessionSettings, setSessionSettings] =
		useState<SessionSettings | null>(null);

	return (
		<main className="min-h-screen bg-slate-950 selection:bg-emerald-500/30">
			{sessionSettings ? (
				<BreathingRoom
					settings={sessionSettings}
					onExit={() => setSessionSettings(null)}
				/>
			) : (
				<BreathingSettings
					onStart={(settings) => setSessionSettings(settings)}
				/>
			)}
		</main>
	);
}
