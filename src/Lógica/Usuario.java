package Lógica;

public class Usuario {

    private String nombreUsuario;
    private String contraseña;
    private String email;

    //constructor vacío
    Usuario(){
    }

    //constructor con parámetros
    Usuario(String nombreUsuario, String contraseña, String email){
        this.contraseña=contraseña;
        this.nombreUsuario=nombreUsuario;
        this.email=email;
    }

    //getters

    public String getContraseña() {
        return contraseña;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public String getEmail() {
        return email;
    }

    //setters: actualización de datos

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public void setEmail(String email) {
        this.nombreUsuario = email;
    }
}
