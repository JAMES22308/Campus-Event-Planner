export default function EventItem({ event, onEdit, onDelete }: any) {
  return (
    <div className="card">

      <h3>{event.name}</h3>
      <p>📅 {event.date}</p>
      <p>📍 {event.location}</p>
      <p>👥 {event.participants}</p>

      <div className="card-actions">
        <button onClick={() => onEdit(event)}>Edit</button>
        <button onClick={() => onDelete(event.id)}>Delete</button>
      </div>

    </div>
  );
}