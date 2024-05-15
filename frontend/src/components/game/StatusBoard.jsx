import React from 'react';

const StatusBoard = ({ users, authUserId, onToggleReady }) => {
  console.log("statusboard users: ",users)
  if (!users || users.length === 0) {
    //return null;
  }

  return (
    <div className="status-board w-full max-w-md bg-gray-200 p-4 rounded-lg">
      {users.map((user) => (
        <div key={user._id} className="flex justify-between items-center mb-2">
          <span className="mr-2">{user.username}:</span>
          {authUserId === user._id ? (
            <button
              className={`px-2 py-1 rounded ${
                user.status !== 'ready'
                  ? 'bg-red-500 text-white'
                  : 'bg-green-500 text-white'
              }`}
              onClick={onToggleReady}
            >
              {user.status !== 'ready' ? 'Not Ready' : 'Ready'}
            </button>
          ) : (
            <span
              className={`px-2 py-1 rounded ${
                user.status !== 'ready'
                  ? 'bg-red-500 text-white'
                  : 'bg-green-500 text-white'
              }`}
            >
              {user.status !== 'ready' ? 'Not Ready' : 'Ready'}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatusBoard;