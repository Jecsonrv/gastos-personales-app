package com.proyecto.gastospersonales.domain.service;

import com.proyecto.gastospersonales.domain.model.Usuario;

import java.util.Optional;

public interface UsuarioService {

    Usuario registrarUsuario(String username, String password, String email, String nombre);

    Optional<Usuario> autenticar(String username, String password);

    Optional<Usuario> obtenerPorId(Long id);

    Optional<Usuario> findByUsername(String username);

    boolean existeUsername(String username);

    boolean existeEmail(String email);

    Usuario actualizarPerfil(Long id, String nombre, String email);

    void cambiarPassword(Long id, String oldPassword, String newPassword);
}
