import React, { useEffect, useState } from 'react';
import { postService } from '../../services/postService';
import { FadeIn, Card, Button, Loader } from '../../components';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

const PostsModeration = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await postService.getFeed({ page: 1, limit: 50 });
      const allPosts = res.data.data.posts;
      const pendingPosts = allPosts.filter(p => !p.isModerated);
      setPosts(pendingPosts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (postId, approved) => {
    try {
      await postService.moderate(postId, approved);
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loader />;

  return (
    <FadeIn>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Modération des publications</h1>
        {posts.length === 0 && <p className="text-gray-500">Aucune publication en attente de modération.</p>}
        {posts.map(post => (
          <Card key={post.id} className="p-4">
            <div className="flex justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{post.postType}</span>
                  <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="mt-1">{post.content}</p>
                {post.imageUrl && <img src={post.imageUrl} className="mt-2 h-32 object-cover rounded" alt="post" />}
                <p className="text-xs text-gray-500 mt-2">Par {post.User?.fullName}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button size="sm" variant="outline" onClick={() => window.open(`/feed?post=${post.id}`, '_blank')} icon={Eye}>Voir</Button>
                <Button size="sm" variant="outline" className="border-green-500 text-green-600" onClick={() => handleModerate(post.id, true)} icon={CheckCircle}>Approuver</Button>
                <Button size="sm" variant="outline" className="border-red-500 text-red-600" onClick={() => handleModerate(post.id, false)} icon={XCircle}>Rejeter</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </FadeIn>
  );
};

export default PostsModeration;