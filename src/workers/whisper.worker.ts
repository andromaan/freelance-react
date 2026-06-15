/**
 * Web Worker for running Whisper (via @xenova/transformers) off the main thread.
 * Messages TO worker:   { type: 'transcribe', audioData: Float32Array, lang: string }
 * Messages FROM worker: { type: 'progress', progress: number, text: string }
 *                       { type: 'result',   text: string }
 *                       { type: 'error',    message: string }
 *                       { type: 'ready' }
 */

import { pipeline, env } from "@xenova/transformers";

// Cache models in the origin's storage (IndexedDB) so we don't re-download
(env as any).allowLocalModels = false;
(env as any).useBrowserCache = true;

let transcriber: Awaited<ReturnType<typeof pipeline>> | null = null;

async function loadModel() {
  if (transcriber) return;

  transcriber = await pipeline(
    "automatic-speech-recognition",
    "Xenova/whisper-tiny",
    {
      progress_callback: (progress: { status: string; progress?: number; file?: string }) => {
        if (progress.status === "downloading" || progress.status === "progress") {
          self.postMessage({
            type: "progress",
            progress: progress.progress ?? 0,
            text: `Downloading model… ${Math.round(progress.progress ?? 0)}%`,
          });
        }
      },
    }
  );

  self.postMessage({ type: "ready" });
}

self.onmessage = async (event: MessageEvent) => {
  const { type, audioData, lang } = event.data as {
    type: string;
    audioData: Float32Array;
    lang: string;
  };

  if (type !== "transcribe") return;

  try {
    await loadModel();

    const language = lang?.startsWith("uk") ? "ukrainian" : "english";

    const result = await (transcriber as any)(audioData, {
      language,
      task: "transcribe",
      chunk_length_s: 30,
      return_timestamps: false,
    });

    const text: string =
      typeof result === "object" && result !== null && "text" in result
        ? (result as { text: string }).text.trim()
        : "";

    self.postMessage({ type: "result", text });
  } catch (err: any) {
    self.postMessage({ type: "error", message: err?.message ?? "Transcription failed" });
  }
};
