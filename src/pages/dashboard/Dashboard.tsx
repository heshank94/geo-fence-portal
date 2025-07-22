import { useNavigate } from 'react-router-dom';

interface DashboardProps {
    setIsAuthenticated: (value: boolean) => void;
}

function Dashboard({ setIsAuthenticated }: DashboardProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsAuthenticated(false);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-xl font-semibold">Dashboard</h1>
                        <button
                            onClick={handleLogout}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-medium mb-4">Welcome to your Dashboard</h2>
                    <p className="text-gray-600">
                        You have successfully logged in. This is a protected page.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;