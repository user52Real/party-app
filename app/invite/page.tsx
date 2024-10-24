import InvitationForm from '../../components/InvitationForm';

export default function InvitePage({ params }: { params: { eventId: string } }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Invite Friends to Your Party</h1>
      <InvitationForm eventId={params.eventId} />
    </div>
  );
}
