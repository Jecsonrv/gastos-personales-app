import { useState } from "react";

export function SimpleLoginTest() {
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("admin123");
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult("");

        try {
            // Direct fetch call
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                credentials: 'include', // Important for cookies
                body: JSON.stringify({
                    nombreUsuario: username,
                    password: password
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setResult(`SUCCESS: ${JSON.stringify(data, null, 2)}`);
            
            if (data.success) {
                // Save user to localStorage
                localStorage.setItem('auth-user', JSON.stringify(data.usuario));
                setResult(prev => prev + "\n\nUser saved to localStorage!");
            }
            
        } catch (error) {
            setResult(`ERROR: ${error}`);
        }
        
        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Simple Login Test</h2>
            
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-1">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
            
            {result && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                    <h3 className="font-bold mb-2">Result:</h3>
                    <pre className="whitespace-pre-wrap text-sm text-green-600">{result}</pre>
                </div>
            )}
        </div>
    );
}