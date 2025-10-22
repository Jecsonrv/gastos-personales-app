package com.proyecto.gastospersonales.interfaz.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

/**
 * Controlador REST para información general de la API
 * Proporciona endpoints de estado y documentación básica
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"}) // React/Vite dev servers
public class ApiInfoController {
    
    /**
     * Endpoint de información de la API
     */
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> obtenerInformacionApi() {
        Map<String, Object> info = Map.of(
            "nombre", "Gestor de Compras Personales API",
            "version", "2.0 - Clean Architecture",
            "descripcion", "API REST para gestión financiera personal",
            "arquitectura", "Clean Architecture",
            "tecnologias", Map.of(
                "backend", "Spring Boot 3.2+",
                "base_datos", "PostgreSQL",
                "java", "17+",
                "frontend_planificado", "React + TypeScript + Vite"
            ),
            "fecha_servidor", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")),
            "estado", "Activo",
            "endpoints", Map.of(
                "movimientos", "/api/movimientos",
                "categorias", "/api/categorias", 
                "info", "/api/info",
                "estado", "/api/status"
            )
        );
        
        return ResponseEntity.ok(info);
    }
    
    /**
     * Endpoint de estado de la API
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> obtenerEstado() {
        Map<String, Object> estado = Map.of(
            "estado", "OK",
            "timestamp", LocalDateTime.now(),
            "mensaje", "API funcionando correctamente",
            "fase", "MVP - Fase 1 (Consola) + API Base preparada para Fase 2 (React Frontend)"
        );
        
        return ResponseEntity.ok(estado);
    }
}