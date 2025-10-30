package com.proyecto.gastospersonales.interfaz.web;

import com.proyecto.gastospersonales.domain.dto.ChangePasswordRequest;
import com.proyecto.gastospersonales.domain.dto.ProfileRequest;
import com.proyecto.gastospersonales.domain.model.Usuario;
import com.proyecto.gastospersonales.domain.service.AuthService;
import com.proyecto.gastospersonales.domain.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioRestController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/me")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        Usuario usuario = usuarioService.findByUsername(userDetails.getUsername()).get();
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetails userDetails, @RequestBody ProfileRequest profileRequest) {
        Usuario usuario = usuarioService.findByUsername(userDetails.getUsername()).get();
        try {
            Usuario updatedUsuario = usuarioService.actualizarPerfil(usuario.getId(), profileRequest.getNombre(), profileRequest.getEmail());
            return ResponseEntity.ok(updatedUsuario);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/me/password")
    public ResponseEntity<?> changePassword(@AuthenticationPrincipal UserDetails userDetails, @RequestBody ChangePasswordRequest changePasswordRequest) {
        Usuario usuario = usuarioService.findByUsername(userDetails.getUsername()).get();
        try {
            usuarioService.cambiarPassword(usuario.getId(), changePasswordRequest.getOldPassword(), changePasswordRequest.getNewPassword());
            return ResponseEntity.ok().body(Map.of("message", "Contraseña actualizada exitosamente"));
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
