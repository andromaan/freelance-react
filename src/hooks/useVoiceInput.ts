import { useState, useRef, useCallback, useEffect } from "react";

// ────────────────────────────────────────────────────────────
// Browser Web Speech API availability check
// ────────────────────────────────────────────────────────────
const SpeechRecognitionAPI =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const hasNativeSpeech = !!SpeechRecognitionAPI;
const hasMediaRecorder = !!window.MediaRecorder;

export type VoiceInputStatus =
  | "idle"
  | "loading"      // Whisper model is being downloaded (Firefox)
  | "listening"
  | "processing"   // Audio is being transcribed (Firefox)
  | "error"
  | "unsupported";

interface UseVoiceInputOptions {
  onTranscript: (text: string) => void;
  onStatusMessage?: (msg: string) => void;
  lang?: string;
}

// ────────────────────────────────────────────────────────────
// Native Web Speech API path (Chrome / Edge / Safari)
// ────────────────────────────────────────────────────────────
function useNativeSpeech({ onTranscript, lang }: UseVoiceInputOptions) {
  const [status, setStatus] = useState<VoiceInputStatus>("idle");
  const [interimText, setInterimText] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => () => recognitionRef.current?.abort(), []);

  const start = useCallback(() => {
    if (status === "listening") return;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = lang ?? "uk-UA";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => { setStatus("listening"); setInterimText(""); };

    recognition.onresult = (event: any) => {
      let interim = ""; let final = "";
      for (let i = 0; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) final += r[0].transcript;
        else interim += r[0].transcript;
      }
      setInterimText(interim);
      if (final) { onTranscript(final.trim()); setInterimText(""); }
    };

    recognition.onerror = (event: any) => {
      if (event.error !== "aborted") {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 2000);
      } else {
        setStatus("idle");
      }
      setInterimText("");
    };

    recognition.onend = () => {
      setStatus((prev) => (prev === "listening" ? "idle" : prev));
      setInterimText("");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [status, onTranscript, lang]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setStatus("idle");
    setInterimText("");
  }, []);

  const toggle = useCallback(() => {
    status === "listening" ? stop() : start();
  }, [status, start, stop]);

  return { status, interimText, toggle, start, stop };
}

// ────────────────────────────────────────────────────────────
// Whisper (MediaRecorder + Web Worker) path — Firefox fallback
// ────────────────────────────────────────────────────────────
function useWhisperSpeech({ onTranscript, onStatusMessage, lang }: UseVoiceInputOptions) {
  const [status, setStatus] = useState<VoiceInputStatus>(
    hasMediaRecorder ? "idle" : "unsupported"
  );
  const [interimText, setInterimText] = useState("");

  const workerRef = useRef<Worker | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Lazy-create worker
  const getWorker = useCallback((): Worker => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("../workers/whisper.worker.ts", import.meta.url),
        { type: "module" }
      );

      workerRef.current.onmessage = (e: MessageEvent) => {
        const { type, text, progress, message } = e.data;
        if (type === "ready") {
          setInterimText("");
        } else if (type === "progress") {
          const pct = Math.round(progress ?? 0);
          setInterimText(`Downloading Whisper model… ${pct}%`);
          onStatusMessage?.(`Downloading model: ${pct}%`);
        } else if (type === "result") {
          if (text) onTranscript(text);
          setStatus("idle");
          setInterimText("");
        } else if (type === "error") {
          console.error("[Whisper Worker]", message);
          setStatus("error");
          setInterimText("");
          setTimeout(() => setStatus("idle"), 2000);
        }
      };
    }
    return workerRef.current;
  }, [onTranscript, onStatusMessage]);

  const start = useCallback(async () => {
    if (status !== "idle" || !hasMediaRecorder) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStatus("listening");
      setInterimText("🎙 Recording…");

      chunksRef.current = [];
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach((t) => t.stop());

        if (chunksRef.current.length === 0) {
          setStatus("idle");
          setInterimText("");
          return;
        }

        setStatus("processing");
        setInterimText("Processing…");

        try {
          // Convert blob to Float32Array (16 kHz mono) for Whisper
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          const arrayBuf = await blob.arrayBuffer();
          const audioCtx = new AudioContext({ sampleRate: 16_000 });
          const decoded = await audioCtx.decodeAudioData(arrayBuf);
          const float32 = decoded.getChannelData(0); // mono

          const worker = getWorker();
          // Transfer the buffer (zero-copy) to the worker
          const copy = new Float32Array(float32);
          worker.postMessage({ type: "transcribe", audioData: copy, lang }, [copy.buffer]);
        } catch (err) {
          console.error("[Whisper] Audio decode error:", err);
          setStatus("error");
          setInterimText("");
          setTimeout(() => setStatus("idle"), 2000);
        }
      };

      recorder.start();
    } catch (err) {
      console.error("[Whisper] Mic error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }, [status, lang, getWorker]);

  const stop = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  }, []);

  const toggle = useCallback(() => {
    if (status === "listening") {
      stop();
    } else if (status === "idle") {
      start();
    }
  }, [status, start, stop]);

  // Cleanup
  useEffect(() => {
    return () => {
      recorderRef.current?.stop();
      workerRef.current?.terminate();
    };
  }, []);

  return { status, interimText, toggle, start, stop };
}

// ────────────────────────────────────────────────────────────
// Unified hook — picks the right backend automatically
// ────────────────────────────────────────────────────────────
export function useVoiceInput(options: UseVoiceInputOptions) {
  if (hasNativeSpeech) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useNativeSpeech(options);
  } else if (hasMediaRecorder) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useWhisperSpeech(options);
  } else {
    // Unsupported (very old browser)
    return {
      status: "unsupported" as VoiceInputStatus,
      interimText: "",
      toggle: () => {},
      start: () => {},
      stop: () => {},
    };
  }
}
