package com.proyecto.gastospersonales.domain.dto;

public class AuthResponse {
    private Long id;
    private String username;
    private String email;
    private String nombre;
    private String token;

    public AuthResponse() {
    }

    public AuthResponse(Long id, String username, String email, String nombre, String token) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.nombre = nombre;
        this.token = token;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
