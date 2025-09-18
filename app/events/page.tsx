export default function Events() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Community Events</h1>
        <div className="space-y-4">
          <div className="bg-card rounded-lg p-4 border">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">City Clean-up Drive</h3>
              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">Today</span>
            </div>
            <p className="text-muted-foreground text-sm mb-2">Join us for a community clean-up initiative.</p>
            <p className="text-xs text-muted-foreground">📍 Central Park • 🕘 9:00 AM</p>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">Digital Literacy Workshop</h3>
              <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">Tomorrow</span>
            </div>
            <p className="text-muted-foreground text-sm mb-2">Learn digital skills for senior citizens.</p>
            <p className="text-xs text-muted-foreground">📍 Community Center • 🕘 2:00 PM</p>
          </div>
          <div className="bg-card rounded-lg p-4 border">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">Local Market Festival</h3>
              <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full">This Weekend</span>
            </div>
            <p className="text-muted-foreground text-sm mb-2">Support local vendors and artisans.</p>
            <p className="text-xs text-muted-foreground">📍 Market Square • 🕘 10:00 AM</p>
          </div>
        </div>
      </div>
    </div>
  );
}