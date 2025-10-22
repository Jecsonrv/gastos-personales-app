package com.proyecto.gastospersonales.interfaz.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controlador para manejar la ruta raíz y evitar el Whitelabel Error Page
 * Redirige automáticamente a la información de la API
 */
@Controller
public class RootController {

    /**
     * Maneja la ruta raíz (/) y redirige a /api/info
     * Esto evita el Whitelabel Error Page cuando no hay contenido estático
     */
    @GetMapping("/")
    public String root() {
        return "redirect:/api/info";
    }

    /**
     * Maneja /index también por si alguien intenta acceder
     */
    @GetMapping("/index")
    public String index() {
        return "redirect:/api/info";
    }
}