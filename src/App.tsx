import WelcomeSpace from "./components/WelcomeSpace";
import BreathingRoom from "./components/BreathingRoom";
import type { SessionSettings } from "./types";
import { useState } from "react";

export default function App() {
	// Keeps track of active session parameters. When null, show the Welcome screen.
	const [activeSettings, setActiveSettings] = useState<SessionSettings | null>(
		null,
	);

	const handleStartSession = (settings: SessionSettings) => {
		setActiveSettings(settings);
	};

	const handleExitSession = () => {
		setActiveSettings(null); // Instantly tears down the session room and unmounts GSAP hooks
	};

	return (
		<main className="w-screen h-screen bg-slate-950 text-slate-100 antialiased overflow-hidden">
			{activeSettings ? (
				<BreathingRoom
					settings={activeSettings}
					onExit={handleExitSession}
				/>
			) : (
				<WelcomeSpace onStartSession={handleStartSession} />
			)}
		</main>
	);
}
