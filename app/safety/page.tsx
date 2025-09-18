export default function Safety() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Safety & Security</h1>
        <div className="space-y-4">
          <div className="bg-red-50 dark:bg-red-950 rounded-lg p-4 border border-red-200 dark:border-red-800">
            <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Emergency Contacts</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Police:</span>
                <a href="tel:100" className="font-mono text-red-600 dark:text-red-400">100</a>
              </div>
              <div className="flex justify-between">
                <span>Fire:</span>
                <a href="tel:101" className="font-mono text-red-600 dark:text-red-400">101</a>
              </div>
              <div className="flex justify-between">
                <span>Ambulance:</span>
                <a href="tel:108" className="font-mono text-red-600 dark:text-red-400">108</a>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-4 border">
            <h3 className="font-semibold mb-2">Report an Issue</h3>
            <div className="space-y-2">
              <button className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md text-sm font-medium">
                Report Emergency
              </button>
              <button className="w-full bg-secondary text-secondary-foreground py-2 px-4 rounded-md text-sm font-medium">
                Report Non-Emergency Issue
              </button>
            </div>
          </div>

          <div className="bg-card rounded-lg p-4 border">
            <h3 className="font-semibold mb-2">Safety Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Keep emergency contacts handy</li>
              <li>• Stay aware of your surroundings</li>
              <li>• Use well-lit paths at night</li>
              <li>• Share your location with trusted contacts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}