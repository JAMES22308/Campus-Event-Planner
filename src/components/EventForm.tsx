import { useEffect, useState } from "react";
import "./EventForm.css";

export default function EventForm({ onAdd, onCancel, initialData }: any) {
  const [name, setName] = useState("New Event");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("TBA");
  const [participants, setParticipants] = useState(0);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDate(initialData.date);
      setLocation(initialData.location);
      setParticipants(initialData.participants);
    }
  }, [initialData]);

  function handleSubmit(e: any) {
    e.preventDefault();

    // VALIDATION (TASK 1 REQUIREMENT)
    if (!name.trim()) {
      alert("Event name is required");
      return;
    }

    if (!date) {
      alert("Date is required");
      return;
    }

    if (!location.trim()) {
      alert("Location is required");
      return;
    }

    if (participants < 0) {
      alert("Participants cannot be negative");
      return;
    }

    onAdd({
      name,
      date,
      location,
      participants,
    });

    // RESET FORM
    setName("");
    setDate("");
    setLocation("");
    setParticipants(0);
  }

  return (
   <form onSubmit={handleSubmit} className="form">
  <h2>{initialData ? "Edit Event" : "Add Event"}</h2>

  {/* NAME */}
  <label>Event Name</label>
  <input
    value={name}
    onChange={(e) => setName(e.target.value)}
    placeholder="Enter event name"
  />

  {/* DATE */}
  <label>Date</label>
  <input
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
  />

  {/* LOCATION */}
  <label>Location</label>
  <input
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    placeholder="Enter location"
  />

  {/* PARTICIPANTS */}
  <label>Participants</label>
  <input
    type="number"
    value={participants}
    onChange={(e) => setParticipants(Number(e.target.value))}
  />

  {/* BUTTONS */}
  <div className="form-actions">
    <button type="submit">
      {initialData ? "Update" : "Save"}
    </button>

    <button type="button" onClick={onCancel}>
      Cancel
    </button>
  </div>
</form>
  );
}