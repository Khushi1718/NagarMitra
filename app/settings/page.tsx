export default function Settings() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Settings</h1>
        <div className="space-y-4">
          <div className="bg-card rounded-lg p-4 border">
            <h3 className="font-semibold mb-3">Profile</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Name</span>
                <span className="text-sm text-muted-foreground">User Name</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Phone</span>
                <span className="text-sm text-muted-foreground">+91 XXXXX XXXXX</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Location</span>
                <span className="text-sm text-muted-foreground">Your City</span>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-4 border">
            <h3 className="font-semibold mb-3">Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Notifications</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Dark Mode</span>
                <input type="checkbox" className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Location Services</span>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-4 border">
            <h3 className="font-semibold mb-3">App Info</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Version</span>
                <span className="text-sm text-muted-foreground">1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Privacy Policy</span>
                <span className="text-sm text-primary">View →</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Terms of Service</span>
                <span className="text-sm text-primary">View →</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}