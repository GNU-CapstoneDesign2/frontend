package com.example.PBL2HW.ResponseDto;

import com.example.PBL2HW.Entity.Image;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ImageDto {
    private String filePath;

    public ImageDto(Image image) {
        this.filePath = image.getFilePath();
    }
}
