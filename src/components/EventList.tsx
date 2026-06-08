import EventItem from "./EventItem";

export default function EventList({ events, onEdit, onDelete }: any) {
  return (
    <div className="list">
      {events.length === 0 ? (
        <p>No events found</p>
      ) : (
        events.map((event: any) => (
          <EventItem
            key={event.id}
            event={event}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}