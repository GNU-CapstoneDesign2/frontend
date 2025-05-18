package com.example.PBL2HW.Entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@NoArgsConstructor
@EnableJpaAuditing
@Entity
public class Common {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private String state;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime modifiedAt;
    private LocalDateTime date;
    private String address;
    private String petType;
    private String content;

    @Embedded
    private Coordinates coordinates;

    @OneToMany(mappedBy = "common", cascade = {CascadeType.PERSIST, CascadeType.REMOVE}, orphanRemoval = true)
    private List<Image> images = new ArrayList<>();

    @Builder
    public Common(Long id, Long userId, String state, LocalDateTime createdAt, LocalDateTime date,
                  String address, String petType, String content, Coordinates coordinates) {
        this.id = id;
        this.userId = userId;
        this.state = state;
        this.createdAt = createdAt;
        this.date = date;
        this.address = address;
        this.petType = petType;
        this.content = content;
        this.coordinates = coordinates;
    }

    public void update(String address, String petType, String content, Coordinates coordinates) {
        this.address = address;
        this.petType = petType;
        this.content = content;
        this.coordinates = coordinates;
    }

    public void updateImage(List<Image> newimg) {
        this.images.clear();
        for(Image image : newimg){
            this.images.add(image);
        }
    }

    public void addImage(Image image) {
        this.images.add(image);

        if(image.getCommon() != this)
            image.setCommon(this);
    }
}