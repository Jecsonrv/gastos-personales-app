package com.proyecto.gastospersonales.interfaz.web;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Temporary debug endpoint to inspect incoming Authorization header and SecurityContext
 * Accessible under /api/auth/debug (permitted in SecurityConfig)
 */
@RestController
@RequestMapping("/api/auth/debug")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthDebugController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> debug(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> result = new HashMap<>();
        result.put("authorizationHeader", authHeader == null ? "<none>" : authHeader);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) {
            result.put("securityContext", null);
        } else {
            Map<String, Object> authInfo = new HashMap<>();
            Object principal = auth.getPrincipal();
            authInfo.put("authenticated", auth.isAuthenticated());
            authInfo.put("principalClass", principal == null ? null : principal.getClass().getName());
            authInfo.put("principal", principal == null ? null : principal.toString());
            List<String> authorities = auth.getAuthorities() == null ? List.of() : auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());
            authInfo.put("authorities", authorities);
            result.put("securityContext", authInfo);
        }

        return ResponseEntity.ok(result);
    }
}
