import { useEffect, useState } from "react";

export default function EventForm({ onAdd, onCancel, initialData }: any) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [participants, setParticipants] = useState(0);

  // LOAD DATA FOR EDIT
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

    onAdd({
      name,
      date,
      location,
      participants
    });

    setName("");
    setDate("");
    setLocation("");
    setParticipants(0);
  }

  return (
    <form onSubmit={handleSubmit} className="form">

      <h2>{initialData ? "Edit Event" : "Add Event"}</h2>

      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
      <input type="number" value={participants} onChange={(e) => setParticipants(Number(e.target.value))} />

      <div className="form-actions">
        <button type="submit">
          {initialData ? "Update" : "Save"}
        </button>

        <button type="button" onClick={onCancel}>
          Revert
        </button>
      </div>

    </form>
  );
}