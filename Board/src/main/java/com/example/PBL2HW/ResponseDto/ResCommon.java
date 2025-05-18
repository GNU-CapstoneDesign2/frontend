package com.example.PBL2HW.ResponseDto;

import com.example.PBL2HW.Entity.Common;
import com.example.PBL2HW.Entity.Image;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class ResCommon {
    private Long id;
    private Long userId;
    private String state;
    private LocalDateTime createdAt;
    private LocalDateTime date;
    private String address;
    private String petType;
    private String content;
    private ResCoordinates coordinates;
    private List<ImageDto> images;
    private LostDto lost;

    public ResCommon(Common Entity) {
        this.id = Entity.getId();
        this.userId = Entity.getUserId();
        this.state = Entity.getState();
        this.createdAt = Entity.getModifiedAt();
        this.date = Entity.getDate();
        this.address = Entity.getAddress();
        this.petType = Entity.getPetType();
        this.content = Entity.getContent();
        this.images = Entity.getImages().stream().map(ImageDto::new).collect(Collectors.toList());
        this.coordinates = new ResCoordinates(Entity.getCoordinates());
    }
}
