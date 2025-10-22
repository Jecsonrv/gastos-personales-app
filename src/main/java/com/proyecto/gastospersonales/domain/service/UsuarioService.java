package com.proyecto.gastospersonales.domain.service;

import com.proyecto.gastospersonales.domain.model.Usuario;

import java.util.List;
import java.util.Optional;

/**
 * Interfaz del servicio de Usuario
 * Define las operaciones de negocio para gestión de usuarios
 */
public interface UsuarioService {

    /**
     * Autentica un usuario con username/email y contraseña
     */
    Optional<Usuario> autenticar(String usernameOrEmail, String password);

    /**
     * Registra un nuevo usuario
     */
    Usuario registrarUsuario(String username, String email, String password, String nombreCompleto);

    /**
     * Busca un usuario por ID
     */
    Optional<Usuario> obtenerUsuarioPorId(Long id);

    /**
     * Busca un usuario por username
     */
    Optional<Usuario> obtenerUsuarioPorUsername(String username);

    /**
     * Busca un usuario por email
     */
    Optional<Usuario> obtenerUsuarioPorEmail(String email);

    /**
     * Obtiene todos los usuarios activos
     */
    List<Usuario> obtenerUsuariosActivos();

    /**
     * Actualiza la información de un usuario
     */
    Usuario actualizarUsuario(Long id, String email, String nombreCompleto);

    /**
     * Cambia la contraseña de un usuario
     */
    void cambiarPassword(Long id, String passwordAntigua, String passwordNueva);

    /**
     * Desactiva un usuario
     */
    void desactivarUsuario(Long id);

    /**
     * Activa un usuario
     */
    void activarUsuario(Long id);

    /**
     * Actualiza el último acceso del usuario
     */
    void actualizarUltimoAcceso(Long id);

    /**
     * Verifica si un username ya existe
     */
    boolean existeUsername(String username);

    /**
     * Verifica si un email ya existe
     */
    boolean existeEmail(String email);
}