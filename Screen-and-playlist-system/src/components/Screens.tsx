import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { screensApi } from '../api/screen.ts';
import { Screen } from '../types';

const Screens: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery(
    ['screens', search, page],
    () => screensApi.getScreens(search, page, 10)
  );

  const toggleMutation = useMutation(screensApi.toggleScreen, {
    onMutate: async (screenId) => {
      await queryClient.cancelQueries(['screens', search, page]);
      
      const previousScreens = queryClient.getQueryData(['screens', search, page]);
      
      queryClient.setQueryData(['screens', search, page], (old: any) => ({
        ...old,
        screens: old.screens.map((screen: Screen) =>
          screen._id === screenId ? { ...screen, isActive: !screen.isActive } : screen
        ),
      }));

      return { previousScreens };
    },
    onError: (err, variables, context: any) => {
      queryClient.setQueryData(['screens', search, page], context.previousScreens);
    },
    onSettled: () => {
      queryClient.invalidateQueries(['screens', search, page]);
    },
  });

  const handleToggle = (screenId: string) => {
    toggleMutation.mutate(screenId);
  };

  if (isLoading) return <div>Loading screens...</div>;
  if (error) return <div>Error loading screens</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Screens</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search screens..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ padding: '8px', width: '300px' }}
        />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.screens?.map((screen) => (
            <tr key={screen._id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{screen.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {screen.isActive ? 'Active' : 'Inactive'}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button
                  onClick={() => handleToggle(screen._id)}
                  disabled={toggleMutation.isLoading}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: screen.isActive ? '#dc3545' : '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px'
                  }}
                >
                  {screen.isActive ? 'Deactivate' : 'Activate'}
                </button>
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

export default Screens;