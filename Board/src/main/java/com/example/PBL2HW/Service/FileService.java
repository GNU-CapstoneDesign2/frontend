package com.example.PBL2HW.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileService {
    private final String uploadDir = System.getProperty("user.dir") + "/upload";
    private final String urlPrefix = "/upload";

    public String saveFile(MultipartFile file) {
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs(); // 디렉토리 없으면 생성
        }
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        File dest = new File(uploadDir, fileName);
        try {
            file.transferTo(dest);
        } catch (IOException e) {
            throw new RuntimeException("이미지 저장 실패", e);
        }

        return dest.getAbsolutePath();
    }

    public String upload(MultipartFile file) {
        if(file.isEmpty()){
            throw new RuntimeException("이미지가 비어있습니다.");
        }

        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        } // 디렉토리 없으면 생성

        String originalFilename = file.getOriginalFilename();
        String newFilename = UUID.randomUUID() + "_" + originalFilename;

        File dest = new File(uploadDir, newFilename);

        try {
            file.transferTo(dest);
        } catch (IOException e) {
            throw new RuntimeException("이미지 저장 실패", e);
        }

        return urlPrefix + newFilename;
    }
}
