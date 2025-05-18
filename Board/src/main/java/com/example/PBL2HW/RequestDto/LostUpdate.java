package com.example.PBL2HW.RequestDto;

import lombok.Builder;
import lombok.Getter;

@Getter
public class LostUpdate {
    private String name;
    private String gender;
    private String petNum;
    private String breed;
    private String phone;
    private Integer reward;

    @Builder
    public LostUpdate(String name, String gender, String petNum, String breed, String phone, Integer reward) {
        this.name = name;
        this.gender = gender;
        this.petNum = petNum;
        this.breed = breed;
        this.phone = phone;
        this.reward = reward;

    }
}
