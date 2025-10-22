import { useState } from "react";
import { authService } from "../services/auth";

export function TestAuthPage() {
    const [result, setResult] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const testUsernameCheck = async () => {
        setLoading(true);
        try {
            const response = await authService.checkUsernameAvailability("testuser");
            setResult(`Username Check: ${JSON.stringify(response, null, 2)}`);
        } catch (error) {
            setResult(`Error: ${error}`);
        }
        setLoading(false);
    };

    const testLogin = async () => {
        setLoading(true);
        try {
            const response = await authService.login({
                nombreUsuario: "admin",
                password: "admin123"
            });
            setResult(`Login: ${JSON.stringify(response, null, 2)}`);
        } catch (error) {
            setResult(`Error: ${error}`);
        }
        setLoading(false);
    };

    const testDirectAPI = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/check-username?username=directtest');
            const data = await response.json();
            setResult(`Direct API: ${JSON.stringify(data, null, 2)}`);
        } catch (error) {
            setResult(`Error: ${error}`);
        }
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Auth Test Page</h1>
            
            <div className="space-y-4 mb-6">
                <button 
                    onClick={testDirectAPI}
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
                >
                    Test Direct API
                </button>
                
                <button 
                    onClick={testUsernameCheck}
                    disabled={loading}
                    className="bg-green-500 text-white px-4 py-2 rounded mr-4"
                >
                    Test Username Check
                </button>
                
                <button 
                    onClick={testLogin}
                    disabled={loading}
                    className="bg-purple-500 text-white px-4 py-2 rounded"
                >
                    Test Login
                </button>
            </div>
            
            {loading && <p className="text-blue-600">Loading...</p>}
            
            <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-bold mb-2">Result:</h3>
                <pre className="whitespace-pre-wrap text-sm">{result}</pre>
            </div>
        </div>
    );
}