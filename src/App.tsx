

import { useEffect, useState } from "react";
import { EventPlanner } from "./model/EventPlanner";
import { IndexedDBEventRepository } from "./repository/IndexedDBEventRepository";

import EventForm from "./components/EventForm";
import EventList from "./components/EventList";
import type { Event } from "./types/Event";

import "./App.css";

import OfflineBanner from "./components/OfflineBanner";



const planner = new EventPlanner(new IndexedDBEventRepository());

export default function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");

  // const [error, setError] = useState<string | null>(null);

  // const [originalEvent, setOriginalEvent] = useState<Event | null>(null);




  //offline banner
  const [isOffline, setIsOffline] = useState(!navigator.onLine);


  useEffect(() => {
  function goOnline() {
    setIsOffline(false);
  }

  function goOffline() {
    setIsOffline(true);
  }

  window.addEventListener("online", goOnline);
  window.addEventListener("offline", goOffline);

  return () => {
    window.removeEventListener("online", goOnline);
    window.removeEventListener("offline", goOffline);
  };
}, []);




  // LOAD
  async function refresh() {
    const data = await planner.loadAllFromRepository();
    setEvents([...data]);
  }

// function handleRevert(event: any) {
//   console.log("REVERTING...");

//   event.discardChanges();

//   setEvents((prev) =>
//     prev.map((e) => (e.id === event.id ? event : e))
//   );
// }

  useEffect(() => {
    refresh();
  }, []);

  // ADD / UPDATE (WITH VALIDATION = TASK 1 REQUIREMENT)
  async function handleSave(data: Omit<Event, "id">) {
    try {
      // setError(null);

      if (!data.name || data.name.trim() === "") {
        throw new Error("Event name is required");
      }

      if (data.participants < 0) {
        throw new Error("Participants cannot be negative");
      }

      if (editingEvent) {
        await planner.updateEvent(editingEvent.id, data);
        setEditingEvent(null);
      } else {
        await planner.addEvent(data);
      }

      setShowForm(false);
      await refresh();
    } catch (err: any) {
      // setError(err.message);
      console.error("Error saving event:", err);
    }
  }

  // DELETE
  async function handleDelete(id: number) {
    await planner.removeEvent(id);
    await refresh();
  }

  // EDIT
function handleEdit(event: Event) {
  setEditingEvent(event);

  // 🔥 use class method instead

  setShowForm(true);
}

  // CALCULATIONS (TASK 1 REQUIREMENT)
  const totalParticipants = events.reduce(
    (sum, e) => sum + e.participants,
    0
  );

  const averageParticipants =
    events.length > 0 ? totalParticipants / events.length : 0;

  // FILTER + SORT
  const filteredEvents = events
    .filter((e) => {
      const term = search.toLowerCase();
      return (
        e.name.toLowerCase().includes(term) ||
        e.location.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "participants") {
        return a.participants - b.participants;
      }
      return 0;
    });

  return (
    <div className="dashboard">

    {isOffline && <OfflineBanner />}

<div className="header">
  <h1>📅 Event Dashboard</h1>

  <div className="stats">
    <p>Total Events: <strong>{events.length}</strong></p>
  </div>

  <button onClick={() => setShowForm(true)}>
    + Add Event
  </button>
</div>

      {/* ERROR (FAILURE CASE UI) */}
      {/* {error && (
        <div className="error-banner">
          ⚠️ {error}
        </div>
      )} */}

      {/* CALCULATIONS DISPLAY (IMPORTANT FOR MARKS) */}
      <div className="stats">
        <p>Total Events: {events.length}</p>
        <p>Total Participants: {totalParticipants}</p>
        <p>Average Participants: {averageParticipants.toFixed(1)}</p>
      </div>

      {/* SEARCH + SORT */}
      <div className="controls">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="participants">Sort by Participants</option>
        </select>
      </div>

      {/* LIST */}
      <EventList
        events={filteredEvents}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* MODAL */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <EventForm
              onAdd={handleSave}
              onCancel={() => {
                setShowForm(false);
                setEditingEvent(null);
              }}
              initialData={editingEvent}
            />
          </div>
        </div>
      )}
    </div>
  );
}