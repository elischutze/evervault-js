export default class EventManager {
  #events = new EventTarget();

  public on(event: string, callback: Function) {
    const handler = (e: Event) => {
      return callback((e as CustomEvent).detail);
    };

    this.#events.addEventListener(event, handler);

    return () => {
      this.#events.removeEventListener(event, handler);
    };
  }

  public dispatch<T>(event: string, payload?: T) {
    const e = new CustomEvent(event, { detail: payload });
    this.#events.dispatchEvent(e);
  }
}
