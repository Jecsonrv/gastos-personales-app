package com.proyecto.gastospersonales.infrastructure.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Configuración de la infraestructura para Clean Architecture
 * Especifica el escaneo de entidades y repositorios
 */
@Configuration
@EntityScan(basePackages = "com.proyecto.gastospersonales.domain.model")
@EnableJpaRepositories(basePackages = "com.proyecto.gastospersonales.infrastructure.repository")
public class InfrastructureConfig {
}