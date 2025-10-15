package Lógica;

//importaciones
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class ManejoUsuario {

    private List<Usuario> usuarios= new ArrayList<>();
    private Scanner scanner= new Scanner(System.in);

    //Metodo registro de usuario

    public void registroUsuario(){
        System.out.println("Ingrese su nombre de usuario: ");
        String nombreUsuario=scanner.nextLine();
        System.out.println("Ingrese su correo electrónico: ");
        String email= scanner.nextLine();
        System.out.println("Ingrese su contraseña: ");
        String contraseña=scanner.nextLine();

        usuarios.add(new Usuario(nombreUsuario, email, contraseña));
    }

    //Lógica para el login del usuario

    public void login(){
        System.out.println("Ingrese su nombre de usuario: ");
        String nombreUsuario=scanner.nextLine();
        System.out.println("Ingrese su contraseña: ");
        String contraseña= scanner.nextLine();

        for (Usuario usuario : usuarios){
            if(usuario.getNombreUsuario().equals(nombreUsuario) && usuario.getContraseña().equals(contraseña)){
                System.out.println("Login exitoso.");
                return;
            }
        }
        System.out.println("Error de login. Usuario o contraseña incorrectos.");
    }

    public void start(){
        while(true){
            System.out.println("\nSistema de manejo de usuario");
            System.out.println("1. Registrarse");
            System.out.println("2. Login");
            System.out.println("3. Salirse");
            System.out.println("Ingresa tu elección: ");
            int eleccion=scanner.nextInt();
            scanner.nextLine();

            switch (eleccion){
                case 1:
                    registroUsuario();
                    break;
                case 2:
                    login();
                    break;
                case 3:
                    System.out.println("Saliendo...");
                    break;
                default:
                    System.out.println("Seleccione las opciones 1, 2, 3.");
            }
        }
    }

}
