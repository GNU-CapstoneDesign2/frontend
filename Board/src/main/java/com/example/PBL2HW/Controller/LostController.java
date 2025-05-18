package com.example.PBL2HW.Controller;

import com.example.PBL2HW.RequestDto.CommonCreate;
import com.example.PBL2HW.RequestDto.CommonUpdate;
import com.example.PBL2HW.RequestDto.LostCreate;
import com.example.PBL2HW.ResponseDto.ResCommon;
import com.example.PBL2HW.ResponseDto.ResLost;
import com.example.PBL2HW.Service.CommonService;
import com.example.PBL2HW.Service.LostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@RestController
public class LostController {
    private final CommonService commonService;
    private final LostService lostService;

    // lost 게시글 작성
    @PostMapping(value = "/posts/lost", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Long create(@RequestPart(value = "image", required = false) List<MultipartFile> image,
                       @RequestPart(value = "json") CommonCreate requestDto) {
        return lostService.create(requestDto, image);
    }

    // lost 상세 조회
    @GetMapping("/posts/lost/{id}")
    public ResLost Lost(@PathVariable Long id) {
        return lostService.searchLost(id);
    }


    @PatchMapping(value = "/posts/lost/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Long update(@PathVariable Long id,
                       @RequestPart(value = "json") CommonUpdate requestDto,
                       @RequestPart(value = "image", required = false)List<MultipartFile> image) {
        return lostService.update(id, requestDto, image);
    }
}
