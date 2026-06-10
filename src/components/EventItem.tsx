import type { Event } from "../types/Event";
import "./EventItem.css";

type Props = {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
};

export default function EventItem({
  event,
  onEdit,
  onDelete,
}: Props) {
  return (
   <div className="event-card">
  <div className="top-row">
    <h3>📌 {event.name}</h3>

    <span className={event.participants > 10 ? "badge high" : "badge low"}>
      {event.participants > 10 ? "🔥 High" : "🟢 Low"}
    </span>
  </div>

  <div className="info-row">
    <span>📅 {event.date}</span>
    <span>📍 {event.location}</span>
    <span>👥 {event.participants}</span>
  </div>

  <div className="actions">
    <button className="edit" onClick={() => onEdit(event)}>
      ✏️ Edit
    </button>

    <button className="delete" onClick={() => onDelete(event.id)}>
      🗑 Delete
    </button>
  </div>
</div>
  );
}