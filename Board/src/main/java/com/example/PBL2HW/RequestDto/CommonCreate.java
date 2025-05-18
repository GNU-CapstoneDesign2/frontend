package com.example.PBL2HW.RequestDto;

import com.example.PBL2HW.Entity.Common;
import com.example.PBL2HW.Entity.Coordinates;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CommonCreate {
//    private Long id;
    private Long userId;
    private String state;
    private LocalDateTime date;
    private String address;
    private String petType;
    private String content;
    private ReqCoordinates coordinates;

    private LostCreate lostCreate;

    @Builder
    public CommonCreate(Long userId, String state, LocalDateTime date,
                        String address, String petType, String content, ReqCoordinates coordinates, LostCreate lostCreate) {
//        this.id = id;
        this.userId = userId;
        this.state = state;
        this.date = date;
        this.address = address;
        this.petType = petType;
        this.content = content;
        this.coordinates = coordinates;
        this.lostCreate = lostCreate;
    }

    public Common toEntity() {
        Coordinates coordEntity = coordinates.toEntity();

        return Common.builder()
//                .id(id)
                .userId(userId)
                .state(state)
                .date(date)
                .address(address)
                .petType(petType)
                .content(content)
                .coordinates(coordEntity)
                .build();
    }
}
