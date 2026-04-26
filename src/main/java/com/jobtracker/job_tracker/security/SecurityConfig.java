package com.jobtracker.job_tracker.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomUserDetailService userDetailService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // disable crsf
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST,"/api/users/register").permitAll()
                        .requestMatchers(HttpMethod.GET,"/api/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET,"/api/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE,"/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST,"/api/jobs").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET,"/api/jobs/**").permitAll()
                        .anyRequest().authenticated()).httpBasic(basic ->
                        basic.realmName("Job Tracker"));
        return http.build();
    }


}
