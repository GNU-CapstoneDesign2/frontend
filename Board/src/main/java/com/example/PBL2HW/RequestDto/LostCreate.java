package com.example.PBL2HW.RequestDto;

import com.example.PBL2HW.Entity.Common;
import com.example.PBL2HW.Entity.Coordinates;
import com.example.PBL2HW.Entity.Lost;
import lombok.Builder;
import lombok.Getter;

@Getter
public class LostCreate {
    private String name;
    private String gender;
    private String petNum;
    private String breed;
    private String phone;
    private Integer reward;

    @Builder
    public LostCreate(String name, String gender, String petNum, String breed, String phone, Integer reward) {
        this.name = name;
        this.gender = gender;
        this.petNum = petNum;
        this.breed = breed;
        this.phone = phone;
        this.reward = reward;
    }
}
