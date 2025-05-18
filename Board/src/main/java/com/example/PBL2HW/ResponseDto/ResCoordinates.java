package com.example.PBL2HW.ResponseDto;

import com.example.PBL2HW.Entity.Coordinates;
import lombok.Getter;

@Getter
public class ResCoordinates {
    private double latitude;
    private double longitude;

    public ResCoordinates(Coordinates coordinates) {
        this.latitude = coordinates.getLatitude();
        this.longitude = coordinates.getLongitude();
    }
}
