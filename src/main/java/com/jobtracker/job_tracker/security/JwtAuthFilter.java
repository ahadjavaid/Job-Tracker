package com.jobtracker.job_tracker.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
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
            username = jwtUtil.extractUsername(token);

        }

        // if username found and not already authenticated
        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // load user from database
            UserDetails userDetails = userDetailService.loadUserByUsername(username);

            // validate token
            if(jwtUtil.validateToken(token,username)) {

                // create authentication object
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,null,userDetails.getAuthorities());

                // add request details to auth object
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // tell spring security this user is authenticated
                SecurityContextHolder.getContext().setAuthentication(authToken);

            }

        }

        // pass request to next filter or controller
        filterChain.doFilter(request,response);

    }
}
