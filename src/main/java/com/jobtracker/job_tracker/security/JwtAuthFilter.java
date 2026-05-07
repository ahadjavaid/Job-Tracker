package com.jobtracker.job_tracker.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailService userDetailService;


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // read the authorization header
        String authHeader = request.getHeader("Authorization");

        String token = null;
        String username = null;

        // check if header exist and starts with "Bearer "
        if(authHeader != null && authHeader.startsWith("Bearer ")) {

            // extract token and remove "Bearer " prefix
            token = authHeader.substring(7);

            // extract username from token
             // ✅ Wrap in try/catch
        // If token is malformed → just skip it!!
        // Don't crash the entire request!!
        try {
            username = jwtUtil.extractUsername(token);
        } catch (Exception e) {
            // Token is malformed or invalid
            // Just ignore and continue!!
            // Let Spring Security handle it!!
        }

        }

        // if username found and not already authenticated
        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            try {
            UserDetails userDetails = userDetailService
                    .loadUserByUsername(username);

            if (jwtUtil.validateToken(token, username)) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request));
                SecurityContextHolder.getContext()
                        .setAuthentication(authToken);
            }
        } catch (Exception e) {
            // User not found or token invalid
            // Just skip — Spring Security handles it!!
        }

        }

        // pass request to next filter or controller
        filterChain.doFilter(request,response);

    }
}
