'use client';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function PostsPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');

    const fetchPosts = async () => {
        try {
            const res = await api.get('/api/posts');
            setPosts(res.data);
        } catch (error) {
            toast.error('Không thể kết nối server!');
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const data = { title, content, author };
        
        toast.promise(
            api.post('/api/posts', data),
            {
                loading: 'Đang lưu...',
                success: 'Lưu thành công!',
                error: 'Có lỗi xảy ra!'
            }
        ).then(() => {
            setTitle(''); setContent(''); setAuthor('');
            fetchPosts();
        }).catch(err => console.error(err.response?.data?.error));
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn chắc chắn muốn xoá bài viết này?')) return;
        try {
            await api.delete(`/api/posts/${id}`);
            setPosts(prev => prev.filter(p => p.id !== id));
            toast.success('Đã xoá bài viết');
        } catch (err) {
            toast.error('Xoá thất bại, thử lại!');
            fetchPosts();
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-8">
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Tiêu đề" className="border p-2" required />
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Nội dung" className="border p-2" required />
                <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="Tác giả" className="border p-2" required />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Đăng bài</button>
            </form>

            <div>
                {posts.map(p => (
                    <div key={p.id} className="flex justify-between items-center p-3 border rounded mb-2">
                        <div>
                            <h3 className="font-bold">{p.title}</h3>
                            <p className="text-sm text-gray-500">{p.author} - {p.content}</p>
                        </div>
                        <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">
                            Xoá
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}