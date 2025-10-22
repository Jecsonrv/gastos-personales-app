export function TestPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-green-600 mb-4">
                    ✅ Frontend funcionando!
                </h1>
                <p className="text-gray-700 mb-4">
                    Si ves este mensaje, el frontend está compilando correctamente.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800">
                        <strong>Estado:</strong> React + Vite funcionando
                    </p>
                    <p className="text-blue-800">
                        <strong>Puerto:</strong> 5173
                    </p>
                    <p className="text-blue-800">
                        <strong>Timestamp:</strong> {new Date().toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
}