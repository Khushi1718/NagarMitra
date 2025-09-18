'use client';

import React from 'react';

export function TranslationTestComponent() {
  return (
    <div className="bg-card rounded-lg p-6 border space-y-4 max-w-md mx-auto mt-4">
      <h3 className="font-semibold text-lg text-center">Translation Test</h3>
      
      <div className="space-y-2 text-sm">
        <p className="text-muted-foreground">
          <strong>English:</strong> Welcome to Nagar Mitra - Your Smart City Companion
        </p>
        
        <p className="text-muted-foreground">
          <strong>Sample Text:</strong> Report issues, connect with your community, and help make your city better.
        </p>
        
        <div className="bg-background rounded p-3 border">
          <p className="text-xs font-medium mb-1">Common UI Elements:</p>
          <ul className="text-xs space-y-1 text-muted-foreground">
            <li>• Settings</li>
            <li>• Profile Information</li>
            <li>• Community</li>
            <li>• Raise Issue</li>
            <li>• History</li>
            <li>• Notifications</li>
            <li>• Help & Support</li>
          </ul>
        </div>
        
        <div className="text-center pt-2">
          <div className="inline-flex items-center gap-2 text-xs">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-muted-foreground">
              Select a language above to see this text translated
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TranslationTestComponent;