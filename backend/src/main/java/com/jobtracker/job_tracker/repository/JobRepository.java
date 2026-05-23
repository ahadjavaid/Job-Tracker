package com.jobtracker.job_tracker.repository;

import com.jobtracker.job_tracker.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByStatus(String status);

    List<Job> findByJobType(String jobType);

    List<Job> findByCompany(String company);

    List<Job> findByTitleContainingIgnoreCase(String keyword);

    List<Job> findByEmployerId(Long employerId);

}
