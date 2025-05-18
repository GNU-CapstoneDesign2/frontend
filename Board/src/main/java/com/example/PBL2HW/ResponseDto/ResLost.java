package com.example.PBL2HW.ResponseDto;

import com.example.PBL2HW.Entity.Common;
import com.example.PBL2HW.Entity.Lost;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class ResLost {
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

    public ResLost(Lost lost) {
        Common common = lost.getCommon();

        this.userId = common.getUserId();
        this.state = common.getState();
        this.date = common.getDate();
        this.address = common.getAddress();
        this.petType = common.getPetType();
        this.content = common.getContent();
        this.images = common.getImages().stream().map(ImageDto::new).collect(Collectors.toList());
        this.coordinates = new ResCoordinates(common.getCoordinates());

        this.lost = new LostDto(lost);
    }
}
