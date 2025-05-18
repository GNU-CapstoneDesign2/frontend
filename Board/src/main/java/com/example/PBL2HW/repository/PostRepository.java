package com.example.PBL2HW.repository;

import com.example.PBL2HW.Entity.Common;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Common, Long> {
    List<Common> findAllByOrderByIdDesc();
}
