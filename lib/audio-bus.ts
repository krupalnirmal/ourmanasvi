/**
 * Tiny app-wide audio coordinator: only one track may play at a time.
 * When something starts (banner music, story player…), whatever was playing
 * before is paused and told to update its own UI.
 */
type Stopper = () => void;

let current: { id: string; stop: Stopper } | null = null;

/** Claim playback for `id`, stopping whoever held it before. */
export function claimAudio(id: string, stop: Stopper) {
  if (current && current.id !== id) current.stop();
  current = { id, stop };
}

/** Release playback if `id` still holds it. */
export function releaseAudio(id: string) {
  if (current?.id === id) current = null;
}
