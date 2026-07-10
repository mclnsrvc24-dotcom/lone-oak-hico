import { listTikTokPosts } from "@/lib/db";
import TikTokTracker from "@/components/dashboard/TikTokTracker";

export default async function TikTokPage() {
  const posts = await listTikTokPosts();

  return (
    <div>
      <h1 className="font-display text-3xl font-800 text-forest-dark">
        TikTok Content Tracker
      </h1>
      <p className="mt-1 text-ink/60">
        Keep a running backlog of ideas, plan what to film next, and track
        what&apos;s already posted.
      </p>
      <div className="mt-6">
        <TikTokTracker posts={posts} />
      </div>
    </div>
  );
}
