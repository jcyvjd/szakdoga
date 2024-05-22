import React from 'react';

const StatusBoard = ({ users, authUserId, onToggleReady }) => {
  console.log("statusboard users: ",users)
  if (!users || users.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id.toString()} 
            className="hover">
              <th>{index + 1}</th>
              <td>{user.username}</td>
              <td>
                {authUserId === user._id ? (
                  <button
                    className={`w-24 text-center px-2 py-1 rounded ${
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
                    className={`w-24 text-center block px-2 py-1 rounded ${
                      user.status !== 'ready'
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {user.status !== 'ready' ? 'Not Ready' : 'Ready'}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StatusBoard;