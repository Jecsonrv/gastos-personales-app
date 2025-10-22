package com.proyecto.gastospersonales.application.service;

import com.proyecto.gastospersonales.domain.model.Usuario;
import com.proyecto.gastospersonales.domain.service.UsuarioService;
import com.proyecto.gastospersonales.infrastructure.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Implementación del servicio de Usuario
 * Maneja la lógica de negocio relacionada con usuarios
 */
@Service
@Transactional
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Simple password encoder using SHA-256 (temporary implementation)
     * In production, use BCryptPasswordEncoder from Spring Security
     */
    private String encodePassword(String rawPassword) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(rawPassword.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Error encoding password", e);
        }
    }

    private boolean matchesPassword(String rawPassword, String encodedPassword) {
        return encodePassword(rawPassword).equals(encodedPassword);
    }

    @Override
    public Optional<Usuario> autenticar(String usernameOrEmail, String password) {
        Optional<Usuario> usuario = usuarioRepository.findByUsernameOrEmail(usernameOrEmail);
        
        if (usuario.isPresent() && usuario.get().getActivo()) {
            Usuario u = usuario.get();
            if (matchesPassword(password, u.getPassword())) {
                // Actualizar último acceso
                u.actualizarUltimoAcceso();
                usuarioRepository.save(u);
                return usuario;
            }
        }
        
        return Optional.empty();
    }

    @Override
    public Usuario registrarUsuario(String username, String email, String password, String nombreCompleto) {
        // Validar que username y email no existan
        if (existeUsername(username)) {
            throw new IllegalArgumentException("El nombre de usuario ya existe");
        }
        
        if (existeEmail(email)) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        // Crear nuevo usuario con contraseña encriptada
        Usuario nuevoUsuario = new Usuario(
            username,
            email,
            encodePassword(password),
            nombreCompleto
        );

        return usuarioRepository.save(nuevoUsuario);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerUsuarioPorUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> obtenerUsuariosActivos() {
        return usuarioRepository.findActiveUsers();
    }

    @Override
    public Usuario actualizarUsuario(Long id, String email, String nombreCompleto) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Verificar que el email no esté en uso por otro usuario
        if (!usuario.getEmail().equals(email) && existeEmail(email)) {
            throw new IllegalArgumentException("El email ya está en uso por otro usuario");
        }

        usuario.setEmail(email);
        usuario.setNombreCompleto(nombreCompleto);
        usuario.setFechaActualizacion(LocalDateTime.now());

        return usuarioRepository.save(usuario);
    }

    @Override
    public void cambiarPassword(Long id, String passwordAntigua, String passwordNueva) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Verificar contraseña actual
        if (!matchesPassword(passwordAntigua, usuario.getPassword())) {
            throw new IllegalArgumentException("La contraseña actual es incorrecta");
        }

        // Actualizar contraseña
        usuario.setPassword(encodePassword(passwordNueva));
        usuario.setFechaActualizacion(LocalDateTime.now());

        usuarioRepository.save(usuario);
    }

    @Override
    public void desactivarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        usuario.setActivo(false);
        usuario.setFechaActualizacion(LocalDateTime.now());

        usuarioRepository.save(usuario);
    }

    @Override
    public void activarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        usuario.setActivo(true);
        usuario.setFechaActualizacion(LocalDateTime.now());

        usuarioRepository.save(usuario);
    }

    @Override
    public void actualizarUltimoAcceso(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        usuario.actualizarUltimoAcceso();
        usuarioRepository.save(usuario);
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
}