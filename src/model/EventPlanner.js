import { Event } from "./Event";

export class EventPlanner {
  #events = [];

  constructor(repository) {
    this.repository = repository;
  }

  // ✅ CREATE
  async addEvent(eventData = {}) {
    const event = new Event(
      eventData.id,
      eventData.name,
      eventData.date,
      eventData.location,
      eventData.participants
    );

    event.validate();
    event.saveOriginal();

    this.#events.push(event);

    if (this.repository) {
      await this.repository.add({
        id: event.id,
        name: event.name,
        date: event.date,
        location: event.location,
        participants: event.participants,
      });
    }

    return event;
  }

  // ❌ FIXED UPDATE (MAIN BUG HERE)
async updateEvent(id, newData) {
  // ❌ DON'T trust memory anymore

  const rawEvents = await this.repository.getAll();

  const eventData = rawEvents.find(
    (e) => String(e.id) === String(id)
  );

  if (!eventData) throw new Error("Event not found");

  const event = new Event(
    eventData.id,
    eventData.name,
    eventData.date,
    eventData.location,
    eventData.participants
  );

  event.update(newData);
  event.validate();

  await this.repository.update({
    id: event.id,
    name: event.name,
    date: event.date,
    location: event.location,
    participants: event.participants,
  });

  // refresh memory AFTER update
  await this.loadAllFromRepository();

  return event;
}

  // DELETE
  // async removeEvent(id) {
  //   const index = this.#events.findIndex((e) => e.id === id);

  //   if (index === -1) throw new Error("Event not found");

  //   const [removed] = this.#events.splice(index, 1);

  //   if (this.repository) {
  //     await this.repository.remove(id);
  //   }

  //   return removed;
  // }


  async removeEvent(id) {
  // always sync with database first
  const rawEvents = await this.repository.getAll();

  const exists = rawEvents.find(
    (e) => String(e.id) === String(id)
  );

  if (!exists) {
    throw new Error("Event not found");
  }

  // delete from DB
  await this.repository.remove(id);

  // refresh memory after delete
  await this.loadAllFromRepository();

  return exists;
}

  // LOAD FROM DB (🔥 CRITICAL FIX)
  async loadAllFromRepository() {
    if (!this.repository) throw new Error("No repository defined");

    const rawEvents = await this.repository.getAll();

    // 🔥 REHYDRATE into Event class
    this.#events = rawEvents.map(
      (e) =>
        new Event(
          e.id,
          e.name,
          e.date,
          e.location,
          e.participants
        )
    );

    return this.#events;
  }

  // GET ALL
  getAllEvents() {
    return this.#events;
  }

  // SORT
  sortEvents(byField = "date") {
    return this.#events.sort((a, b) => {
      if (byField === "date") return new Date(a.date) - new Date(b.date);
      if (typeof a[byField] === "string")
        return a[byField].localeCompare(b[byField]);
      return a[byField] - b[byField];
    });
  }

  // SEARCH
  findEvents(criteria = {}) {
    return this.#events.filter((event) => {
      for (let key in criteria) {
        if (event[key] === undefined) continue;

        if (typeof criteria[key] === "string") {
          if (
            !event[key]
              .toLowerCase()
              .includes(criteria[key].toLowerCase())
          )
            return false;
        } else if (event[key] !== criteria[key]) {
          return false;
        }
      }
      return true;
    });
  }

  // TOTALS
  totalParticipants() {
    return this.#events.reduce((sum, e) => sum + e.participants, 0);
  }

  totalEvents() {
    return this.#events.length;
  }


sortEvents(byField = "date") {
  return this.#events.sort((a, b) => {
    if (byField === "date") {
      return new Date(a.date) - new Date(b.date);
    }

    if (byField === "name") {
      return a.name.localeCompare(b.name);
    }

    if (byField === "participants") {
      return a.participants - b.participants;
    }

    return 0;
  });
}








findEvents(criteria = {}) {
  return this.#events.filter((event) => {
    return Object.keys(criteria).every((key) => {
      if (!criteria[key]) return true;

      if (typeof event[key] === "string") {
        return event[key]
          .toLowerCase()
          .includes(criteria[key].toLowerCase());
      }

      return event[key] === criteria[key];
    });
  });
}


totalParticipants() {
  return this.#events.reduce((sum, e) => sum + e.participants, 0);
}


averageParticipants() {
  if (this.#events.length === 0) return 0;

  return this.totalParticipants() / this.#events.length;
}


async debugPersistence() {
  const data = await this.repository.getAll();

  console.log("DB DATA:", data);
  console.log("MEMORY DATA:", this.#events);
}




}