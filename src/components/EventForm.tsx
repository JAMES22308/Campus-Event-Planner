import { useEffect, useState } from "react";

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

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
      />

      <input
        type="number"
        value={participants}
        onChange={(e) => setParticipants(Number(e.target.value))}
      />

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