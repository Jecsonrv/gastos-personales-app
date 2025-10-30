import { useState, useEffect } from "react";
import { useProfile, useUpdateProfile, useChangePassword } from "../hooks/useUsuario";
import { Card, CardContent, CardHeader, CardTitle, PageLoader, ProfileSkeleton } from "../components/ui";
import { Button, Input } from "../components/ui";
import { useToast } from "../components/ui/Toast";
import { useAuth } from "../hooks/useAuth";

export function Profile() {
    const { user: authUser } = useAuth();
    const { addToast } = useToast();
    const { data: profile, isLoading } = useProfile();
    console.log("Profile isLoading:", isLoading);
    const updateProfile = useUpdateProfile();
    const changePassword = useChangePassword();

    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
    });
    const [passwordData, setPasswordData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        if (profile) {
            setFormData({
                nombre: profile.nombre,
                email: profile.email,
            });
        }
    }, [profile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile.mutateAsync(formData);
            addToast("Perfil actualizado exitosamente", "success");
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Error al actualizar el perfil";
            addToast(errorMessage, "error");
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setPasswordError("Las nuevas contraseñas no coinciden");
            return;
        }

        if (passwordData.newPassword.length < 4) {
            setPasswordError("La nueva contraseña debe tener al menos 4 caracteres");
            return;
        }

        try {
            await changePassword.mutateAsync({
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword,
            });
            addToast("Contraseña actualizada exitosamente", "success");
            setPasswordData({
                oldPassword: "",
                newPassword: "",
                confirmNewPassword: "",
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Error al cambiar la contraseña";
            addToast(errorMessage, "error");
            setPasswordError(errorMessage);
        }
    };

    if (isLoading) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Mi Perfil</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Información del Usuario</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium mb-2">Nombre de Usuario</label>
                            <Input type="text" value={authUser?.username || ''} disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Nombre Completo</label>
                            <Input
                                type="text"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <Button type="submit" disabled={updateProfile.isPending}>
                            {updateProfile.isPending ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Cambiar Contraseña</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
                        {passwordError && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
                                {passwordError}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium mb-2">Contraseña Actual</label>
                            <Input
                                type="password"
                                value={passwordData.oldPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Nueva Contraseña</label>
                            <Input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                required
                                minLength={4}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Confirmar Nueva Contraseña</label>
                            <Input
                                type="password"
                                value={passwordData.confirmNewPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                                required
                                minLength={4}
                            />
                        </div>
                        <Button type="submit" disabled={changePassword.isPending}>
                            {changePassword.isPending ? "Cambiando..." : "Cambiar Contraseña"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

