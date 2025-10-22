package com.proyecto.gastospersonales.interfaz.web;

import com.proyecto.gastospersonales.domain.model.Usuario;
import com.proyecto.gastospersonales.domain.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.Map;
import java.util.Optional;

/**
 * Controlador para Fine - Gestión de Finanzas Personales
 * Maneja autenticación, login y páginas principales
 */
@Controller
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    /**
     * Página de autenticación
     */
    @GetMapping("/auth")
    public String auth(HttpSession session, Model model) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario != null) {
            model.addAttribute("usuario", usuario);
            return "dashboard";
        }
        return "login";
    }

    /**
     * Página de login
     */
    @GetMapping("/login")
    public String loginPage(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario != null) {
            return "redirect:/dashboard";
        }
        return "login";
    }

    /**
     * Página de dashboard (área privada)
     */
    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario == null) {
            return "redirect:/login";
        }
        model.addAttribute("usuario", usuario);
        return "dashboard";
    }

    /**
     * API Login para React
     */
    @PostMapping("/api/auth/login")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> apiLogin(
            @RequestBody Map<String, String> credentials,
            HttpSession session) {
        
        try {
            String nombreUsuario = credentials.get("nombreUsuario");
            String password = credentials.get("password");
            
            if (nombreUsuario == null || password == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Usuario y contraseña son requeridos"
                ));
            }
            
            Optional<Usuario> usuarioOpt = usuarioService.autenticar(nombreUsuario, password);
            
            if (usuarioOpt.isPresent()) {
                Usuario usuario = usuarioOpt.get();
                session.setAttribute("usuario", usuario);
                
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Login exitoso",
                    "usuario", Map.of(
                        "id", usuario.getId(),
                        "nombreUsuario", usuario.getUsername(),
                        "email", usuario.getEmail(),
                        "fechaCreacion", usuario.getFechaCreacion(),
                        "ultimoAcceso", usuario.getUltimoAcceso(),
                        "activo", usuario.getActivo()
                    )
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Usuario o contraseña incorrectos"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Error en el servidor"
            ));
        }
    }

    /**
     * API Logout para React
     */
    @PostMapping("/api/auth/logout")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> apiLogout(HttpSession session) {
        try {
            session.invalidate();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Sesión cerrada exitosamente"
            ));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Sesión cerrada"
            ));
        }
    }

    /**
     * API para validar sesión actual
     */
    @GetMapping("/api/auth/session")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> validateSession(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario != null) {
            return ResponseEntity.ok(Map.of(
                "usuario", Map.of(
                    "id", usuario.getId(),
                    "nombreUsuario", usuario.getUsername(),
                    "email", usuario.getEmail(),
                    "fechaCreacion", usuario.getFechaCreacion(),
                    "ultimoAcceso", usuario.getUltimoAcceso(),
                    "activo", usuario.getActivo()
                )
            ));
        }
        return ResponseEntity.status(401).body(Map.of(
            "error", "No autenticado"
        ));
    }

    /**
     * API Registro de nuevo usuario para React
     */
    @PostMapping("/api/auth/register")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> apiRegister(
            @RequestBody Map<String, String> registrationData) {
        
        try {
            String nombreUsuario = registrationData.get("nombreUsuario");
            String email = registrationData.get("email");
            String password = registrationData.get("password");
            String nombreCompleto = registrationData.get("nombreCompleto");
            
            // Validaciones básicas
            if (nombreUsuario == null || nombreUsuario.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "El nombre de usuario es requerido"
                ));
            }
            
            if (email == null || email.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "El email es requerido"
                ));
            }
            
            if (password == null || password.length() < 6) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "La contraseña debe tener al menos 6 caracteres"
                ));
            }
            
            if (nombreCompleto == null || nombreCompleto.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "El nombre completo es requerido"
                ));
            }
            
            // Verificar si ya existe el username
            if (usuarioService.existeUsername(nombreUsuario.trim())) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "El nombre de usuario ya existe"
                ));
            }
            
            // Verificar si ya existe el email
            if (usuarioService.existeEmail(email.trim())) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "El email ya está registrado"
                ));
            }
            
            // Registrar el usuario
            Usuario nuevoUsuario = usuarioService.registrarUsuario(
                nombreUsuario.trim(),
                email.trim(),
                password,
                nombreCompleto.trim()
            );
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Usuario registrado exitosamente",
                "usuario", Map.of(
                    "id", nuevoUsuario.getId(),
                    "nombreUsuario", nuevoUsuario.getUsername(),
                    "email", nuevoUsuario.getEmail(),
                    "nombreCompleto", nuevoUsuario.getNombreCompleto(),
                    "fechaCreacion", nuevoUsuario.getFechaCreacion(),
                    "activo", nuevoUsuario.getActivo()
                )
            ));
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                "success", false,
                "message", "Error al registrar usuario: " + e.getMessage()
            ));
        }
    }

    /**
     * API para verificar disponibilidad de username
     */
    @GetMapping("/api/auth/check-username")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> checkUsername(@RequestParam String username) {
        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "available", false,
                "message", "Nombre de usuario requerido"
            ));
        }
        
        boolean available = !usuarioService.existeUsername(username.trim());
        return ResponseEntity.ok(Map.of(
            "available", available,
            "message", available ? "Nombre de usuario disponible" : "Nombre de usuario ya existe"
        ));
    }

    /**
     * API para verificar disponibilidad de email
     */
    @GetMapping("/api/auth/check-email")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> checkEmail(@RequestParam String email) {
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                "available", false,
                "message", "Email requerido"
            ));
        }
        
        boolean available = !usuarioService.existeEmail(email.trim());
        return ResponseEntity.ok(Map.of(
            "available", available,
            "message", available ? "Email disponible" : "Email ya está registrado"
        ));
    }

    /**
     * Procesar login (legacy para HTML forms)
     */
    @PostMapping("/login")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> procesarLogin(
            @RequestParam String usernameOrEmail,
            @RequestParam String password,
            HttpSession session) {
        
        try {
            Optional<Usuario> usuarioOpt = usuarioService.autenticar(usernameOrEmail, password);
            
            if (usuarioOpt.isPresent()) {
                Usuario usuario = usuarioOpt.get();
                session.setAttribute("usuario", usuario);
                
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Login exitoso",
                    "redirectUrl", "/dashboard"
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Credenciales incorrectas"
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "Error en el servidor: " + e.getMessage()
            ));
        }
    }

    /**
     * Cerrar sesión (legacy)
     */
    @PostMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }

    /**
     * API para obtener información del usuario actual (legacy)
     */
    @GetMapping("/api/user")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getCurrentUser(HttpSession session) {
        Usuario usuario = (Usuario) session.getAttribute("usuario");
        if (usuario != null) {
            return ResponseEntity.ok(Map.of(
                "id", usuario.getId(),
                "username", usuario.getUsername(),
                "email", usuario.getEmail(),
                "nombreCompleto", usuario.getNombreCompleto(),
                "ultimoAcceso", usuario.getUltimoAcceso()
            ));
        }
        return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
    }
}