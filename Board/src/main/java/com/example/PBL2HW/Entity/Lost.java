package com.example.PBL2HW.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@Entity
public class Lost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "common_id")
    private Common common;

    private String name;
    private String gender;
    private String petNum;
    private String breed;
    private String phone;
    private Integer reward;

    @Builder
    public Lost(Common common, String name, String gender, String petNum, String breed, String phone, Integer reward) {
        this.common = common;
        this.name = name;
        this.gender = gender;
        this.petNum = petNum;
        this.breed = breed;
        this.phone = phone;
        this.reward = reward;
    }

    public void update(String name, String gender, String petNum, String breed, String phone, Integer reward) {
        this.name = name;
        this.gender = gender;
        this.petNum = petNum;
        this.breed = breed;
        this.phone = phone;
        this.reward = reward;
    }
}
