import React, { useState, useEffect } from 'react';
import useDebounce from './useDebounce'; // Import custom hook

function App() {
  // State to hold GitHub username, avatar URL, and errors
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [error, setError] = useState('');

  // Debounced username to avoid excessive API calls
  const debouncedUsername = useDebounce(username, 500);

  // Effect to call GitHub API when the debounced username changes
  useEffect(() => {
    if (debouncedUsername) {
      // Fetch user information from GitHub API
      fetch(`https://api.github.com/users/${debouncedUsername}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('User not found');
          }
          return response.json();
        })
        .then((data) => {
          // Set the avatar URL if successful
          setAvatarUrl(data.avatar_url);
          setError(''); // Clear any previous errors
        })
        .catch((err) => {
          // Handle errors (e.g., user not found)
          setError(err.message);
          setAvatarUrl(''); // Clear previous avatar if there's an error
        });
    }
  }, [debouncedUsername]);

  return (
    <div className="app" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>GitHub User Avatar Finder</h1>
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)} // Update username state on input change
        style={{ padding: '10px', width: '250px', marginBottom: '20px' }}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display errors */}
      {avatarUrl && <img src={avatarUrl} alt="User Avatar" style={{ width: '150px', borderRadius: '50%' }} />}
    </div>
  );
}

export default App;
