package com.jobtracker.job_tracker.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        // @Autowired
        // private PasswordEncoder passwordEncoder;
        //
        // @Autowired
        // private CustomUserDetailService userDetailService;

        @Autowired
        private JwtAuthFilter jwtAuthFilter;

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                // disable crsf
                http.csrf(csrf -> csrf.disable())
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                // tell spring security don't create session, JWT is stateless we don't need
                                // server sessions
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/users/register").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.GET, "/api/users/**").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.DELETE, "/**").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.POST, "/api/jobs").hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.GET, "/api/jobs/**").permitAll()
                                                .requestMatchers(HttpMethod.PUT, "/api/applications/*/status")
                                                .hasRole("ADMIN")
                                                .requestMatchers(HttpMethod.GET, "/api/applications").hasRole("ADMIN")
                                                .anyRequest().authenticated())
                                .addFilterBefore(jwtAuthFilter,
                                                UsernamePasswordAuthenticationFilter.class);
                return http.build();
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
                return config.getAuthenticationManager();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();

                // Allow React app
                configuration.setAllowedOrigins(
                                List.of("http://localhost:3000"));

                // ✅ Allow ALL methods including
                // POST, PUT, DELETE, OPTIONS
                configuration.setAllowedMethods(
                                List.of("GET", "POST", "PUT",
                                                "DELETE", "OPTIONS", "PATCH"));

                // ✅ Allow ALL headers
                configuration.setAllowedHeaders(
                                List.of("*"));

                // ✅ Expose Authorization header to React
                configuration.setExposedHeaders(
                                List.of("Authorization"));

                // ✅ Allow credentials (JWT token)
                configuration.setAllowCredentials(true);

                // ✅ Cache preflight for 1 hour
                configuration.setMaxAge(3600L);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration(
                                "/**", configuration);
                return source;
        }
}
