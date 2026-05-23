package com.jobtracker.job_tracker.repository;

import com.jobtracker.job_tracker.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByUserId(Long userId);

    List<Application> findByJobEmployerId(Long employerId);

    List<Application> findByJobId(Long jobId);

    List<Application> findByStatus(String status);

    Boolean existsByUserIdAndJobId(Long userId, Long jobId);

}
