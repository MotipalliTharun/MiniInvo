export type ChatRole = "user" | "assistant" | "system";
export interface ChatMessage { id: string; role: ChatRole; text: string; time: number; }

export class ChatStore {
  #messages: ChatMessage[] = [
    { id: crypto.randomUUID(), role: "assistant", text: "Hi! I’m your AI health companion. How can I help today?", time: Date.now() }
  ];
  get messages() { return this.#messages; }

  add(role: ChatRole, text: string) {
    const m: ChatMessage = { id: crypto.randomUUID(), role, text: text.trim(), time: Date.now() };
    if (m.text.length) this.#messages = [...this.#messages, m];
    return m;
  }
}
export const chatStore = new ChatStore();
