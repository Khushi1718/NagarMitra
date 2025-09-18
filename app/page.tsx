export default function Home() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Nagar Mitra</h1>
          <p className="text-muted-foreground">Your Smart City Companion</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">Welcome!</h2>
            <p className="text-sm opacity-90">
              Access city services, report issues, and stay connected with your community.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl mb-2">🗑️</div>
              <h3 className="font-semibold text-sm">Waste</h3>
              <p className="text-xs text-muted-foreground">Management</p>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl mb-2">🚦</div>
              <h3 className="font-semibold text-sm">Traffic</h3>
              <p className="text-xs text-muted-foreground">Updates</p>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl mb-2">💧</div>
              <h3 className="font-semibold text-sm">Water</h3>
              <p className="text-xs text-muted-foreground">Supply</p>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl mb-2">💡</div>
              <h3 className="font-semibold text-sm">Street</h3>
              <p className="text-xs text-muted-foreground">Lighting</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 border">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md text-sm font-medium">
              Report an Issue
            </button>
            <button className="w-full bg-secondary text-secondary-foreground py-2 px-4 rounded-md text-sm font-medium">
              Check Service Status
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
