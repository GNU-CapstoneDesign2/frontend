package com.example.PBL2HW.Entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@Entity
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "common_id")
    private Common common;

    private String origFileName;
    private String filePath;
    private Long filesize;

    @Builder
    public Image(String origFileName, String filePath, Long size, Common common) {
        this.origFileName = origFileName;
        this.filePath = filePath;
        this.filesize = size;
        this.setCommon(common);
    }

    public void setCommon(Common common) {
        this.common = common;
        if(common == null) return;

        if(!common.getImages().contains(this))
            common.getImages().add(this);
    }
}
