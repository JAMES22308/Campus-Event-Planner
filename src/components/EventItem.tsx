type Props = {
  event: any;
  onEdit: (event: any) => void;
  onDelete: (id: number) => void;
  onRevert: (event: any) => void;
};

export default function EventItem({
  event,
  onEdit,
  onDelete,
  onRevert,
}: Props) {
  return (
    <div className="event-card">
      <h3>{event.name}</h3>
      <p>Date: {event.date}</p>
      <p>Location: {event.location}</p>
      <p>Participants: {event.participants}</p>

      <div className="actions">
        <button onClick={() => onEdit(event)}>
          Edit
        </button>

        {/* 🔥 REVERT BUTTON (KATABI NG EDIT) */}
      <button
        onClick={() => {
          console.log("REVERT CLICKED");
          event.discardChanges(); // optional debug
          onRevert(event);
        }}
      >
        Revert
      </button>

        <button onClick={() => onDelete(event.id)}>
          Delete
        </button>

      
      </div>
    </div>
  );
}