package com.proyecto.gastospersonales.application.service;

import com.proyecto.gastospersonales.domain.model.Usuario;
import com.proyecto.gastospersonales.domain.service.UsuarioService;
import com.proyecto.gastospersonales.infrastructure.repository.UsuarioRepositoryInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@Transactional
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepositoryInterface usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Usuario registrarUsuario(String username, String password, String email, String nombre) {
        if (username == null || username.trim().isEmpty()) {
            throw new IllegalArgumentException("El username no puede estar vacío");
        }

        if (password == null || password.length() < 4) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 4 caracteres");
        }

        if (email == null || !email.contains("@")) {
            throw new IllegalArgumentException("Email inválido");
        }

        if (usuarioRepository.existsByUsername(username.trim())) {
            throw new IllegalArgumentException("El username ya existe");
        }

        if (usuarioRepository.existsByEmail(email.trim())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        Usuario usuario = new Usuario(
                username.trim(),
                passwordEncoder.encode(password),
                email.trim(),
                nombre != null ? nombre.trim() : ""
        );

        return usuarioRepository.save(usuario);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> autenticar(String username, String password) {
        Optional<Usuario> usuario = usuarioRepository.findByUsername(username);

        if (usuario.isPresent() && passwordEncoder.matches(password, usuario.get().getPassword()) && usuario.get().isActivo()) {
            return usuario;
        }

        return Optional.empty();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> findByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existeUsername(String username) {
        return usuarioRepository.existsByUsername(username);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existeEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }

    @Override
    public Usuario actualizarPerfil(Long id, String nombre, String email) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        if (nombre != null && !nombre.trim().isEmpty()) {
            usuario.setNombre(nombre.trim());
        }

        if (email != null && !email.trim().isEmpty()) {
            if (!email.equals(usuario.getEmail()) && usuarioRepository.existsByEmail(email.trim())) {
                throw new IllegalArgumentException("El email ya está en uso");
            }
            usuario.setEmail(email.trim());
        }

        return usuarioRepository.save(usuario);
    }

    @Override
    public void cambiarPassword(Long id, String oldPassword, String newPassword) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        if (!passwordEncoder.matches(oldPassword, usuario.getPassword())) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }

        if (newPassword == null || newPassword.length() < 4) {
            throw new IllegalArgumentException("La nueva contraseña debe tener al menos 4 caracteres");
        }

        usuario.setPassword(passwordEncoder.encode(newPassword));
        usuarioRepository.save(usuario);
    }
}
