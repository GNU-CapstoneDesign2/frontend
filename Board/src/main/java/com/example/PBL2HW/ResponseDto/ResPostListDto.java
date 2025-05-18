package com.example.PBL2HW.ResponseDto;

import com.example.PBL2HW.Entity.Common;
import com.example.PBL2HW.Entity.Lost;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ResPostListDto {
    private Long id;
    private Long userId;
    private String state;
    private LocalDateTime createdAt;
    private LocalDateTime date;
    private String address;
    private String petType;
    private String content;
    private ResCoordinates coordinates;
    private Lost lost;

    public ResPostListDto(Common Entity) {
        this.id = Entity.getId();
        this.userId = Entity.getUserId();
        this.state = Entity.getState();
        this.createdAt = Entity.getModifiedAt();
        this.date = Entity.getDate();
        this.address = Entity.getAddress();
        this.petType = Entity.getPetType();
        this.content = Entity.getContent();
        this.coordinates = new ResCoordinates(Entity.getCoordinates());
    }
}
