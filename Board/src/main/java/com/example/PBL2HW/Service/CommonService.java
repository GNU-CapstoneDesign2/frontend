package com.example.PBL2HW.Service;

import com.example.PBL2HW.Entity.Coordinates;
import com.example.PBL2HW.Entity.Image;
import com.example.PBL2HW.RequestDto.CommonUpdate;
import com.example.PBL2HW.ResponseDto.ResPostListDto;
import com.example.PBL2HW.ResponseDto.ResCommon;
import com.example.PBL2HW.RequestDto.CommonCreate;
import com.example.PBL2HW.Entity.Common;
import com.example.PBL2HW.repository.LostRepository;
import com.example.PBL2HW.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.PBL2HW.RequestDto.ReqCoordinates;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class CommonService {
    private final PostRepository postRepository;
    private final LostRepository lostRepository;
    private final FileService fileService;

    // 게시글 작성
    @Transactional
    public Long create(CommonCreate commonCreate, List<MultipartFile> image) {
        Common common = commonCreate.toEntity();

        if(image != null && !image.isEmpty()) {
            for(MultipartFile file : image) {
                String filePath = fileService.saveFile(file);
                Image img  = Image.builder()
                        .origFileName(file.getOriginalFilename())
                        .filePath(filePath)
                        .size(file.getSize())
                        .build();

                common.addImage(img);
            }
        }

        return postRepository.save(common).getId();
    }

    // Found 조회
    @Transactional(readOnly = true)
    public ResCommon searchFound(Long id){
        Common common = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시물이 존재하지 않습니다."));
        return new ResCommon(common);
    }


    // found 게시글 수정
    @Transactional
    public Long update(Long id, CommonUpdate requestDto, List<MultipartFile> image) {
        Common common = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 게시물이 존재하지 않습니다."));
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

        return id;
    }

    // 게시글 삭제
    @Transactional
    public void delete(Long id) {
        Common common = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시물이 존재하지 않습니다."));
        lostRepository.deleteByCommonId(id);
        postRepository.delete(common);
    }
}
