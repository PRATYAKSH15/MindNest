import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useUser, SignInButton } from "@clerk/clerk-react";
import { useApi } from "../providers/ApiProvider.jsx";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen, Bookmark, MessageSquare, Flame, FileText } from "lucide-react";
import { toast } from "sonner";

const TABS = ["Bookmarks", "My Articles", "Comments"];

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`flex flex-col items-center justify-center p-4 rounded-2xl border ${color} gap-1`}>
      <div className="text-2xl">{icon}</div>
      <div className="text-2xl font-extrabold">{value}</div>
      <div className="text-xs text-gray-500 font-medium text-center">{label}</div>
    </div>
  );
}

export default function ProfilePage() {
  const { isSignedIn, user } = useUser();
  const api = useApi();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Bookmarks");

  useEffect(() => {
    if (!isSignedIn) return;
    setLoading(true);
    api
      .get("/api/profile")
      .then((res) => setData(res.data))
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [api, isSignedIn]);

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="text-6xl mb-4">👤</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Profile</h1>
        <p className="text-gray-500 mb-6">Sign in to view your profile, bookmarks, and activity.</p>
        <SignInButton mode="modal">
          <Button size="lg">Sign In</Button>
        </SignInButton>
      </div>
    );
  }

  const displayName = user?.fullName || user?.firstName || user?.emailAddresses?.[0]?.emailAddress || "User";
  const email = user?.emailAddresses?.[0]?.emailAddress;
  const avatar = user?.imageUrl;

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

        {/* Profile Header */}
        <div className="flex items-center gap-5 mb-8">
          <img
            src={avatar}
            alt={displayName}
            className="w-16 h-16 rounded-full ring-2 ring-blue-200 object-cover"
          />
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{displayName}</h1>
            {email && <p className="text-sm text-gray-400">{email}</p>}
            <p className="text-xs text-gray-400 mt-0.5">Member of MindNest community</p>
          </div>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-gray-400" size={28} />
          </div>
        ) : data ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <StatCard
                icon={<FileText size={20} className="text-blue-500" />}
                label="Articles Written"
                value={data.stats.articlesCount}
                color="bg-blue-50 border-blue-200"
              />
              <StatCard
                icon={<Bookmark size={20} className="text-purple-500" />}
                label="Bookmarks"
                value={data.stats.bookmarksCount}
                color="bg-purple-50 border-purple-200"
              />
              <StatCard
                icon={<MessageSquare size={20} className="text-green-500" />}
                label="Comments"
                value={data.stats.commentsCount}
                color="bg-green-50 border-green-200"
              />
              <StatCard
                icon={<Flame size={20} className="text-orange-500" />}
                label="Mood Streak"
                value={`${data.stats.moodStreak}d`}
                color="bg-orange-50 border-orange-200"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${
                    activeTab === tab
                      ? "bg-white shadow text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* Bookmarks Tab */}
              {activeTab === "Bookmarks" && (
                <div>
                  {data.bookmarks.length === 0 ? (
                    <EmptyState
                      icon="🔖"
                      message="No bookmarks yet"
                      sub="Browse articles and bookmark the ones you love."
                      linkTo="/articles"
                      linkLabel="Browse Articles"
                    />
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {data.bookmarks.map((bm) =>
                        bm.articleId ? (
                          <Link
                            key={bm._id}
                            to={`/article/${bm.articleId._id}`}
                            className="block p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
                          >
                            <p className="font-semibold text-gray-900 line-clamp-2 mb-2 text-sm">
                              {bm.articleId.title}
                            </p>
                            <div className="flex gap-1 flex-wrap">
                              {bm.articleId.tags?.slice(0, 3).map((t) => (
                                <span
                                  key={t}
                                  className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </Link>
                        ) : null
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* My Articles Tab */}
              {activeTab === "My Articles" && (
                <div>
                  {data.recentArticles.length === 0 ? (
                    <EmptyState
                      icon="✍️"
                      message="No articles written yet"
                      sub="Share your story or knowledge with the community."
                      linkTo="/admin"
                      linkLabel="Write an Article"
                    />
                  ) : (
                    <div className="flex flex-col gap-3">
                      {data.recentArticles.map((a) => (
                        <Link
                          key={a._id}
                          to={`/article/${a._id}`}
                          className="flex items-start justify-between p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow gap-4"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm line-clamp-1 mb-1">
                              {a.title}
                            </p>
                            <div className="flex gap-1 flex-wrap">
                              {a.tags?.slice(0, 3).map((t) => (
                                <span
                                  key={t}
                                  className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">
                            {new Date(a.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Comments Tab */}
              {activeTab === "Comments" && (
                <div>
                  {data.recentComments.length === 0 ? (
                    <EmptyState
                      icon="💬"
                      message="No comments yet"
                      sub="Join the conversation on articles you find helpful."
                      linkTo="/articles"
                      linkLabel="Explore Articles"
                    />
                  ) : (
                    <div className="flex flex-col gap-3">
                      {data.recentComments.map((c) => (
                        <div
                          key={c._id}
                          className="p-4 bg-white border border-gray-200 rounded-xl"
                        >
                          <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                            "{c.content}"
                          </p>
                          <div className="flex items-center justify-between">
                            {c.articleId ? (
                              <Link
                                to={`/article/${c.articleId._id}`}
                                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <BookOpen size={12} />
                                {c.articleId.title}
                              </Link>
                            ) : (
                              <span className="text-xs text-gray-400">Article removed</span>
                            )}
                            <span className="text-xs text-gray-400">
                              {new Date(c.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        ) : null}
      </motion.div>
    </div>
  );
}

function EmptyState({ icon, message, sub, linkTo, linkLabel }) {
  return (
    <div className="text-center py-12 text-gray-400">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="font-semibold text-gray-600 mb-1">{message}</p>
      <p className="text-sm mb-4">{sub}</p>
      <Link to={linkTo}>
        <Button variant="outline" size="sm">{linkLabel}</Button>
      </Link>
    </div>
  );
}
