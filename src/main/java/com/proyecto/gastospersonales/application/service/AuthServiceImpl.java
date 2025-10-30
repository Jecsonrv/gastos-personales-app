package com.proyecto.gastospersonales.application.service;

import com.proyecto.gastospersonales.domain.model.Usuario;
import com.proyecto.gastospersonales.domain.service.AuthService;
import com.proyecto.gastospersonales.domain.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final Map<String, Long> activeSessions = new HashMap<>();

    @Autowired
    private UsuarioService usuarioService;

    @Override
    public String createSession(Usuario usuario) {
        String token = UUID.randomUUID().toString();
        activeSessions.put(token, usuario.getId());
        return token;
    }

    @Override
    public void removeSession(String token) {
        activeSessions.remove(token);
    }

    @Override
    public Optional<Usuario> getUserFromToken(String token) {
        if (token == null || token.isEmpty()) {
            return Optional.empty();
        }

        String actualToken = token.replace("Bearer ", "");
        Long userId = activeSessions.get(actualToken);

        if (userId != null) {
            return usuarioService.obtenerPorId(userId);
        }

        return Optional.empty();
    }
}
