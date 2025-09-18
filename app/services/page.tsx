export default function Services() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Services</h1>
        <div className="space-y-4">
          <div className="bg-card rounded-lg p-4 border">
            <h3 className="font-semibold mb-2">Waste Management</h3>
            <p className="text-muted-foreground text-sm">Report and track waste collection issues in your area.</p>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <h3 className="font-semibold mb-2">Traffic & Transport</h3>
            <p className="text-muted-foreground text-sm">Check traffic updates and public transport schedules.</p>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <h3 className="font-semibold mb-2">Water Supply</h3>
            <p className="text-muted-foreground text-sm">Monitor water supply schedules and report issues.</p>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <h3 className="font-semibold mb-2">Street Lighting</h3>
            <p className="text-muted-foreground text-sm">Report faulty street lights and maintenance requests.</p>
          </div>
        </div>
      </div>
    </div>
  );
}