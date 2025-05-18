package com.example.PBL2HW.ResponseDto;

import com.example.PBL2HW.Entity.Lost;
import lombok.Getter;

@Getter
public class LostDto {

    private String name;
    private String gender;
    private String petNum;
    private String breed;
    private String phone;
    private Integer reward;

    public LostDto(Lost lost) {
        this.name = lost.getName();
        this.gender = lost.getGender();
        this.petNum = lost.getPetNum();
        this.breed = lost.getBreed();
        this.phone = lost.getPhone();
        this.reward = lost.getReward();
    }
}
