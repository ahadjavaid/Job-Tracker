package com.jobtracker.job_tracker.security;

import com.jobtracker.job_tracker.entity.User;
import com.jobtracker.job_tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // find user in database
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new UsernameNotFoundException("user not found: " + username));

        // return spring security UserDetails object , spring verify password and roles

        return new org.springframework.security.core.userdetails.User(user.getUsername(),
                user.getPassword(), Collections.singletonList(new SimpleGrantedAuthority(user.getRole())));
    }
}
