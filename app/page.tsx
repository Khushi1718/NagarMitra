'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Nagar Mitra</h1>
          <p className="text-muted-foreground">Your Smart City Companion</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2">
              Welcome{user ? `, ${user.name.split(' ')[0]}` : ''}!
            </h2>
            <p className="text-sm opacity-90">
              Report civic issues, connect with your community, and help make your city better.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl mb-2">�️</div>
              <h3 className="font-semibold text-sm">Potholes</h3>
              <p className="text-xs text-muted-foreground">Road Issues</p>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl mb-2">�</div>
              <h3 className="font-semibold text-sm">Street Lights</h3>
              <p className="text-xs text-muted-foreground">Lighting Issues</p>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl mb-2">�️</div>
              <h3 className="font-semibold text-sm">Waste</h3>
              <p className="text-xs text-muted-foreground">Overflow Issues</p>
            </div>
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-2xl mb-2">�</div>
              <h3 className="font-semibold text-sm">Public</h3>
              <p className="text-xs text-muted-foreground">Infrastructure</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-4 border">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              onClick={() => router.push('/raise-issue')}
              className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md text-sm font-medium"
            >
              Report an Issue
            </button>
            <button 
              onClick={() => router.push('/history')}
              className="w-full bg-secondary text-secondary-foreground py-2 px-4 rounded-md text-sm font-medium"
            >
              View Your Reports
            </button>
          </div>
        </div>

        <div className="mt-6 bg-card rounded-lg p-4 border">
          <h3 className="font-semibold mb-3">Recent Community Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">Pothole fixed on Main Street</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">Street light reported on Park Avenue</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">Trash overflow reported downtown</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
