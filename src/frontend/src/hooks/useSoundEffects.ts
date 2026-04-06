import { useCallback, useRef } from "react";

export function useSoundEffects() {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback((): AudioContext => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    return ctx;
  }, []);

  const playNote = useCallback(
    (
      ctx: AudioContext,
      freq: number,
      startTime: number,
      duration: number,
      gain: number,
      type: OscillatorType = "sine",
    ) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);
      gainNode.gain.setValueAtTime(gain, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.01);
    },
    [],
  );

  const playCorrect = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;
    playNote(ctx, 523, now, 0.15, 0.5);
    playNote(ctx, 784, now + 0.16, 0.15, 0.5);
  }, [getCtx, playNote]);

  const playWrong = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;
    playNote(ctx, 330, now, 0.2, 0.4, "sawtooth");
    playNote(ctx, 220, now + 0.22, 0.2, 0.4, "sawtooth");
  }, [getCtx, playNote]);

  const playTick = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(800, now);
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }, [getCtx]);

  const playTimeout = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(150, now + 0.5);
    gainNode.gain.setValueAtTime(0.5, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.51);
  }, [getCtx]);

  const playComplete = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const notes = [523, 659, 784, 1046];
    notes.forEach((freq, i) => {
      playNote(ctx, freq, now + i * 0.22, 0.2, 0.5);
    });
  }, [getCtx, playNote]);

  return { playCorrect, playWrong, playTick, playTimeout, playComplete };
}
