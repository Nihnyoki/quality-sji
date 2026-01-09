import React, { useEffect, useMemo, useState } from 'react';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  type Timestamp,
} from 'firebase/firestore';
import { firebaseAuth, firebaseDb } from '../services/firebaseClient';
import { cn } from '../lib/utils';

type PostType = 'quality' | 'video' | 'project';

type CommentRow = {
  id: string;
  postId: string;
  postType: PostType;
  body: string;
  createdAt: Timestamp | null;
  uid: string;
  userName: string | null;
  userAvatarUrl: string | null;
};

type CommentsSectionProps = {
  postId: string;
  postType: PostType;
};

function formatWhen(createdAt: Timestamp | null) {
  if (!createdAt) return '';
  const d = createdAt.toDate();
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString();
}

export default function CommentsSection({ postId, postType }: CommentsSectionProps) {
  const [user, setUser] = useState<User | null>(null);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [body, setBody] = useState('');

  const canSubmit = useMemo(() => {
    return Boolean(user) && body.trim().length > 0 && !submitting;
  }, [user, body, submitting]);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(firebaseAuth, (u) => {
      setUser(u);
    });

    return () => {
      unsubAuth();
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const q = query(
      collection(firebaseDb, 'comments'),
      where('postId', '==', postId),
      where('postType', '==', postType),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows: CommentRow[] = snap.docs.map((d) => {
          const data = d.data() as Omit<CommentRow, 'id'>;
          return {
            id: d.id,
            postId: data.postId,
            postType: data.postType,
            body: data.body,
            createdAt: data.createdAt ?? null,
            uid: data.uid,
            userName: data.userName ?? null,
            userAvatarUrl: data.userAvatarUrl ?? null,
          };
        });
        setComments(rows);
        setLoading(false);
      },
      (e) => {
        setError(e.message);
        setComments([]);
        setLoading(false);
      }
    );

    return () => {
      unsub();
    };
  }, [postId, postType]);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(firebaseAuth, provider);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Google sign-in failed');
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await signOut(firebaseAuth);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign out failed');
    }
  };

  const submit = async () => {
    if (!user) {
      setError('Please sign in with Google to comment.');
      return;
    }

    const text = body.trim();
    if (!text) return;

    setSubmitting(true);
    setError(null);

    try {
      await addDoc(collection(firebaseDb, 'comments'), {
        postId,
        postType,
        body: text,
        uid: user.uid,
        userName: user.displayName ?? user.email ?? null,
        userAvatarUrl: user.photoURL ?? null,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      setSubmitting(false);
      setError(e instanceof Error ? e.message : 'Failed to post comment');
      return;
    }

    setSubmitting(false);

    setBody('');
  };

  return (
    <section
      className="mt-8 rounded-2xl border border-zinc-200 bg-white/45 px-5 py-6"
      aria-label="Comments"
    >
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="font-merriweather text-lg md:text-xl font-semibold text-zinc-900">Comments</h3>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-xs text-zinc-600 truncate max-w-[12rem]">{user.email ?? user.displayName}</span>
              <button
                type="button"
                onClick={signOut}
                className="inline-flex items-center rounded-full border border-zinc-300 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-800 hover:bg-white"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="inline-flex items-center rounded-full border border-zinc-300 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-800 hover:bg-white"
            >
              Sign in with Google
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div className="mt-5">
        <label className="sr-only" htmlFor="comment-body">
          Add a comment
        </label>
        <textarea
          id="comment-body"
          className={cn(
            'w-full min-h-28 rounded-2xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300/70'
          )}
          placeholder={user ? 'Write a comment…' : 'Sign in with Google to write a comment…'}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={!user || submitting}
        />

        <div className="mt-3 flex items-center justify-end">
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className={cn(
              'inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition',
              canSubmit
                ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                : 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
            )}
          >
            {submitting ? 'Posting…' : 'Post comment'}
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {loading ? (
          <div className="text-sm text-zinc-600">Loading comments…</div>
        ) : comments.length === 0 ? (
          <div className="text-sm text-zinc-600">No comments yet. Be the first.</div>
        ) : (
          comments.map((c) => (
            <article key={c.id} className="rounded-2xl border border-zinc-200 bg-white/40 px-4 py-4">
              <div className="flex items-start gap-3">
                <img
                  src={c.userAvatarUrl || '/images/author-placeholder.svg'}
                  alt={c.userName || 'User'}
                  className="h-10 w-10 rounded-full border border-zinc-200 bg-zinc-50 object-cover"
                  loading="lazy"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <div className="font-merriweather text-sm font-semibold text-zinc-900 truncate">
                      {c.userName || 'Anonymous'}
                    </div>
                    <div className="text-xs text-zinc-500">{formatWhen(c.createdAt)}</div>
                  </div>
                  <p className="mt-2 text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">{c.body}</p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
