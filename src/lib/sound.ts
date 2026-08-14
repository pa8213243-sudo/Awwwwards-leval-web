import { audioManager } from './audio';

export const soundFx = {
  isMuted: () => audioManager.isMuted(),
  toggleMute: () => audioManager.toggleMute(),
  setMuted: (muted: boolean) => audioManager.setMuted(muted),
  playClick: () => audioManager.playClick(),
  playNav: () => audioManager.playNav(),
  playToggle: (isOpen: boolean) => audioManager.playToggle(isOpen),
  playHover: () => audioManager.playHover(),
  playUiHum: (freq?: number, duration?: number) => audioManager.playUiHum(freq, duration),
  playScrollClick: () => audioManager.playScrollClick(),
  playMechanicalClick: (freq?: number) => audioManager.playMechanicalClick(freq),
  playMilestone: (freq?: number) => audioManager.playMilestonePip(freq),
  triggerSectionMilestone: (sectionId: string, milestone: number, freq?: number) =>
    audioManager.triggerSectionMilestone(sectionId, milestone, freq),
  playProgressThresholdTick: (segment: number, percentage?: number) =>
    audioManager.playProgressThresholdTick(segment, percentage),
  playClamp: () => audioManager.playClampingSnap(),
  playButton: (freq?: number, duration?: number) => audioManager.playButton(freq, duration),
};

