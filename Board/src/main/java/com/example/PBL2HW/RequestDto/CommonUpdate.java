package com.example.PBL2HW.RequestDto;

import com.example.PBL2HW.Entity.Common;
import com.example.PBL2HW.Entity.Coordinates;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CommonUpdate {
    private String address;
    private String petType;
    private String content;
    private ReqCoordinates coordinates;
    private LostUpdate lostUpdate;

    @Builder
    public CommonUpdate(String address, String petType, String content, ReqCoordinates coordinates, LostUpdate lost){
        this.address = address;
        this.petType = petType;
        this.content = content;
        this.coordinates = coordinates;
        this.lostUpdate = lost;
    }
    public Common toEntity(){
        Coordinates coordEntity = coordinates.toEntity();

        return Common.builder()
                .address(address)
                .petType(petType)
                .content(content)
                .coordinates(coordEntity)
                .build();
    }
}
