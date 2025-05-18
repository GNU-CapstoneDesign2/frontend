package com.example.PBL2HW.Controller;

import com.example.PBL2HW.Entity.Common;
import com.example.PBL2HW.RequestDto.CommonCreate;
import com.example.PBL2HW.RequestDto.CommonUpdate;
import com.example.PBL2HW.ResponseDto.ResCommon;
import com.example.PBL2HW.Service.CommonService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class CommonController {
    private final CommonService commonService;

    // found 게시글 작성
    @PostMapping(value = "/posts/found", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Long create(@RequestPart(value = "image", required = false)List<MultipartFile> image,
                       @RequestPart(value = "json") CommonCreate requestDto) {
        return commonService.create(requestDto, image);
    }

    // Found 상세 조회
    @GetMapping("/posts/found/{id}")
    public ResCommon Found(@PathVariable Long id) {
        return commonService.searchFound(id);
    }

    // found 게시글 수정
    @PatchMapping(value = "/posts/found/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Long update(@PathVariable Long id,
                       @RequestPart(value = "json") CommonUpdate requestDto,
                       @RequestPart(value = "image", required = false)List<MultipartFile> image) {
        return commonService.update(id, requestDto, image);
    }

    // 게시글 삭제
    @DeleteMapping("/posts/{id}")
    public void delete(@PathVariable Long id) {
        commonService.delete(id);
    }
}
