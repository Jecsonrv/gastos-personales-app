package com.proyecto.gastospersonales.domain.service;

import com.proyecto.gastospersonales.domain.model.Usuario;

import java.util.Optional;

public interface AuthService {
    String createSession(Usuario usuario);
    void removeSession(String token);
    Optional<Usuario> getUserFromToken(String token);
}
