import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { playlistsApi } from '../api/playlists.ts';
import { Playlist } from '../types';

const Playlists: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', urls: '' });
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    ['playlists', search, page],
    () => playlistsApi.getPlaylists(search, page, 10)
  );

  const createMutation = useMutation(playlistsApi.createPlaylist, {
    onSuccess: () => {
      queryClient.invalidateQueries(['playlists']);
      setShowForm(false);
      setFormData({ name: '', urls: '' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const itemUrls = formData.urls.split('\n').filter(url => url.trim() !== '');
    
    if (itemUrls.length > 10) {
      alert('Maximum 10 URLs allowed');
      return;
    }

    createMutation.mutate({
      name: formData.name,
      itemUrls: itemUrls,
    });
  };

  if (isLoading) return <div>Loading playlists...</div>;
  if (error) return <div>Error loading playlists</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Playlists</h2>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search playlists..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ padding: '8px', width: '300px' }}
        />
        <button
          onClick={() => setShowForm(true)}
          style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none' }}
        >
          Create Playlist
        </button>
      </div>

      {showForm && (
        <div style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px' }}>
          <h3>Create New Playlist</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label>Name:</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label>URLs (one per line, max 10, optional):</label>
              <textarea
                value={formData.urls}
                onChange={(e) => setFormData({ ...formData, urls: e.target.value })}
                rows={5}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                placeholder="https://example.com/image1.jpg&#10;https://example.com/video1.mp4"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={createMutation.isLoading}
                style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none' }}
              >
                {createMutation.isLoading ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Item Count</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Created</th>
          </tr>
        </thead>
        <tbody>
          {data?.playlists?.map((playlist) => (
            <tr key={playlist._id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{playlist.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{playlist.itemCount}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {new Date(playlist.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '20px' }}>
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          style={{ marginRight: '10px' }}
        >
          Previous
        </button>
        <span>Page {page} of {data?.totalPages || 1}</span>
        <button
          disabled={page >= (data?.totalPages || 1)}
          onClick={() => setPage(page + 1)}
          style={{ marginLeft: '10px' }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Playlists;