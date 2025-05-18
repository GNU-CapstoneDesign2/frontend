package com.example.PBL2HW.repository;

import com.example.PBL2HW.Entity.Lost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface LostRepository extends JpaRepository<Lost, Long> {
    @Modifying
    @Transactional
    @Query("delete from Lost l where l.common.id = :commonId")
    void deleteByCommonId(Long commonId);
}
