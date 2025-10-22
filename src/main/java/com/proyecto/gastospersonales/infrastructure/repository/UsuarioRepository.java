package com.proyecto.gastospersonales.infrastructure.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.proyecto.gastospersonales.domain.model.Usuario;

/**
 * Repositorio para la entidad Usuario
 * Maneja operaciones de persistencia para usuarios de Fine
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca un usuario por su nombre de usuario
     */
    Optional<Usuario> findByUsername(String username);

    /**
     * Busca un usuario por su email
     */
    Optional<Usuario> findByEmail(String email);

    /**
     * Busca un usuario por username o email (para login)
     */
    @Query("SELECT u FROM Usuario u WHERE u.username = :loginField OR u.email = :loginField")
    Optional<Usuario> findByUsernameOrEmail(@Param("loginField") String loginField);

    /**
     * Verifica si existe un usuario con el username dado
     */
    boolean existsByUsername(String username);

    /**
     * Verifica si existe un usuario con el email dado
     */
    boolean existsByEmail(String email);

    /**
     * Busca usuarios activos
     */
    @Query("SELECT u FROM Usuario u WHERE u.activo = true")
    java.util.List<Usuario> findActiveUsers();

    /**
     * Cuenta usuarios activos
     */
    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.activo = true")
    long countActiveUsers();
}