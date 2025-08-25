// src/lib/startTraining.ts
// One place to trigger the global countdown/overlay.
export function startTrainingCountdown() {
  window.dispatchEvent(new Event("start-training-countdown"));
}