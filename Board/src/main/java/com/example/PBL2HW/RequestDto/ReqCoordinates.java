package com.example.PBL2HW.RequestDto;

import com.example.PBL2HW.Entity.Coordinates;
import lombok.Builder;
import lombok.Getter;

@Getter
public class ReqCoordinates {
    private double latitude;
    private double longitude;

    @Builder
    public ReqCoordinates(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Coordinates toEntity() {
        return Coordinates.builder()
                .latitude(latitude)
                .longitude(longitude)
                .build();
    }
}
