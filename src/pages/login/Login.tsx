import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
    setIsAuthenticated: (value: boolean) => void;
}

function Login({ setIsAuthenticated }: LoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple validation - in a real app, you'd call an API here
        if (username === 'admin' && password === 'password') {
            setIsAuthenticated(true);
            navigate('/dashboard');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;