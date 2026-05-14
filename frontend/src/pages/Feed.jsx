import React, { useEffect, useState } from 'react';
import { postService } from '../services/postService';
import { useAuth } from '../context/AuthContext';
import { FadeIn, Card, Avatar, Button, Input, Loader } from '../components';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';

const PostCard = ({ post, onLike, onComment, currentUser }) => {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => onLike(post.id);
  const handleComment = async () => {
    if (!commentText.trim()) return;
    await onComment(post.id, commentText);
    setCommentText('');
  };

  return (
    <Card className="p-5">
      <div className="flex items-start gap-3">
        <Avatar src={post.User?.avatarUrl} name={post.User?.fullName} />
        <div className="flex-1">
          <div className="flex justify-between">
            <span className="font-semibold">{post.User?.fullName}</span>
            <span className="text-xs text-gray-500">
              {formatDistance(new Date(post.createdAt), new Date(), { addSuffix: true, locale: fr })}
            </span>
          </div>
          <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 mt-1">
            {post.postType === 'alert' ? 'Alerte' : post.postType === 'event' ? 'Événement' : post.postType === 'official' ? 'Officiel' : 'Info'}
          </span>
          <p className="mt-2 text-gray-800 whitespace-pre-wrap">{post.content}</p>
          {post.imageUrl && (
            <img src={post.imageUrl} alt="post" className="mt-3 rounded-xl max-h-96 object-cover" />
          )}
          <div className="flex items-center gap-4 mt-4">
            <button onClick={handleLike} className="flex items-center gap-1 text-gray-500 hover:text-red-500">
              <Heart size={18} className={post.userLiked ? 'fill-red-500 text-red-500' : ''} />
              <span>{post.likesCount}</span>
            </button>
            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1 text-gray-500">
              <MessageCircle size={18} />
              <span>{post.commentsCount}</span>
            </button>
          </div>
          {showComments && (
            <div className="mt-4 space-y-3">
              {post.Comments?.map(comment => (
                <div key={comment.id} className="flex gap-2 text-sm">
                  <Avatar src={comment.User?.avatarUrl} name={comment.User?.fullName} size="sm" />
                  <div className="bg-gray-50 rounded-xl px-3 py-2 flex-1">
                    <span className="font-medium">{comment.User?.fullName}</span>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter un commentaire..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleComment} icon={Send}>Envoyer</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();

  const fetchPosts = async (reset = false) => {
    if (reset) setPage(1);
    try {
      const res = await postService.getFeed({ page: reset ? 1 : page, limit: 10 });
      const newPosts = res.data.data.posts;
      if (reset) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }
      setHasMore(newPosts.length === 10);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(true);
  }, []);

  const handleLike = async (postId) => {
    try {
      await postService.toggleLike(postId);
      // Mise à jour locale optimiste
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const wasLiked = p.userLiked;
          return {
            ...p,
            likesCount: wasLiked ? p.likesCount - 1 : p.likesCount + 1,
            userLiked: !wasLiked,
          };
        }
        return p;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (postId, content) => {
    try {
      const res = await postService.addComment(postId, content);
      const newComment = res.data.data;
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            Comments: [...(p.Comments || []), newComment],
          };
        }
        return p;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(p => p + 1);
      fetchPosts();
    }
  };

  return (
    <FadeIn>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Fil d’actualité</h1>
        {loading && posts.length === 0 ? (
          <Loader />
        ) : (
          <div className="space-y-5">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={handleComment}
                currentUser={user}
              />
            ))}
            {hasMore && (
              <div className="text-center py-4">
                <Button variant="outline" onClick={loadMore} disabled={loading}>Charger plus</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </FadeIn>
  );
};

export default Feed;