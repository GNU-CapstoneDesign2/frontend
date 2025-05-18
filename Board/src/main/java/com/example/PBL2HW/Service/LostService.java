package com.example.PBL2HW.Service;

import com.example.PBL2HW.Entity.Common;
import com.example.PBL2HW.Entity.Coordinates;
import com.example.PBL2HW.Entity.Image;
import com.example.PBL2HW.Entity.Lost;
import com.example.PBL2HW.RequestDto.CommonCreate;
import com.example.PBL2HW.RequestDto.CommonUpdate;
import com.example.PBL2HW.RequestDto.LostCreate;
import com.example.PBL2HW.RequestDto.LostUpdate;
import com.example.PBL2HW.ResponseDto.LostDto;
import com.example.PBL2HW.ResponseDto.ResLost;
import com.example.PBL2HW.repository.LostRepository;
import com.example.PBL2HW.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class LostService {
    private final PostRepository postRepository;
    private final LostRepository lostRepository;
    private final FileService fileService;

    // 게시글 작성
    @Transactional
    public Long create(CommonCreate commonCreate, List<MultipartFile> image) {
        Coordinates coord = new Coordinates(
                commonCreate.getCoordinates().getLatitude(),
                commonCreate.getCoordinates().getLongitude()
        );

        Common common = Common.builder()
                .userId(commonCreate.getUserId())
                .state(commonCreate.getState())
                .date(commonCreate.getDate())
                .address(commonCreate.getAddress())
                .petType(commonCreate.getPetType())
                .content(commonCreate.getContent())
                .coordinates(coord)
                .build();

        if (image != null && !image.isEmpty()) {
            for (MultipartFile file : image) {
                String filePath = fileService.saveFile(file);
                Image img = Image.builder()
                        .origFileName(file.getOriginalFilename())
                        .filePath(filePath)
                        .size(file.getSize())
                        .build();
                common.addImage(img);
            }
        }

//        postRepository.save(common);

        LostCreate lostCreate = commonCreate.getLostCreate();
        Lost lost = toEntity(common, lostCreate);

        return lostRepository.save(lost).getId();
    }

    // Lost 조회
    @Transactional(readOnly = true)
    public ResLost searchLost(Long id) {
        Lost lost = lostRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시물이 존재하지 않습니다."));
        return new ResLost(lost);
    }

    // lost 게시글 수정
    @Transactional
    public Long update(Long id, CommonUpdate requestDto, List<MultipartFile> image) {
        Lost lost = lostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 게시물이 존재하지 않습니다."));

        Common common = lost.getCommon();

        Coordinates updateCoordinates = requestDto.getCoordinates().toEntity();

        common.update(
                requestDto.getAddress(),
                requestDto.getPetType(),
                requestDto.getContent(),
                updateCoordinates
                );

        if (image != null && !image.isEmpty()) {
            List<Image> img = image.stream()
                    .map(file -> {
                        String imageUrl = fileService.upload(file);
                        return Image.builder()
                                .origFileName(file.getOriginalFilename())
                                .filePath(imageUrl)
                                .size(file.getSize())
                                .common(common)
                                .build();
                    })
                    .collect(Collectors.toList());

            common.updateImage(img);
        }

        LostUpdate lostUpdate = requestDto.getLostUpdate();
        if (lostUpdate != null) {
            lost.update(
                    lostUpdate.getName(),
                    lostUpdate.getGender(),
                    lostUpdate.getPetNum(),
                    lostUpdate.getBreed(),
                    lostUpdate.getPhone(),
                    lostUpdate.getReward()
            );
        }
//        lostRepository.save(lost);

        return id;
    }

    // toEntity
    public Lost toEntity(Common common, LostCreate lostCreate) {
        return Lost.builder()
                .common(common)
                .name(lostCreate.getName())
                .gender(lostCreate.getGender())
                .petNum(lostCreate.getPetNum())
                .breed(lostCreate.getBreed())
                .phone(lostCreate.getPhone())
                .reward(lostCreate.getReward())
                .build();
    }
}
