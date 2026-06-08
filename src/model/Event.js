


export class Event {
  #original = null; //private

  constructor(id, name, date, location, participants = 0) {
    this.id = id || Date.now();
    this.name = name || "New Event";
    this.date = date || new Date().toISOString().split("T")[0];
    this.location = location || "TBA";
    this.participants = participants;
  }

  // R7: Save original state
  saveOriginal() {
    this.#original = {
      id: this.id,
      name: this.name,
      date: this.date,
      location: this.location,
      participants: this.participants
    };
  }

  // R7: Discard changes
  discardChanges() {
    if (this.#original) {
      this.id = this.#original.id;
      this.name = this.#original.name;
      this.date = this.#original.date;
      this.location = this.#original.location;
      this.participants = this.#original.participants;
    }
  }

  // R6: Update event properties
  update(data = {}) {
    Object.assign(this, data);
  }

  // R8: Validate inputs
  validate() {
    if (!this.name || typeof this.name !== "string") throw new Error("Invalid event name");
    if (!this.date || isNaN(new Date(this.date))) throw new Error("Invalid date");
    if (!this.location || typeof this.location !== "string") throw new Error("Invalid location");
    if (isNaN(this.participants) || this.participants < 0)
      throw new Error("Invalid participants number");
  }

  // R9: Calculate duration of event (hours)
  durationHours(startTime, endTime) {
    const start = new Date(`${this.date}T${startTime}`);
    const end = new Date(`${this.date}T${endTime}`);
    return (end - start) / (1000 * 60 * 60);
  }
}