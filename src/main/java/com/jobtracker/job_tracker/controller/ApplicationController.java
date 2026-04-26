package com.jobtracker.job_tracker.controller;

import com.jobtracker.job_tracker.dto.ApplicationResponse;
import com.jobtracker.job_tracker.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<ApplicationResponse> applyToJob(@RequestParam Long jobId){

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.status(HttpStatus.CREATED).
                body(applicationService.applyToJob(username, jobId));
    }

    @GetMapping("/my-applications")
    public ResponseEntity<List<ApplicationResponse>> getUserApplications() {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(applicationService.getUserApplications(username));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApplicationResponse> updateStatus(@PathVariable Long id,
                                                            @RequestParam String updateStatus) {
        return ResponseEntity.ok(applicationService.updateStatus(id, updateStatus));
    }
}
